// Firebase Function for Avatar Generation with Gemini AI - v2.0
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp();
}

// Initialize Gemini AI (will be initialized in function)
let genAI = null;

exports.generateAvatar = functions.https.onRequest(async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.status(200).send('');
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    try {
        const { prompt, gender, name, userId } = req.body;
        
        if (!prompt || !gender || !name) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        // Initialize Gemini AI if not already done
        if (!genAI) {
            const apiKey = functions.config().gemini?.api_key || 'AIzaSyASDSIx0pZaMjas6pVubc89D6eLa1KqFwU';
            genAI = new GoogleGenerativeAI(apiKey);
        }
        
        // Use Gemini to enhance the avatar description
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const enhancedPrompt = `Create a detailed visual description for a ${gender} character avatar named ${name}. 
        Original description: ${prompt}
        
        Please provide a detailed, artistic description suitable for image generation, focusing on:
        - Facial features and expression
        - Hair style and color
        - Clothing/outfit style
        - Overall aesthetic and mood
        - Fantasy/game character elements
        
        Keep it concise but vivid, suitable for AI image generation.`;

        const result = await model.generateContent(enhancedPrompt);
        const enhancedDescription = result.response.text();

        // For now, we'll use a placeholder service since Gemini doesn't generate images
        // In production, you'd integrate with an image generation service here
        const imageUrl = await generatePlaceholderWithDescription(gender, name, enhancedDescription);

        // Store the avatar data in Firestore
        await admin.firestore().collection('avatars').add({
            userId: userId,
            name: name,
            gender: gender,
            originalPrompt: prompt,
            enhancedDescription: enhancedDescription,
            imageUrl: imageUrl,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({
            success: true,
            imageUrl: imageUrl,
            description: enhancedDescription
        });

    } catch (error) {
        console.error('Avatar generation error:', error);
        res.status(500).json({ 
            error: 'Avatar generation failed',
            message: error.message 
        });
    }
});

// Placeholder image generator with enhanced descriptions
async function generatePlaceholderWithDescription(gender, name, description) {
    // Use a more realistic avatar service
    const seed = name + gender + Date.now();
    const avatarStyle = gender.toLowerCase() === 'female' ? 'female' : 'male';
    
    // Use DiceBear API for more realistic avatars
    const diceBearUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=2f27c8,4fb6c1,ff6b6b&size=512`;
    
    // Alternative: Use UI Avatars as fallback
    const uiAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=512&background=2f27c8&color=fff&format=png&rounded=true&bold=true`;
    
    return diceBearUrl;
}