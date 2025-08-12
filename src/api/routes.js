const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Modules endpoint
router.get('/modules', (req, res) => {
  const config = require('../../config/app.config');
  const enabledModules = Object.entries(config.modules)
    .filter(([name, moduleConfig]) => moduleConfig.enabled)
    .map(([name, moduleConfig]) => ({
      name,
      path: moduleConfig.path,
      enabled: moduleConfig.enabled
    }));

  res.json({
    modules: enabledModules,
    count: enabledModules.length
  });
});

// Module configuration endpoint
router.get('/modules/:moduleName/config', (req, res) => {
  const { moduleName } = req.params;
  const config = require('../../config/app.config');
  
  if (config.modules[moduleName]) {
    res.json({
      name: moduleName,
      ...config.modules[moduleName],
      version: '1.0.0'
    });
  } else {
    res.status(404).json({ error: 'Module not found' });
  }
});

// Platform statistics
router.get('/stats', (req, res) => {
  const config = require('../../config/app.config');
  const enabledModules = Object.values(config.modules).filter(m => m.enabled).length;
  
  res.json({
    totalModules: Object.keys(config.modules).length,
    enabledModules,
    uptime: process.uptime(),
    version: config.app.version,
    environment: config.app.env
  });
});

// User preferences (mock endpoint)
router.get('/user/preferences', (req, res) => {
  res.json({
    theme: 'dark',
    musicEnabled: true,
    animationsEnabled: true,
    defaultModule: 'about',
    language: 'en'
  });
});

router.post('/user/preferences', (req, res) => {
  // In a real app, this would save to database
  res.json({
    success: true,
    message: 'Preferences updated',
    preferences: req.body
  });
});

module.exports = router;