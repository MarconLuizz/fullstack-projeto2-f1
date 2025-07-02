const cache = new Map();
const cacheMetadata = new Map();

const CACHE_CONFIG = {
  defaultTTL: 5 * 60 * 1000, 
  maxSize: 1000, 
  cleanupInterval: 10 * 60 * 1000, 

  seasons: 15 * 60 * 1000, 
  search: 5 * 60 * 1000,   
  auth: 2 * 60 * 1000      
};

const generateCacheKey = (prefix, params = {}) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|');
  return `${prefix}${sortedParams ? ':' + sortedParams : ''}`;
};

const cleanupExpiredCache = () => {
  const now = Date.now();
  const keysToDelete = [];
  
  for (const [key, metadata] of cacheMetadata.entries()) {
    if (now > metadata.expiresAt) {
      keysToDelete.push(key);
    }
  }
  
  keysToDelete.forEach(key => {
    cache.delete(key);
    cacheMetadata.delete(key);
  });
  
  console.log(`Cache cleanup: removed ${keysToDelete.length} expired entries`);
};

const cleanupBySize = () => {
  if (cache.size <= CACHE_CONFIG.maxSize) return;

  const sortedEntries = Array.from(cacheMetadata.entries())
    .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
  
  const toRemove = cache.size - CACHE_CONFIG.maxSize;
  for (let i = 0; i < toRemove; i++) {
    const [key] = sortedEntries[i];
    cache.delete(key);
    cacheMetadata.delete(key);
  }
  
  console.log(`Cache cleanup: removed ${toRemove} entries due to size limit`);
};

const setCache = (key, value, ttl = CACHE_CONFIG.defaultTTL) => {
  const now = Date.now();
  
  cache.set(key, value);
  cacheMetadata.set(key, {
    createdAt: now,
    lastAccessed: now,
    expiresAt: now + ttl,
    ttl: ttl,
    hits: 0
  });

  cleanupBySize();
};

const getCache = (key) => {
  const now = Date.now();
  const metadata = cacheMetadata.get(key);
  
  if (!metadata) return null;
  
  if (now > metadata.expiresAt) {
    cache.delete(key);
    cacheMetadata.delete(key);
    return null;
  }

  metadata.lastAccessed = now;
  metadata.hits++;
  
  return cache.get(key);
};

const invalidateCache = (pattern) => {
  const keysToDelete = [];
  
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      keysToDelete.push(key);
    }
  }
  
  keysToDelete.forEach(key => {
    cache.delete(key);
    cacheMetadata.delete(key);
  });
  
  console.log(`Cache invalidation: removed ${keysToDelete.length} entries matching pattern: ${pattern}`);
  return keysToDelete.length;
};

const cacheMiddleware = (ttl, keyGenerator) => {
  return (req, res, next) => {
    const cacheKey = keyGenerator ? keyGenerator(req) : generateCacheKey(req.path, req.query);
    const cachedData = getCache(cacheKey);
    
    if (cachedData) {
      console.log(`Cache hit: ${cacheKey}`);
      return res.json(cachedData);
    }

    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (res.statusCode === 200) {
        setCache(cacheKey, data, ttl);
        console.log(`Cache set: ${cacheKey}`);
      }
      return originalJson(data);
    };
    
    next();
  };
};

const seasonsCacheMiddleware = cacheMiddleware(
  CACHE_CONFIG.seasons,
  (req) => generateCacheKey('seasons', req.query)
);

const searchCacheMiddleware = cacheMiddleware(
  CACHE_CONFIG.search,
  (req) => generateCacheKey('search', req.query)
);

const getCacheStats = () => {
  const now = Date.now();
  let totalHits = 0;
  let expiredCount = 0;
  
  for (const [key, metadata] of cacheMetadata.entries()) {
    totalHits += metadata.hits;
    if (now > metadata.expiresAt) {
      expiredCount++;
    }
  }
  
  return {
    totalEntries: cache.size,
    totalHits: totalHits,
    expiredEntries: expiredCount,
    memoryUsage: process.memoryUsage(),
    hitRate: cache.size > 0 ? (totalHits / cache.size).toFixed(2) : 0
  };
};

setInterval(cleanupExpiredCache, CACHE_CONFIG.cleanupInterval);

module.exports = {
  setCache,
  getCache,
  invalidateCache,
  generateCacheKey,
  cacheMiddleware,
  seasonsCacheMiddleware,
  searchCacheMiddleware,
  getCacheStats,
  cleanupExpiredCache
};

