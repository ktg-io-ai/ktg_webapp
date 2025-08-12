// Wallet Manager - Handles token management and wallet operations
class WalletManager {
    constructor() {
        this.walletId = null;
        this.email = null;
        this.tokens = {
            '1life': 0,
            '3life': 0,
            '6life': 0,
            '9life': 0,
            'diamond': 0
        };
        this.cryptoWallet = '';
        this.tokenHistory = [];
        this.init();
    }

    async init() {
        const user = JSON.parse(localStorage.getItem('ktg_user') || '{}');
        if (user.email) {
            this.email = user.email;
            this.walletId = user.walletId;
            await this.loadWallet();
        }
    }

    async loadWallet() {
        if (!this.walletId) return;
        
        try {
            // Load wallet data from Firebase
            const response = await fetch('/api/wallet/load', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletId: this.walletId })
            });
            
            if (response.ok) {
                const walletData = await response.json();
                this.tokens = walletData.tokens || this.tokens;
                this.cryptoWallet = walletData.cryptoWallet || '';
                this.tokenHistory = walletData.tokenHistory || [];
            }
        } catch (error) {
            console.error('Error loading wallet:', error);
        }
    }

    async saveWallet() {
        if (!this.walletId) return;
        
        try {
            await fetch('/api/wallet/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    walletId: this.walletId,
                    tokens: this.tokens,
                    cryptoWallet: this.cryptoWallet,
                    tokenHistory: this.tokenHistory
                })
            });
        } catch (error) {
            console.error('Error saving wallet:', error);
        }
    }

    hasToken(tokenType) {
        return this.tokens[tokenType] > 0;
    }

    getTokenCount(tokenType) {
        return this.tokens[tokenType] || 0;
    }

    async useToken(tokenType, purpose) {
        if (!this.hasToken(tokenType)) {
            throw new Error(`Insufficient ${tokenType} tokens`);
        }

        this.tokens[tokenType]--;
        
        // Add to history
        this.tokenHistory.push({
            type: tokenType,
            action: 'used',
            purpose: purpose,
            timestamp: Date.now(),
            expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
        });

        await this.saveWallet();
        return true;
    }

    async addToken(tokenType, count = 1) {
        this.tokens[tokenType] = (this.tokens[tokenType] || 0) + count;
        
        // Add to history
        this.tokenHistory.push({
            type: tokenType,
            action: 'added',
            count: count,
            timestamp: Date.now(),
            expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
        });

        await this.saveWallet();
        return true;
    }

    getTokenPrice(tokenType) {
        const prices = {
            '1life': 1.99,
            '3life': 3.99,
            '6life': 6.99,
            '9life': 9.99,
            'diamond': 999.00
        };
        return prices[tokenType] || 0;
    }

    cleanExpiredTokens() {
        const now = Date.now();
        this.tokenHistory = this.tokenHistory.filter(entry => entry.expiresAt > now);
        
        // Recalculate token counts based on non-expired history
        const validTokens = {};
        this.tokenHistory.forEach(entry => {
            if (entry.action === 'added') {
                validTokens[entry.type] = (validTokens[entry.type] || 0) + (entry.count || 1);
            } else if (entry.action === 'used') {
                validTokens[entry.type] = (validTokens[entry.type] || 0) - 1;
            }
        });
        
        this.tokens = validTokens;
        this.saveWallet();
    }
}

// Game Registration Manager
class GameRegistrationManager {
    constructor(walletManager) {
        this.wallet = walletManager;
        this.activeGames = new Map();
    }

