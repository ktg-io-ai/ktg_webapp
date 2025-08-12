// Game Console Component
import API from '../api.js';
import Auth from '../auth.js';

class GameConsole {
    constructor(container) {
        this.container = container;
        this.currentUser = Auth.getCurrentUser();
        this.activeSubmenu = null;
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="game-console">
                <div class="sidebar">
                    <div class="logo">
                        <img src="../BLUEPRINT_WIREFRAME/assets/game_logo.png" alt="KTG Logo">
                    </div>
                    <nav class="sidebar-nav">
                        <button class="nav-item" data-action="search">
                            <img src="../BLUEPRINT_WIREFRAME/assets/search_icon.png" alt="Search">
                            <span>Search</span>
                        </button>
                        <button class="nav-item" data-action="social">
                            <img src="../BLUEPRINT_WIREFRAME/assets/social_icon.png" alt="Share">
                            <span>Share</span>
                        </button>
                        <button class="nav-item" data-action="play">
                            <img src="../BLUEPRINT_WIREFRAME/assets/game_icon.png" alt="Play">
                            <span>Play</span>
                        </button>
                        <button class="nav-item" data-action="decide">
                            <img src="../BLUEPRINT_WIREFRAME/assets/detail_icon.png" alt="Decide">
                            <span>Decide</span>
                        </button>
                        <button class="nav-item" data-action="mystuff">
                            <img src="../BLUEPRINT_WIREFRAME/assets/mystuff_icon.png" alt="My Stuff">
                            <span>My Stuff</span>
                        </button>
                    </nav>
                </div>

                <div class="main-content">
                    <div class="top-bar">
                        <h1>Karma the Game of Destiny</h1>
                        <div class="user-info">
                            Welcome, ${this.currentUser?.username || 'Player'}
                        </div>
                    </div>

                    <div class="content-area">
                        <div class="left-panel" id="leftPanel">
                            <div class="welcome-message">
                                <h2>Welcome to KTG</h2>
                                <p>Choose an action from the sidebar to begin your journey.</p>
                            </div>
                        </div>
                        <div class="right-panel" id="rightPanel">
                            <div class="stats-preview" id="statsPreview">
                                Loading your stats...
                            </div>
                        </div>
                    </div>
                </div>

                <div class="submenu-overlay" id="submenuOverlay" style="display: none;">
                    <div class="submenu" id="submenu"></div>
                </div>
            </div>
        `;

        this.loadUserStats();
    }

    attachEventListeners() {
        // Sidebar navigation
        this.container.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleNavigation(action);
            });
        });

        // Close submenu when clicking overlay
        const overlay = this.container.querySelector('#submenuOverlay');
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeSubmenu();
            }
        });
    }

    handleNavigation(action) {
        this.closeSubmenu();
        
        switch(action) {
            case 'search':
                this.showSearchSubmenu();
                break;
            case 'social':
                this.showSocialSubmenu();
                break;
            case 'play':
                this.showPlaySubmenu();
                break;
            case 'decide':
                this.showDecideSubmenu();
                break;
            case 'mystuff':
                this.showMyStuffSubmenu();
                break;
        }
    }

    showPlaySubmenu() {
        const submenu = this.container.querySelector('#submenu');
        submenu.innerHTML = `
            <h2>Play <span class="close-btn" onclick="this.closest('.submenu-overlay').style.display='none'">×</span></h2>
            <div class="submenu-items">
                <button class="submenu-item" data-action="zap">
                    <img src="../BLUEPRINT_WIREFRAME/assets/zap_icon.png" alt="Zap"> Zap
                </button>
                <button class="submenu-item" data-action="door4">
                    <img src="../BLUEPRINT_WIREFRAME/assets/door4_icon.png" alt="Door4"> Door #4
                </button>
                <button class="submenu-item" data-action="stars">
                    <img src="../BLUEPRINT_WIREFRAME/assets/stars_icon.png" alt="Stars"> Play the Stars
                </button>
            </div>
        `;

        // Add event listeners for submenu items
        submenu.querySelectorAll('.submenu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handlePlayAction(action);
            });
        });

        this.showSubmenu();
    }

    showDecideSubmenu() {
        const submenu = this.container.querySelector('#submenu');
        submenu.innerHTML = `
            <h2>Decide <span class="close-btn" onclick="this.closest('.submenu-overlay').style.display='none'">×</span></h2>
            <div class="submenu-items">
                <button class="submenu-item" data-action="bucketlist">
                    <img src="../BLUEPRINT_WIREFRAME/assets/bucket_icon.png" alt="Bucket"> BucketList
                </button>
                <button class="submenu-item" data-action="stats">
                    <img src="../BLUEPRINT_WIREFRAME/assets/stats_icon.png" alt="Stats"> Player Stats
                </button>
                <button class="submenu-item" data-action="journeybook">
                    <img src="../BLUEPRINT_WIREFRAME/assets/journeybook_icon.png" alt="JourneyBook"> JourneyBook
                </button>
            </div>
        `;

        submenu.querySelectorAll('.submenu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleDecideAction(action);
            });
        });

        this.showSubmenu();
    }

    async handlePlayAction(action) {
        this.closeSubmenu();
        
        switch(action) {
            case 'door4':
                await this.openDoor4();
                break;
            case 'zap':
                this.showZapInterface();
                break;
            case 'stars':
                this.showStarsGame();
                break;
        }
    }

    async handleDecideAction(action) {
        this.closeSubmenu();
        
        switch(action) {
            case 'bucketlist':
                await this.showBucketList();
                break;
            case 'stats':
                await this.showPlayerStats();
                break;
            case 'journeybook':
                this.showJourneyBook();
                break;
        }
    }

    async openDoor4() {
        const rightPanel = this.container.querySelector('#rightPanel');
        rightPanel.innerHTML = `
            <div class="door4-interface">
                <h2>Door #4 - The Mystery Door</h2>
                <div class="door-visual">🚪</div>
                <p>Behind this door lies something special...</p>
                <button class="action-btn" onclick="this.enterDoor4()">Enter Door #4</button>
            </div>
        `;

        // Add enter door functionality
        window.enterDoor4 = async () => {
            try {
                const result = await API.enterDoor4(this.currentUser.id, 'enter');
                alert(result.message);
                this.loadUserStats(); // Refresh stats
            } catch (error) {
                alert('Error: ' + error.message);
            }
        };
    }

    async showBucketList() {
        try {
            const response = await API.getBucketList(this.currentUser.id);
            const rightPanel = this.container.querySelector('#rightPanel');
            
            rightPanel.innerHTML = `
                <div class="bucketlist-interface">
                    <h2>My BucketList</h2>
                    <div class="bucketlist-items">
                        ${response.bucketlist.map(item => `
                            <div class="bucketlist-item">
                                <h3>${item.title}</h3>
                                <p>${item.description}</p>
                                <span class="status ${item.status}">${item.status}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading bucket list:', error);
        }
    }

    async showPlayerStats() {
        try {
            const response = await API.getPlayerStats(this.currentUser.id);
            const rightPanel = this.container.querySelector('#rightPanel');
            
            rightPanel.innerHTML = `
                <div class="stats-interface">
                    <h2>Player Stats</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">${response.stats.total_points}</div>
                            <div class="stat-label">Total Points</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${response.stats.level}</div>
                            <div class="stat-label">Level</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${response.stats.connections}</div>
                            <div class="stat-label">Connections</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${response.stats.activities}</div>
                            <div class="stat-label">Activities</div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    async loadUserStats() {
        try {
            const response = await API.getPlayerStats(this.currentUser.id);
            const statsPreview = this.container.querySelector('#statsPreview');
            
            statsPreview.innerHTML = `
                <div class="stats-summary">
                    <div class="stat">Level ${response.stats.level}</div>
                    <div class="stat">${response.stats.total_points} Points</div>
                    <div class="stat">${response.stats.connections} Connections</div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading user stats:', error);
        }
    }

    showSubmenu() {
        this.container.querySelector('#submenuOverlay').style.display = 'flex';
    }

    closeSubmenu() {
        this.container.querySelector('#submenuOverlay').style.display = 'none';
    }
}

export default GameConsole;