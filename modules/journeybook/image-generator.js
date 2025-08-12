// JourneyBook Image Generator using Leonardo AI
class JourneyBookImageGenerator {
    constructor() {
        this.apiKey = window.LEONARDO_CONFIG?.API_KEY;
        this.baseUrl = 'https://cloud.leonardo.ai/api/rest/v1';
        this.modelId = '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3'; // Leonardo Phoenix
    }

    // Generate contextual prompts for different question types
    generatePrompt(question, section, subgroup) {
        const baseStyle = "photorealistic, high quality, professional photography, warm lighting, ";
        
        const prompts = {
            // Values section prompts
            values: {
                TRAIT: {
                    age: `${baseStyle}diverse group of people of different ages, happy and confident`,
                    gender: `${baseStyle}inclusive representation of different gender identities, artistic portrait`,
                    height: `${baseStyle}silhouettes of people of different heights, artistic composition`,
                    weight: `${baseStyle}body positivity, healthy lifestyle, diverse body types`,
                    relationship: `${baseStyle}romantic couple, intimate moment, emotional connection`
                },
                Core: {
                    race: `${baseStyle}multicultural diversity, unity in diversity, beautiful faces`,
                    religion: `${baseStyle}spiritual symbols, peaceful meditation, interfaith harmony`,
                    marriage: `${baseStyle}wedding rings, commitment ceremony, love and partnership`,
                    children: `${baseStyle}happy family with children, parenting moments, joy`,
                    income: `${baseStyle}financial success symbols, career achievement, prosperity`
                },
                Religion: `${baseStyle}spiritual symbols, meditation, peaceful religious imagery`,
                Personality: `${baseStyle}lifestyle photography, personality traits visualization, authentic moments`
            },
            
            // Compatibility section prompts
            compatibility: {
                Intellect: `${baseStyle}academic setting, books, learning environment, intellectual pursuits`,
                Adventure: `${baseStyle}outdoor activities, travel destinations, exciting experiences`,
                Hobbies: `${baseStyle}creative activities, artistic pursuits, hobby equipment`,
                Diversions: `${baseStyle}entertainment, leisure activities, fun and relaxation`
            },
            
            // Intimacy section prompts (tasteful)
            intimacy: {
                Basic: `${baseStyle}romantic atmosphere, intimate setting, emotional connection, tasteful`,
                'Looking For': `${baseStyle}relationship goals, partnership ideals, romantic connection`,
                'Kinky Play (Warning)': `${baseStyle}artistic representation, abstract concepts, mature themes, tasteful`,
                TRAIT: `${baseStyle}identity expression, personal authenticity, self-acceptance`
            }
        };

        // Get specific prompt or fallback to section default
        let prompt = prompts[section]?.[subgroup] || prompts[section] || `${baseStyle}abstract concept visualization`;
        
        // Add question-specific context
        if (typeof prompt === 'object') {
            const questionLower = question.toLowerCase();
            for (const [key, value] of Object.entries(prompt)) {
                if (questionLower.includes(key)) {
                    prompt = value;
                    break;
                }
            }
            if (typeof prompt === 'object') {
                prompt = Object.values(prompt)[0]; // Default to first option
            }
        }

        return `${prompt}, related to: ${question}`;
    }

    // Generate image for a specific question
    async generateQuestionImage(question, section, subgroup) {
        const prompt = this.generatePrompt(question, section, subgroup);
        
        try {
            // Try Leonardo AI first
            const response = await fetch(`${this.baseUrl}/generations`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    height: 512,
                    modelId: this.modelId,
                    prompt: prompt,
                    width: 768,
                    num_images: 1,
                    guidance_scale: 7,
                    scheduler: "DPM_SOLVER",
                    presetStyle: "PHOTOGRAPHY"
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.sdGenerationJob?.generationId) {
                    return await this.pollForCompletion(data.sdGenerationJob.generationId);
                }
            }
        } catch (error) {
            console.error('Leonardo AI failed:', error);
        }
        