    async registerForDestiny(tokenType = '3life') {
        try {
            // Check if user has required token
            if (!this.wallet.hasToken(tokenType)) {
                throw new Error(`You need a ${tokenType} token to play Destiny. Purchase tokens from your wallet.`);
            }

            // Use the token
            await this.wallet.useToken(tokenType, 'destiny_game');

            // Create game session
            const gameSession = {
                gameType: 'destiny',
                tokenUsed: tokenType,
                startTime: Date.now(),
                expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
                status: 'active'
            };

            // Save to active games
            const sessionId = 'destiny_' + Date.now();
            this.activeGames.set(sessionId, gameSession);

            // Save to localStorage for persistence
            localStorage.setItem('ktg_active_games', JSON.stringify(Array.from(this.activeGames.entries())));

            return {
                success: true,
                sessionId: sessionId,
                message: `Successfully registered for Destiny using ${tokenType} token!`
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async registerForChess(tokenType = '1life', aiOpponents = 1) {
        try {
            const tokensNeeded = aiOpponents;
            
            // Check if user has enough tokens
            if (this.wallet.getTokenCount(tokenType) < tokensNeeded) {
                throw new Error(`You need ${tokensNeeded} ${tokenType} token(s) to play 4-Player Chess with ${aiOpponents} AI opponent(s).`);
            }

            // Use the tokens
            for (let i = 0; i < tokensNeeded; i++) {
                await this.wallet.useToken(tokenType, 'chess_ai_opponent');
            }

            // Create game session
            const gameSession = {
                gameType: 'chess',
                tokenUsed: tokenType,
                aiOpponents: aiOpponents,
                startTime: Date.now(),
                status: 'waiting_for_players'
            };

            const sessionId = 'chess_' + Date.now();
            this.activeGames.set(sessionId, gameSession);

            localStorage.setItem('ktg_active_games', JSON.stringify(Array.from(this.activeGames.entries())));

            return {
                success: true,
                sessionId: sessionId,
                message: `Successfully registered for 4-Player Chess with ${aiOpponents} AI opponent(s)!`
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    getActiveGames() {
        return Array.from(this.activeGames.values());
    }

    endGame(sessionId) {
        if (this.activeGames.has(sessionId)) {
            this.activeGames.delete(sessionId);
            localStorage.setItem('ktg_active_games', JSON.stringify(Array.from(this.activeGames.entries())));
            return true;
        }
        return false;
    }
}

// Avatar Manager
class AvatarManager {
    constructor() {
        this.currentAvatar = null;
        this.generationCount = 0;
        this.maxGenerations = 3;
    }

    async createAvatar(gender, name, tagline) {
        try {
            // First generation based on basic info
            const avatarData = {
                id: 'avatar_' + Date.now(),
                gender: gender,
                name: name,
                tagline: tagline,
                imageUrl: await this.generateAvatarImage(gender, name, tagline),
                createdAt: Date.now(),
                generationCount: 1
            };

            this.currentAvatar = avatarData;
            this.generationCount = 1;
            
            // Save to localStorage
            localStorage.setItem('ktg_current_avatar', JSON.stringify(avatarData));
            
            return avatarData;
        } catch (error) {
            console.error('Error creating avatar:', error);
            throw error;
        }
    }

    async reimagineAvatar(prompt) {
        if (!this.currentAvatar) {
            throw new Error('No avatar to reimagine. Create an avatar first.');
        }

        if (this.generationCount >= this.maxGenerations) {
            // Just cycle through existing images
            return this.currentAvatar;
        }

        try {
            // Generate new image with custom prompt but remember gender
            const enhancedPrompt = `${prompt}, ${this.currentAvatar.gender} character`;
            const newImageUrl = await this.generateAvatarImage(
                this.currentAvatar.gender, 
                this.currentAvatar.name, 
                enhancedPrompt
            );

            this.currentAvatar.imageUrl = newImageUrl;
            this.currentAvatar.lastModified = Date.now();
            this.generationCount++;

            localStorage.setItem('ktg_current_avatar', JSON.stringify(this.currentAvatar));
            
            return this.currentAvatar;
        } catch (error) {
            console.error('Error reimagining avatar:', error);
            throw error;
        }
    }

    async generateAvatarImage(gender, name, description) {
        try {
            // Use AI service if available
            if (window.aiAvatarService) {
                return await window.aiAvatarService.generateAvatar(gender, name, description);
            }
            
            // Fallback to placeholder images
            return this.getPlaceholderImage(gender);
        } catch (error) {
            console.error('AI avatar generation failed:', error);
            return this.getPlaceholderImage(gender);
        }
    }

    getPlaceholderImage(gender) {
        // Generate a unique seed for consistent but varied avatars
        const seed = gender + Date.now() + Math.random();
        
        // Use DiceBear API for realistic avatars
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=2f27c8,4fb6c1,ff6b6b&size=300`;
    }

    getCurrentAvatar() {
        return this.currentAvatar;
    }

    canGenerate() {
        return this.generationCount < this.maxGenerations;
    }

    getRemainingGenerations() {
        return Math.max(0, this.maxGenerations - this.generationCount);
    }
}

// Database Token Distribution Function
function distributeTokensToProfiles() {
    const profiles = [
        // 12 profiles with 3 life tokens
        { id: 'profile_001', email: 'user001@ktg.io', tokens: { '3life': 1 } },
        { id: 'profile_002', email: 'user002@ktg.io', tokens: { '3life': 1 } },
        { id: 'profile_003', email: 'user003@ktg.io', tokens: { '3life': 1 } },
        { id: 'profile_004', email: 'user004@ktg.io', tokens: { '3life': 1 } },
        { id: 'profile_005', email: 'user005@ktg.io', tokens: { '3life': 1 } },
        { id: 'profile_006', email: 'user006@ktg.io', tokens: { '3life': 1 } },
        { id: 'profile_007', email: 'user007@ktg.io', tokens: { '3life': 1 } },
        { id: 'profile_008', email: 'user008@ktg.io', tokens: { '3life': 1 } },
        { id: 'profile_009', email: 'user009@ktg.io', tokens: { '3life': 1 } },
        { id: 'profile_010', email: 'user010@ktg.io', tokens: { '3life': 1 } },
        { id: 'profile_011', email: 'user011@ktg.io', tokens: { '3life': 1 } },
        { id: 'profile_012', email: 'user012@ktg.io', tokens: { '3life': 1 } },
        
        // 6 profiles with 6 life tokens
        { id: 'profile_013', email: 'user013@ktg.io', tokens: { '6life': 1 } },
        { id: 'profile_014', email: 'user014@ktg.io', tokens: { '6life': 1 } },
        { id: 'profile_015', email: 'user015@ktg.io', tokens: { '6life': 1 } },
        { id: 'profile_016', email: 'user016@ktg.io', tokens: { '6life': 1 } },
        { id: 'profile_017', email: 'user017@ktg.io', tokens: { '6life': 1 } },
        { id: 'profile_018', email: 'user018@ktg.io', tokens: { '6life': 1 } },
        
        // 2 profiles with 9 life tokens
        { id: 'profile_019', email: 'user019@ktg.io', tokens: { '9life': 1 } },
        { id: 'profile_020', email: 'user020@ktg.io', tokens: { '9life': 1 } },
        
        // 6 profiles with 1 life tokens
        { id: 'profile_021', email: 'user021@ktg.io', tokens: { '1life': 1 } },
        { id: 'profile_022', email: 'user022@ktg.io', tokens: { '1life': 1 } },
        { id: 'profile_023', email: 'user023@ktg.io', tokens: { '1life': 1 } },
        { id: 'profile_024', email: 'user024@ktg.io', tokens: { '1life': 1 } },
        { id: 'profile_025', email: 'user025@ktg.io', tokens: { '1life': 1 } },
        { id: 'profile_026', email: 'user026@ktg.io', tokens: { '1life': 1, 'diamond': 1 } } // Last profile gets diamond
    ];
    
    console.log('Token Distribution for 26 Profiles:');
    profiles.forEach(profile => {
        console.log(`${profile.email}: ${JSON.stringify(profile.tokens)}`);
    });
    
    return profiles;
}

// Initialize global instances
window.walletManager = new WalletManager();
window.gameRegistrationManager = new GameRegistrationManager(window.walletManager);
window.avatarManager = new AvatarManager();
window.profileTokenDistribution = distributeTokensToProfiles();