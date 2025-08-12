// KTG Dashboard Core - Immersive Experience Controller

class KTGDashboard {
  constructor() {
    this.currentModule = 'about';
    this.currentTheme = 'dark';
    this.currentLanguage = 'en';
    this.musicPlayer = document.getElementById('musicPlayer');
    this.musicToggle = document.getElementById('musicToggle');
    this.leftFrame = document.getElementById('leftFrame');
    this.rightFrame = document.getElementById('rightFrame');
    this.progressBar = document.getElementById('progressBar');
    
    this.moduleMusic = {
      about: { track: '../../assets/astrology_loading.mp3', title: 'Astrology Loading' },
      ai: { track: '../../assets/the_grid_loading.mp3', title: 'The Grid Loading' },
      music: { track: '../../assets/theme_song.mp3', title: 'Theme Song' },
      destiny: { track: '../../assets/chooseyourdoor.mp3', title: 'Choose Your Door' },
      influencers: { track: '../../assets/opening_scene.mp3', title: 'Opening Scene' },
      investors: { track: '../../assets/safe_loading.mp3', title: 'Safe Loading' },
      lifestyle: { track: '../../assets/ideas.mp3', title: 'Ideas' },
      vr: { track: '../../assets/space_run_loading.mp3', title: 'Space Run Loading' },
      web3: { track: '../../assets/wallet_loading.mp3', title: 'Wallet Loading' },
      metaphysics: { track: '../../assets/lucys_booth_loading.mp3', title: 'Lucy\'s Booth Loading' }
    };
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadUserPreferences();
    this.activateAnimations();
    this.loadModule(this.currentModule);
  }

  setupEventListeners() {
    // Music controls
    this.musicToggle.addEventListener('click', () => this.toggleMusic());
    this.musicPlayer.addEventListener('play', () => this.updateProgressBar());
    this.musicPlayer.addEventListener('pause', () => this.stopProgressBar());
    
    // Window events
    window.addEventListener('load', () => this.activateAnimations());
    window.addEventListener('resize', () => this.handleResize());
    
    // Message handling for iframe communication
    window.addEventListener('message', (event) => this.handleMessage(event));
  }

  loadModule(moduleName) {
    // Update active navigation
    document.querySelectorAll('.ktg-nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    const activeItem = document.querySelector(`[data-module="${moduleName}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
    }

    // Load module content
    this.leftFrame.src = `../../modules/${moduleName}/dashboard.html`;
    this.rightFrame.src = `../../modules/${moduleName}/info.html`;
    
    this.currentModule = moduleName;
    this.updateModuleMusic(moduleName);
    
    console.log(`Loaded module: ${moduleName}`);
  }

  updateModuleMusic(moduleName) {
    const moduleData = this.moduleMusic[moduleName];
    if (moduleData) {
      this.musicPlayer.src = moduleData.track;
      document.getElementById('currentTrack').textContent = moduleData.title;
      
      // Auto-play if music was playing
      if (!this.musicPlayer.paused) {
        this.musicPlayer.play();
      }
    }
  }

  toggleMusic() {
    if (this.musicPlayer.paused) {
      this.musicPlayer.play();
    } else {
      this.musicPlayer.pause();
    }
  }

  updateProgressBar() {
    const update = () => {
      if (!this.musicPlayer.paused && this.musicPlayer.duration) {
        const percentage = (this.musicPlayer.currentTime / this.musicPlayer.duration) * 100;
        this.progressBar.style.width = percentage + '%';
        requestAnimationFrame(update);
      }
    };
    update();
  }

  stopProgressBar() {
    this.progressBar.style.width = '0%';
  }

  activateAnimations() {
    setTimeout(() => {
      document.querySelectorAll('.slide-in-left').forEach(el => {
        el.classList.add('active');
      });
    }, 100);

    setTimeout(() => {
      document.querySelectorAll('.fade-in').forEach(el => {
        el.classList.add('active');
      });
    }, 500);
  }

  handleResize() {
    // Handle responsive layout changes
    const isMobile = window.innerWidth <= 768;
    if (isMobile && this.rightFrame) {
      // On mobile, show only left panel
      this.rightFrame.style.display = 'none';
    } else if (this.rightFrame) {
      this.rightFrame.style.display = 'block';
    }
  }

  handleMessage(event) {
    const { type, data } = event.data;
    
    switch (type) {
      case 'loadModule':
        this.loadModule(data.module);
        break;
      case 'changeTheme':
        this.changeTheme(data.theme);
        break;
      case 'changeLanguage':
        this.changeLanguage(data.language);
        break;
      case 'playTrack':
        this.playTrack(data.track, data.title);
        break;
    }
  }

  changeTheme(theme) {
    this.currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    this.saveUserPreferences();
  }

  changeLanguage(language) {
    this.currentLanguage = language;
    // Language switching logic would go here
    this.saveUserPreferences();
  }

  playTrack(trackUrl, title) {
    this.musicPlayer.src = trackUrl;
    document.getElementById('currentTrack').textContent = title;
    this.musicPlayer.play();
  }

  loadUserPreferences() {
    const prefs = localStorage.getItem('ktg-preferences');
    if (prefs) {
      const preferences = JSON.parse(prefs);
      this.currentTheme = preferences.theme || 'dark';
      this.currentLanguage = preferences.language || 'en';
      
      document.body.setAttribute('data-theme', this.currentTheme);
    }
  }

  saveUserPreferences() {
    const preferences = {
      theme: this.currentTheme,
      language: this.currentLanguage,
      lastModule: this.currentModule
    };
    localStorage.setItem('ktg-preferences', JSON.stringify(preferences));
  }
}

// Global functions for HTML onclick events
function loadModule(moduleName) {
  window.ktgDashboard.loadModule(moduleName);
}

function openSubmenu(submenuName) {
  // Hide all submenus
  document.querySelectorAll('.ktg-submenu').forEach(submenu => {
    submenu.style.display = 'none';
  });

  // Show selected submenu
  const selectedSubmenu = document.getElementById(submenuName + '-submenu');
  if (selectedSubmenu) {
    selectedSubmenu.style.display = 'block';
  }
}

function closeSubmenu(closeButton) {
  const submenu = closeButton.closest('.ktg-submenu');
  if (submenu) {
    submenu.style.display = 'none';
  }
}

function openConfig() {
  // Open config panel
  window.ktgDashboard.leftFrame.src = '../../modules/config/dashboard.html';
  window.ktgDashboard.rightFrame.src = '../../modules/config/settings.html';
  closeSubmenu(document.querySelector('#mystuff-submenu .ktg-close-button'));
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.ktgDashboard = new KTGDashboard();
});