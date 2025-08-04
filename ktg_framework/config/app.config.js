module.exports = {
  app: {
    name: 'KTG Platform',
    version: '1.0.0',
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },
  
  modules: {
    ai: { enabled: true, path: '/ai' },
    music: { enabled: true, path: '/music' },
    destiny: { enabled: true, path: '/destiny' },
    influencers: { enabled: true, path: '/influencers' },
    investors: { enabled: true, path: '/investors' },
    lifestyle: { enabled: true, path: '/lifestyle' },
    metaphysics: { enabled: true, path: '/metaphysics' },
    vr: { enabled: true, path: '/vr' },
    web3: { enabled: true, path: '/web3' },
    about: { enabled: true, path: '/about' }
  },

  assets: {
    images: '/assets/images',
    videos: '/assets/videos',
    audio: '/assets/audio',
    icons: '/assets/icons'
  },

  api: {
    baseUrl: '/api/v1',
    timeout: 30000
  },

  ui: {
    theme: 'dark',
    animations: true,
    responsive: true
  }
};