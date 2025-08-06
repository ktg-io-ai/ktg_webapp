// AI Avatar Generation Service with Gemini & Firebase
class AIAvatarService {
    constructor() {
        this.geminiApiKey = null;
        this.firebaseFunction = 'https://us-central1-ktgio-3k38n.cloudfunctions.net/generateAvatar';
    }

    async generateAvatar(gender, name, tagline, customPrompt = '') {
        const prompt = this.buildPrompt(gender, name, tagline, customPrompt);
        
        try {
            // Try Pollinations AI first (free, high quality)
            return await this.generateWithPollinations(prompt, gender, name);
        } catch (error) {
            console.warn('Pollinations failed, trying Hugging Face:', error);
            try {
                return await this.generateWithHuggingFace(prompt, gender, name);
            } catch (error2) {
                console.warn('Hugging Face failed, using DiceBear:', error2);
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

    async generateWithHuggingFace(prompt, gender, name) {
        // Hugging Face Inference API - Free tier available
        const response = await fetch('https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: `portrait of ${prompt}, high quality, detailed, professional headshot, ${gender} person`,
                parameters: {
                    width: 512,
                    height: 512,
                    num_inference_steps: 20
                }
            })
        });
        
        if (!response.ok) {
            throw new Error('Hugging Face API failed');
        }
        
        const blob = await response.blob();
        return URL.createObjectURL(blob);
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

    setGeminiApiKey(key) {
        this.geminiApiKey = key;
    }
}

// Initialize global AI service
window.aiAvatarService = new AIAvatarService();