const BaseModule = require('../../shared/components/BaseModule');
const path = require('path');

class MusicModule extends BaseModule {
  setupRoutes() {
    this.addRoute('get', '/', this.getDashboard.bind(this));
    this.addRoute('get', '/info', this.getInfo.bind(this));
    this.addRoute('get', '/player', this.getPlayer.bind(this));
    this.addRoute('get', '/playlist', this.getPlaylist.bind(this));
    this.addRoute('get', '/tracks', this.getTracks.bind(this));
  }

  getDashboard(req, res) {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
  }

  getInfo(req, res) {
    res.sendFile(path.join(__dirname, 'info.html'));
  }

  getPlayer(req, res) {
    res.sendFile(path.join(__dirname, 'player.html'));
  }

  getPlaylist(req, res) {
    res.json({
      playlist: [
        { id: 1, title: 'Astrology Loading', artist: 'KTG.MUSIC', duration: '3:45' },
        { id: 2, title: 'The Grid Loading', artist: 'KTG.MUSIC', duration: '4:12' },
        { id: 3, title: 'Theme Song', artist: 'KTG.MUSIC', duration: '3:28' },
        { id: 4, title: 'Choose Your Door', artist: 'KTG.MUSIC', duration: '2:56' }
      ]
    });
  }

  getTracks(req, res) {
    // Return available tracks metadata
    res.json({
      tracks: [
        {
          id: 'astrology_loading',
          title: 'Astrology Loading',
          artist: 'KTG.MUSIC',
          album: 'Platform Soundtrack',
          duration: 225,
          url: '/assets/audio/astrology_loading.mp3',
          cover: '/assets/covers/astrology_loading.png'
        },
        {
          id: 'theme_song',
          title: 'Theme Song',
          artist: 'KTG.MUSIC',
          album: 'Platform Soundtrack',
          duration: 208,
          url: '/assets/audio/theme_song.mp3',
          cover: '/assets/covers/theme_song.png'
        }
      ]
    });
  }
}

module.exports = MusicModule;