        // Fallback to Pollinations
        console.log('Using Pollinations fallback for:', question);
        return await this.generateWithPollinations(prompt);
    }
    
    // Fallback image generation with Pollinations
    async generateWithPollinations(prompt) {
        try {
            const encodedPrompt = encodeURIComponent(prompt);
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=512&seed=${Math.floor(Math.random() * 1000000)}`;
            return imageUrl;
        } catch (error) {
            console.error('Pollinations fallback failed:', error);
            return null;
        }
    }

    // Poll for Leonardo AI generation completion
    async pollForCompletion(generationId, maxAttempts = 10) {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const response = await fetch(`${this.baseUrl}/generations/${generationId}`, {
                    headers: { 'Authorization': `Bearer ${this.apiKey}` }
                });
                
                const data = await response.json();
                
                if (data.generations_by_pk?.status === 'COMPLETE') {
                    return data.generations_by_pk.generated_images[0]?.url;
                }
                
                if (data.generations_by_pk?.status === 'FAILED') {
                    throw new Error('Generation failed');
                }
                
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                console.error('Polling error:', error);
                break;
            }
        }
        
        return null;
    }

    // Save generated image to Firebase
    async saveImageToDatabase(questionKey, imageUrl, section, subgroup, question) {
        try {
            // Initialize Firebase if not already done
            if (!firebase.apps || firebase.apps.length === 0) {
                firebase.initializeApp({
                    apiKey: "AIzaSyDrgOGvn8NHuq3T_ODse8buij9KXg1WkzI",
                    authDomain: "ktgio-3k38n.firebaseapp.com",
                    projectId: "ktgio-3k38n",
                    storageBucket: "ktgio-3k38n.firebasestorage.app",
                    messagingSenderId: "416239278754",
                    appId: "1:416239278754:web:028cd9fd6f13a5a4ed95fb"
                });
            }
            
            const db = firebase.firestore();
            
            await db.collection('JourneyBookImages').doc(questionKey).set({
                imageUrl: imageUrl,
                section: section,
                subgroup: subgroup,
                question: question,
                generatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            });
            
            console.log('Image saved to Firebase:', questionKey);
            return true;
        } catch (error) {
            console.error('Error saving image to database:', error);
            return false;
        }
    }

    // Load image from database
    async loadImageFromDatabase(questionKey) {
        try {
            // Initialize Firebase if not already done
            if (!firebase.apps || firebase.apps.length === 0) {
                firebase.initializeApp({
                    apiKey: "AIzaSyDrgOGvn8NHuq3T_ODse8buij9KXg1WkzI",
                    authDomain: "ktgio-3k38n.firebaseapp.com",
                    projectId: "ktgio-3k38n",
                    storageBucket: "ktgio-3k38n.firebasestorage.app",
                    messagingSenderId: "416239278754",
                    appId: "1:416239278754:web:028cd9fd6f13a5a4ed95fb"
                });
            }
            
            const db = firebase.firestore();
            const doc = await db.collection('JourneyBookImages').doc(questionKey).get();
            
            if (doc.exists) {
                return doc.data().imageUrl;
            }
            
            return null;
        } catch (error) {
            console.error('Error loading image from database:', error);
            return null;
        }
    }

    // Generate and cache image for question
    async getOrGenerateImage(question, section, subgroup) {
        const questionKey = `${section}_${subgroup}_${question}`.replace(/[^a-zA-Z0-9_]/g, '_');
        
        // Try to load existing image
        let imageUrl = await this.loadImageFromDatabase(questionKey);
        
        if (!imageUrl) {
            // Generate new image
            console.log(`Generating image for: ${question}`);
            imageUrl = await this.generateQuestionImage(question, section, subgroup);
            
            if (imageUrl) {
                // Save to database
                await this.saveImageToDatabase(questionKey, imageUrl, section, subgroup, question);
                console.log(`Image generated and saved for: ${question}`);
            }
        }
        
        return imageUrl;
    }
}

// Initialize global instance
window.JourneyBookImageGenerator = new JourneyBookImageGenerator();