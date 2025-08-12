class BaseModule {
  constructor(app, config) {
    this.app = app;
    this.config = config;
    this.name = this.constructor.name.toLowerCase().replace('module', '');
    this.routes = [];
    this.init();
  }

  init() {
    this.setupRoutes();
    this.registerRoutes();
  }

  setupRoutes() {
    // Override in child classes
  }

  registerRoutes() {
    if (this.routes.length > 0) {
      this.routes.forEach(route => {
        const fullPath = `${this.config.path}${route.path}`;
        this.app[route.method](fullPath, route.handler);
      });
    }
  }

  addRoute(method, path, handler) {
    this.routes.push({ method, path, handler });
  }

  log(message) {
    console.log(`[${this.name.toUpperCase()}] ${message}`);
  }

  error(message) {
    console.error(`[${this.name.toUpperCase()}] ERROR: ${message}`);
  }
}

module.exports = BaseModule;