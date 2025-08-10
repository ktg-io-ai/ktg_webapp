// AI Avatar Generation Service with Leonardo AI & Pollinations
class AIAvatarService {
    constructor() {
        this.leonardoApiKey = null;
        this.leonardoDatasetId = null;
        this.firebaseFunction = 'https://us-central1-ktgio-3k38n.cloudfunctions.net/generateAvatar';
    }

    async generateAvatar(gender, name, tagline, customPrompt = '') {
        const prompt = this.buildPrompt(gender, name, tagline, customPrompt);
        
        try {
            // Try Leonardo AI first (high quality)
            return await this.generateWithLeonardo(prompt, gender, name);
        } catch (error) {
            console.warn('Leonardo AI failed, trying Pollinations:', error);
            try {
                return await this.generateWithPollinations(prompt, gender, name);
            } catch (error2) {
                console.warn('Pollinations failed, using DiceBear:', error2);
                return this.generateLocalAvatar(gender, name);
            }
        }
    }

    buildPrompt(gender, name, tagline, customPrompt) {
        const basePrompt = `Professional portrait of a ${gender} character named ${name}, ${tagline}`;
        const stylePrompt = 'digital art, high quality, detailed, fantasy style, game avatar';
        const customPart = customPrompt ? `, ${customPrompt}` : '';
        
        return `${basePrompt}${customPart}, ${stylePrompt}`;
    }

    async generateWithFirebaseGemini(prompt, gender, name) {
        try {
            const user = JSON.parse(localStorage.getItem('ktg_user') || '{}');
            
            const response = await fetch(this.firebaseFunction, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.firebaseUid || 'anonymous'}`
                },
                body: JSON.stringify({
                    prompt: prompt,
                    gender: gender,
                    name: name,
                    userId: user.walletId || 'anonymous'
                })
            });

            if (!response.ok) {
                throw new Error(`Firebase function error: ${response.status}`);
            }

            const data = await response.json();
            return data.imageUrl || this.generateLocalAvatar(gender, name);
        } catch (error) {
            console.warn('Firebase function failed, using local generation:', error);
            return this.generateLocalAvatar(gender, name);
        }
    }

    async generateWithPollinations(prompt, gender, name) {
        // Pollinations.ai - Free AI image generation
        const enhancedPrompt = `portrait of ${prompt}, high quality, detailed, professional headshot, ${gender} person`;
        const encodedPrompt = encodeURIComponent(enhancedPrompt);
        const seed = Math.floor(Math.random() * 1000000);
        
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${seed}&model=flux`;
        
        // Test if image loads
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(imageUrl);
            img.onerror = () => reject(new Error('Pollinations failed'));
            img.src = imageUrl;
        });
    }

    async generateWithLeonardo(prompt, gender, name) {
        if (!this.leonardoApiKey) {
            throw new Error('Leonardo API key not set');
        }

        try {
            // Create generation request
            const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.leonardoApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: `portrait of ${prompt}, high quality, detailed, professional headshot, ${gender} person, digital art, fantasy style`,
                    num_images: 1,
                    width: 512,
                    height: 512,
                    guidance_scale: 7,
                    modelId: 'b24e16ff-06e3-43eb-8d33-4416c2d75876', // Leonardo Creative model
                    ...(this.leonardoDatasetId && { datasetId: this.leonardoDatasetId })
                })
            });

            if (!response.ok) {
                throw new Error(`Leonardo API error: ${response.status}`);
            }

            const data = await response.json();
            const generationId = data.sdGenerationJob.generationId;

            // Poll for completion
            return await this.pollLeonardoGeneration(generationId);
        } catch (error) {
            console.error('Leonardo generation failed:', error);
            throw error;
        }
    }

    async pollLeonardoGeneration(generationId, maxAttempts = 30) {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const response = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
                    headers: {
                        'Authorization': `Bearer ${this.leonardoApiKey}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Leonardo status check failed: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.generations_by_pk.status === 'COMPLETE' && data.generations_by_pk.generated_images.length > 0) {
                    return data.generations_by_pk.generated_images[0].url;
                }
                
                if (data.generations_by_pk.status === 'FAILED') {
                    throw new Error('Leonardo generation failed');
                }

                // Wait 2 seconds before next poll
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                if (i === maxAttempts - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        throw new Error('Leonardo generation timeout');
    }

    async createLeonardoDataset(name, description = '') {
        if (!this.leonardoApiKey) {
            throw new Error('Leonardo API key not set');
        }

        try {
            const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/datasets', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.leonardoApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    description: description || `KTG Avatar Dataset for ${name}`
                })
            });

            if (!response.ok) {
                throw new Error(`Leonardo dataset creation failed: ${response.status}`);
            }

            const data = await response.json();
            this.leonardoDatasetId = data.insert_datasets_one.id;
            return data.insert_datasets_one;
        } catch (error) {
            console.error('Leonardo dataset creation failed:', error);
            throw error;
        }
    }

    generateLocalAvatar(gender, name) {
        // Generate a unique seed for consistent avatars
        const seed = encodeURIComponent(name + gender + Date.now());
        
        // Use DiceBear API for realistic avatars as final fallback
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=2f27c8,4fb6c1,ff6b6b&size=512`;
    }

    getPlaceholderImage(gender) {
        // Generate a unique seed for consistent but varied avatars
        const seed = encodeURIComponent(gender + Date.now() + Math.random());
        
        // Use DiceBear API for realistic avatars
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=2f27c8,4fb6c1,ff6b6b&size=512`;
    }

    setLeonardoApiKey(key) {
        this.leonardoApiKey = key;
    }

    setLeonardoDatasetId(id) {
        this.leonardoDatasetId = id;
    }
}

// Initialize global AI service
window.aiAvatarService = new AIAvatarService();