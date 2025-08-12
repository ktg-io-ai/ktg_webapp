// Leonardo AI Configuration Template
// Copy this file to leonardo-config.js and add your API key
// Get your API key from: https://cloud.leonardo.ai/

const LeonardoConfig = {
    // Replace with your actual Leonardo AI API key
    apiKey: 'YOUR_LEONARDO_API_KEY_HERE',
    
    // Optional: Dataset ID for custom training
    datasetId: null,
    
    // Default model settings
    defaultModel: 'b24e16ff-06e3-43eb-8d33-4416c2d75876', // Leonardo Creative
    
    // Generation settings
    settings: {
        width: 512,
        height: 512,
        guidance_scale: 7,
        num_images: 1
    },
    
    // Initialize the AI service with Leonardo credentials
    init() {
        if (window.aiAvatarService && this.apiKey !== 'YOUR_LEONARDO_API_KEY_HERE') {
            window.aiAvatarService.setLeonardoApiKey(this.apiKey);
            if (this.datasetId) {
                window.aiAvatarService.setLeonardoDatasetId(this.datasetId);
            }
            console.log('Leonardo AI service configured successfully');
            return true;
        } else {
            console.warn('Leonardo AI API key not configured. Please set your API key in leonardo-config.js');
            return false;
        }
    }
};

// Auto-initialize when loaded
if (typeof window !== 'undefined') {
    window.LeonardoConfig = LeonardoConfig;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => LeonardoConfig.init());
    } else {
        LeonardoConfig.init();
    }
}