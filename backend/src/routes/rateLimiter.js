const requestCounts = new Map();
const blockedIPs = new Map();

const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, 
  maxRequests: 100, 
  blockDuration: 30 * 60 * 1000, 
  message: 'Muitas requisições deste IP, tente novamente mais tarde.',

  auth: {
    windowMs: 15 * 60 * 1000, 
    maxRequests: 5,
    blockDuration: 60 * 60 * 1000, 
    message: 'Muitas tentativas de login, tente novamente em 1 hora.'
  }
};

const getClientIP = (req) => {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         req.headers['x-forwarded-for']?.split(',')[0] ||
         req.headers['x-real-ip'] ||
         'unknown';
};

const cleanupOldRecords = () => {
  const now = Date.now();

  for (const [key, data] of requestCounts.entries()) {
    if (now - data.resetTime > data.windowMs) {
      requestCounts.delete(key);
    }
  }

  for (const [ip, blockTime] of blockedIPs.entries()) {
    if (now - blockTime.timestamp > blockTime.duration) {
      blockedIPs.delete(ip);
    }
  }
};

const createRateLimiter = (config = RATE_LIMIT_CONFIG) => {
  return (req, res, next) => {
    const ip = getClientIP(req);
    const now = Date.now();
    const key = `${ip}:${req.route?.path || 'general'}`;

    if (Math.random() < 0.01) {
      cleanupOldRecords();
    }

    if (blockedIPs.has(ip)) {
      const blockInfo = blockedIPs.get(ip);
      if (now - blockInfo.timestamp < blockInfo.duration) {
        return res.status(429).json({
          error: blockInfo.message || config.message,
          retryAfter: Math.ceil((blockInfo.duration - (now - blockInfo.timestamp)) / 1000)
        });
      } else {
        blockedIPs.delete(ip);
      }
    }

    let requestData = requestCounts.get(key);
    
    if (!requestData || (now - requestData.resetTime) > config.windowMs) {

      requestData = {
        count: 1,
        resetTime: now,
        windowMs: config.windowMs
      };
    } else {

      requestData.count++;
    }
    
    requestCounts.set(key, requestData);
    
    if (requestData.count > config.maxRequests) {

      blockedIPs.set(ip, {
        timestamp: now,
        duration: config.blockDuration,
        message: config.message
      });
      
      return res.status(429).json({
        error: config.message,
        retryAfter: Math.ceil(config.blockDuration / 1000)
      });
    }

    res.set({
      'X-RateLimit-Limit': config.maxRequests,
      'X-RateLimit-Remaining': Math.max(0, config.maxRequests - requestData.count),
      'X-RateLimit-Reset': new Date(requestData.resetTime + config.windowMs).toISOString()
    });
    
    next();
  };
};

const authRateLimiter = createRateLimiter(RATE_LIMIT_CONFIG.auth);

const generalRateLimiter = createRateLimiter();

const smartRateLimiter = (req, res, next) => {
  if (req.path.includes('/auth') || req.path.includes('/login')) {
    return authRateLimiter(req, res, next);
  }
  return generalRateLimiter(req, res, next);
};

const getRateLimiterStats = () => {
  return {
    activeConnections: requestCounts.size,
    blockedIPs: blockedIPs.size,
    totalBlocked: Array.from(blockedIPs.keys())
  };
};

module.exports = {
  createRateLimiter,
  authRateLimiter,
  generalRateLimiter,
  smartRateLimiter,
  getRateLimiterStats
};

