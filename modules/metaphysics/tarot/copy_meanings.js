// Script to copy English meanings to other language folders as placeholders
const fs = require('fs');
const path = require('path');

const languages = ['es', 'fr', 'zh', 'ja', 'ko', 'ru', 'ar'];
const meaningDir = './meaning';

// Get all English meaning files
const englishFiles = fs.readdirSync(meaningDir).filter(file => file.endsWith('.txt'));

languages.forEach(lang => {
  const langDir = path.join(meaningDir, lang);
  
  englishFiles.forEach(file => {
    const englishPath = path.join(meaningDir, file);
    const langPath = path.join(langDir, file);
    
    // Only copy if file doesn't exist
    if (!fs.existsSync(langPath)) {
      const content = fs.readFileSync(englishPath, 'utf8');
      fs.writeFileSync(langPath, `[${lang.toUpperCase()}] ${content}`);
    }
  });
  
  console.log(`Copied meanings to ${lang}`);
});

console.log('Done! All language folders now have placeholder meanings.');