const BaseModule = require('../../shared/components/BaseModule');
const path = require('path');

class AIModule extends BaseModule {
  setupRoutes() {
    this.addRoute('get', '/', this.getDashboard.bind(this));
    this.addRoute('get', '/info', this.getInfo.bind(this));
    this.addRoute('post', '/chat', this.handleChat.bind(this));
    this.addRoute('get', '/agents', this.getAgents.bind(this));
  }

  getDashboard(req, res) {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
  }

  getInfo(req, res) {
    res.sendFile(path.join(__dirname, 'info.html'));
  }

  handleChat(req, res) {
    // AI chat endpoint
    const { message, agent } = req.body;
    
    // Simulate AI response (replace with actual AI integration)
    const responses = {
      guru: "Guru here. I sense great potential in your question...",
      lucy: "Lucy speaking! That's an interesting perspective...",
      alter: "Alter responding. Let me analyze this from multiple angles..."
    };

    res.json({
      response: responses[agent] || "AI is processing your request...",
      agent: agent || 'default',
      timestamp: new Date().toISOString()
    });
  }

  getAgents(req, res) {
    res.json({
      agents: [
        { id: 'guru', name: 'Guru', specialty: 'Wisdom & Guidance' },
        { id: 'lucy', name: 'Lucy', specialty: 'Creative & Social' },
        { id: 'alter', name: 'Alter', specialty: 'Analysis & Logic' }
      ]
    });
  }
}

module.exports = AIModule;