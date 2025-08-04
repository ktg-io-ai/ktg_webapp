// Module Loader Utility

class ModuleLoader {
  constructor() {
    this.loadedModules = new Map();
    this.moduleCache = new Map();
  }

  async loadModule(moduleName) {
    if (this.loadedModules.has(moduleName)) {
      return this.loadedModules.get(moduleName);
    }

    try {
      // Check if module exists
      const moduleExists = await this.checkModuleExists(moduleName);
      if (!moduleExists) {
        throw new Error(`Module ${moduleName} not found`);
      }

      // Load module configuration
      const moduleConfig = await this.loadModuleConfig(moduleName);
      
      // Cache the module
      this.loadedModules.set(moduleName, moduleConfig);
      
      console.log(`✓ Module loaded: ${moduleName}`);
      return moduleConfig;
      
    } catch (error) {
      console.error(`✗ Failed to load module ${moduleName}:`, error);
      return null;
    }
  }

  async checkModuleExists(moduleName) {
    try {
      const response = await fetch(`/modules/${moduleName}/dashboard.html`, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  async loadModuleConfig(moduleName) {
    try {
      const response = await fetch(`/api/v1/modules/${moduleName}/config`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`No config found for module ${moduleName}, using defaults`);
    }

    // Return default config
    return {
      name: moduleName,
      enabled: true,
      version: '1.0.0',
      dependencies: []
    };
  }

  unloadModule(moduleName) {
    if (this.loadedModules.has(moduleName)) {
      this.loadedModules.delete(moduleName);
      console.log(`Module unloaded: ${moduleName}`);
    }
  }

  getLoadedModules() {
    return Array.from(this.loadedModules.keys());
  }

  clearCache() {
    this.loadedModules.clear();
    this.moduleCache.clear();
    console.log('Module cache cleared');
  }
}

// Global module loader instance
window.moduleLoader = new ModuleLoader();

// Utility functions
window.loadModule = async (moduleName) => {
  return await window.moduleLoader.loadModule(moduleName);
};

window.getLoadedModules = () => {
  return window.moduleLoader.getLoadedModules();
};