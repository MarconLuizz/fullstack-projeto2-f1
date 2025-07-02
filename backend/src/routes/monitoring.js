const express = require("express");
const { getCacheStats } = require("./cacheManager");
const { getRateLimiterStats } = require("./rateLimiter");
const auth = require("./auth");

const router = express.Router();

router.get("/stats", auth, (req, res) => {
  try {
    const cacheStats = getCacheStats();
    const rateLimiterStats = getRateLimiterStats();
    
    const systemStats = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cache: cacheStats,
      rateLimiter: rateLimiterStats,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };
    
    res.json(systemStats);
  } catch (err) {
    console.error("Erro ao obter estatísticas:", err.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;

