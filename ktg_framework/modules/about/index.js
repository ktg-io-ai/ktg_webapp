const BaseModule = require('../../shared/components/BaseModule');
const path = require('path');

class AboutModule extends BaseModule {
  setupRoutes() {
    this.addRoute('get', '/', this.getDashboard.bind(this));
    this.addRoute('get', '/info', this.getInfo.bind(this));
    this.addRoute('get', '/creator', this.getCreator.bind(this));
    this.addRoute('get', '/ktgio', this.getKTGIO.bind(this));
  }

  getDashboard(req, res) {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
  }

  getInfo(req, res) {
    res.sendFile(path.join(__dirname, 'info.html'));
  }

  getCreator(req, res) {
    res.sendFile(path.join(__dirname, 'creator.html'));
  }

  getKTGIO(req, res) {
    res.sendFile(path.join(__dirname, 'ktgio.html'));
  }
}

module.exports = AboutModule;