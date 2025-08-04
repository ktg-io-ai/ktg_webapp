const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('../../config/app.config');

class KTGApp {
  constructor() {
    this.app = express();
    this.config = config;
    this.modules = new Map();
    this.init();
  }

  init() {
    this.setupMiddleware();
    this.loadModules();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, '../../public')));
  }

  loadModules() {
    Object.entries(this.config.modules).forEach(([name, moduleConfig]) => {
      if (moduleConfig.enabled) {
        try {
          const ModuleClass = require(`../../modules/${name}/index.js`);
          const moduleInstance = new ModuleClass(this.app, moduleConfig);
          this.modules.set(name, moduleInstance);
          console.log(`✓ Module loaded: ${name}`);
        } catch (error) {
          console.warn(`⚠ Module not found or failed to load: ${name}`);
        }
      }
    });
  }

  setupRoutes() {
    // Main dashboard route
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../pages/dashboard.html'));
    });

    // API routes
    this.app.use('/api/v1', require('../api/routes'));

    // Module routes are handled by individual modules
  }

  setupErrorHandling() {
    this.app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Something went wrong!' });
    });

    this.app.use((req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });
  }

  start() {
    const port = this.config.app.port;
    this.app.listen(port, () => {
      console.log(`🚀 KTG Platform running on port ${port}`);
      console.log(`📱 Environment: ${this.config.app.env}`);
      console.log(`🎵 Modules loaded: ${this.modules.size}`);
    });
  }
}

module.exports = KTGApp;