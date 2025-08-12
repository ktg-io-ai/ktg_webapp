// Language Management System for KTG Framework
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('ktg-language') || 'en';
        this.translations = {};
        this.initialized = false;
        this.observers = [];
    }

    async init() {
        if (!this.initialized) {
            await this.loadLanguage(this.currentLanguage);
            this.initialized = true;
        }
        return this;
    }

    // Add observer for language changes
    addObserver(callback) {
        this.observers.push(callback);
    }

    // Notify all observers of language change
    notifyObservers(langCode) {
        this.observers.forEach(callback => {
            try {
                callback(langCode);
            } catch (error) {
                console.error('Observer callback error:', error);
            }
        });
    }

    async loadLanguage(langCode) {
        try {
            console.log(`Loading language: ${langCode}`);
            const response = await fetch(`../../shared/languages/${langCode}.json`);
            console.log('Language file response:', response.status);
            this.translations = await response.json();
            console.log('Translations loaded:', Object.keys(this.translations));
            this.currentLanguage = langCode;
            localStorage.setItem('ktg-language', langCode);
            this.updateUI();
            this.notifyObservers(langCode);
        } catch (error) {
            console.error(`Failed to load language ${langCode}:`, error);
            if (langCode !== 'en') {
                this.loadLanguage('en');
            }
        }
    }

    getText(path) {
        const keys = path.split('.');
        let value = this.translations;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return path;
            }
        }
        
        return value || path;
    }

    updateUI() {
        // Update elements with data-lang attribute
        const elements = document.querySelectorAll('[data-lang]');
        
        elements.forEach(element => {
            if (!element) return;
            
            const langPath = element.getAttribute('data-lang');
            if (!langPath) return;
            
            const translation = this.getText(langPath);
            
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email' || element.type === 'password')) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update elements with data-translate attribute (new standard)
        const translateElements = document.querySelectorAll('[data-translate]');
        
        translateElements.forEach(element => {
            if (!element) return;
            
            const langPath = element.getAttribute('data-translate');
            if (!langPath) return;
            
            const translation = this.getText(langPath);
            
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email' || element.type === 'password')) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update language selects
        const languageSelects = document.querySelectorAll('#languageSelect, .language-select');
        languageSelects.forEach(select => {
            if (select) {
                select.value = this.currentLanguage;
            }
        });
    }

    changeLanguage(langCode) {
        this.loadLanguage(langCode);
        
        // Broadcast language change to all windows/frames
        this.broadcastLanguageChange(langCode);
    }

    // Broadcast language change to parent and child frames
    broadcastLanguageChange(langCode) {
        try {
            // Send to parent window if in iframe
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({
                    type: 'LANGUAGE_CHANGE',
                    language: langCode
                }, '*');
            }
            
            // Send to all child iframes
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    iframe.contentWindow.postMessage({
                        type: 'LANGUAGE_CHANGE',
                        language: langCode
                    }, '*');
                } catch (e) {
                    console.log('Could not send message to iframe:', e);
                }
            });
        } catch (error) {
            console.error('Error broadcasting language change:', error);
        }
    }

    getSupportedLanguages() {
        return {
            'en': 'English',
            'es': 'Español',
            'fr': 'Français',
            'zh': '中文',
            'ja': '日本語',
            'ko': '한국어',
            'ru': 'Русский',
            'ar': 'العربية'
        };
    }
}

const langManager = new LanguageManager();

// Global language change handler
function changeLanguage(language) {
    langManager.changeLanguage(language);
    
    // Reload iframes to apply language changes (for pages that need it)
    setTimeout(() => {
        const mainFrame = document.getElementById('mainFrame');
        const rightFrame = document.getElementById('rightFrame');
        const leftFrame = document.getElementById('leftFrame');
        
        if (mainFrame && mainFrame.src) {
            mainFrame.src = mainFrame.src;
        }
        if (rightFrame && rightFrame.src) {
            rightFrame.src = rightFrame.src;
        }
        if (leftFrame && leftFrame.src) {
            leftFrame.src = leftFrame.src;
        }
    }, 100);
}

// Listen for language change messages from other frames
window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'LANGUAGE_CHANGE') {
        const newLanguage = event.data.language;
        if (newLanguage !== langManager.currentLanguage) {
            langManager.loadLanguage(newLanguage);
        }
    }
});

// Initialize immediately like dashboard
langManager.loadLanguage(langManager.currentLanguage);

// Make langManager globally available
window.langManager = langManager;
window.changeLanguage = changeLanguage;