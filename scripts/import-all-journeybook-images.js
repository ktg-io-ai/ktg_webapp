const mysql = require('mysql2/promise');

// Import all questions with images from the original data
const allQuestionsWithImages = [
    // Values - TRAIT
    { section: 'values', subgroup: 'TRAIT', question: 'Your age is UNDER', image: '../../JOURNEYBOOK/Values/age.jpg' },
    { section: 'values', subgroup: 'TRAIT', question: 'Your age is OVER', image: '../../JOURNEYBOOK/Values/age.jpg' },
    { section: 'values', subgroup: 'TRAIT', question: 'Your GENDER IS', image: '../../JOURNEYBOOK/Values/groupphoto01.jpg' },
    { section: 'values', subgroup: 'TRAIT', question: 'Date of Birth - Used for Astrology - Information not shown', image: '../../JOURNEYBOOK/Values/TreasureMap.jpg' },
    { section: 'values', subgroup: 'TRAIT', question: 'Time of Birth - Used for Astrology - Information not shown', image: '../../JOURNEYBOOK/Values/TreasureMap.jpg' },
    { section: 'values', subgroup: 'TRAIT', question: 'City of Birth - Used for Astrology - Information not shown', image: '../../JOURNEYBOOK/Values/Globe.png' },
    { section: 'values', subgroup: 'TRAIT', question: 'What is your height?', image: '../../JOURNEYBOOK/Values/body-types.jpg' },
    { section: 'values', subgroup: 'TRAIT', question: 'What is your weight?', image: '../../JOURNEYBOOK/Values/take-care-of-your-body.jpg' },
    { section: 'values', subgroup: 'TRAIT', question: 'COMFORTABLE WITH…', image: '../../JOURNEYBOOK/Values/690x380-Romance-Kissing.jpg' },
    
    // Values - Core
    { section: 'values', subgroup: 'Core', question: 'Is Race Important?', image: '../../JOURNEYBOOK/Values/race.jpg' },
    { section: 'values', subgroup: 'Core', question: 'Is Ethnicity Important?', image: '../../JOURNEYBOOK/Values/race.jpg' },
    { section: 'values', subgroup: 'Core', question: 'Is Age Important?', image: '../../JOURNEYBOOK/Values/age.jpg' },
    { section: 'values', subgroup: 'Core', question: 'Is Religion Important?', image: '../../JOURNEYBOOK/Values/agnosticism.jpg' },
    { section: 'values', subgroup: 'Core', question: 'Is Marriage Important?', image: '../../JOURNEYBOOK/Values/monogamy.jpg' },
    { section: 'values', subgroup: 'Core', question: 'Are Looks Important?', image: '../../JOURNEYBOOK/Values/looks_important.jpg' },
    { section: 'values', subgroup: 'Core', question: 'Do you want Children?', image: '../../JOURNEYBOOK/Values/Group-children-01.jpg' },
    
    // Values - Personality
    { section: 'values', subgroup: 'Personality', question: 'Are you an Outdoor Person?', image: '../../JOURNEYBOOK/Values/Outdoor_Person.png' },
    { section: 'values', subgroup: 'Personality', question: 'Are you a Country Person?', image: '../../JOURNEYBOOK/Values/country.jpg' },
    { section: 'values', subgroup: 'Personality', question: 'Are you a City Person?', image: '../../JOURNEYBOOK/Values/City_Person.jpg' },
    { section: 'values', subgroup: 'Personality', question: 'Are you an Exercize Person?', image: '../../JOURNEYBOOK/Values/exercise.jpg' },
    { section: 'values', subgroup: 'Personality', question: 'Are you a Dog Person?', image: '../../JOURNEYBOOK/Values/Dog_Person.png' },
    { section: 'values', subgroup: 'Personality', question: 'Are you a Cat Person?', image: '../../JOURNEYBOOK/Values/cat-person.jpg' },
    { section: 'values', subgroup: 'Personality', question: 'Are you a Romantic Person?', image: '../../JOURNEYBOOK/Values/690x380-Romance-Kissing.jpg' },
    
    // Compatibility - Intellect
    { section: 'compatibility', subgroup: 'Intellect', question: 'Alchemy', image: '../../JOURNEYBOOK/Compatibility/alchemy.png' },
    { section: 'compatibility', subgroup: 'Intellect', question: 'Archaeology', image: '../../JOURNEYBOOK/Compatibility/archeology.png' },
    { section: 'compatibility', subgroup: 'Intellect', question: 'Astronomy', image: '../../JOURNEYBOOK/Compatibility/Astronomy.jpg' },
    { section: 'compatibility', subgroup: 'Intellect', question: 'Biology', image: '../../JOURNEYBOOK/Compatibility/biology.png' },
    { section: 'compatibility', subgroup: 'Intellect', question: 'Chemistry', image: '../../JOURNEYBOOK/Compatibility/chemistry.png' },
    
    // Compatibility - Adventure
    { section: 'compatibility', subgroup: 'Adventure', question: 'AmusementParks', image: '../../JOURNEYBOOK/Compatibility/amusement_parks.jpg' },
    { section: 'compatibility', subgroup: 'Adventure', question: 'ArtGalleries', image: '../../JOURNEYBOOK/Compatibility/galerie-de-arta.jpg' },
    { section: 'compatibility', subgroup: 'Adventure', question: 'BeachCombing', image: '../../JOURNEYBOOK/Compatibility/beachcombing.jpg' },
    { section: 'compatibility', subgroup: 'Adventure', question: 'Clubbing', image: '../../JOURNEYBOOK/Compatibility/clubbing.jpg' },
    { section: 'compatibility', subgroup: 'Adventure', question: 'Fishing', image: '../../JOURNEYBOOK/Compatibility/fishing.jpg' },
    { section: 'compatibility', subgroup: 'Adventure', question: 'Movies', image: '../../JOURNEYBOOK/Compatibility/movie goers.jpg' },
    { section: 'compatibility', subgroup: 'Adventure', question: 'Museums', image: '../../JOURNEYBOOK/Compatibility/museums.jpg' },
    { section: 'compatibility', subgroup: 'Adventure', question: 'Shopping', image: '../../JOURNEYBOOK/Compatibility/shopping.jpg' },
    
    // Compatibility - Hobbies
    { section: 'compatibility', subgroup: 'Hobbies', question: 'Cooking', image: '../../JOURNEYBOOK/Compatibility/cooking.png' },
    { section: 'compatibility', subgroup: 'Hobbies', question: 'Drawing', image: '../../JOURNEYBOOK/Compatibility/drawing.png' },
    { section: 'compatibility', subgroup: 'Hobbies', question: 'Gardening', image: '../../JOURNEYBOOK/Compatibility/gardening.png' },
    { section: 'compatibility', subgroup: 'Hobbies', question: 'Meditation', image: '../../JOURNEYBOOK/Compatibility/meditation.png' },
    { section: 'compatibility', subgroup: 'Hobbies', question: 'Painting', image: '../../JOURNEYBOOK/Compatibility/painting.png' },
    { section: 'compatibility', subgroup: 'Hobbies', question: 'Photography', image: '../../JOURNEYBOOK/Compatibility/photography.png' },
    { section: 'compatibility', subgroup: 'Hobbies', question: 'Singing', image: '../../JOURNEYBOOK/Compatibility/singing.png' },
    
    // Intimacy - Basic
    { section: 'intimacy', subgroup: 'Basic', question: 'Is Quantity as Important as Quality', image: '../../JOURNEYBOOK/Intimacy/jbimage_xx (1).jpg' },
    { section: 'intimacy', subgroup: 'Basic', question: 'How many times a week would like to have sex?', image: '../../JOURNEYBOOK/Intimacy/jbimage_xx (2).jpg' },
    { section: 'intimacy', subgroup: 'Basic', question: 'Are you tame?', image: '../../JOURNEYBOOK/Intimacy/jbimage_xx (3).jpg' },
    { section: 'intimacy', subgroup: 'Basic', question: 'Are yo wild?', image: '../../JOURNEYBOOK/Intimacy/jbimage_xx (4).jpg' },
    { section: 'intimacy', subgroup: 'Basic', question: 'Are you open minded?', image: '../../JOURNEYBOOK/Intimacy/jbimage_xx (6).jpg' },
    { section: 'intimacy', subgroup: 'Basic', question: 'Do you like experimentation?', image: '../../JOURNEYBOOK/Intimacy/jbimage_xx (7).jpg' },
    { section: 'intimacy', subgroup: 'Basic', question: 'Are you kinky?', image: '../../JOURNEYBOOK/Intimacy/jbimage_xx (8).jpg' }
];

async function importAllJourneyBookImages() {
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'ktg_local_dev'
        });
        
        console.log('Connected to database');
        console.log(`Processing ${allQuestionsWithImages.length} questions with images...`);
        
        let totalUpdated = 0;
        let notFound = 0;
        
        for (const item of allQuestionsWithImages) {
            try {
                const [result] = await connection.execute(
                    'UPDATE journeybook_pages SET image_url = ? WHERE section = ? AND subgroup = ? AND question = ?',
                    [item.image, item.section, item.subgroup, item.question]
                );
                
                if (result.affectedRows > 0) {
                    console.log(`✓ Updated: ${item.section}/${item.subgroup}/${item.question}`);
                    totalUpdated++;
                } else {
                    console.log(`✗ Not found: ${item.section}/${item.subgroup}/${item.question}`);
                    notFound++;
                }
            } catch (error) {
                console.error(`Error updating ${item.question}:`, error.message);
            }
        }
        
        console.log(`\n=== IMPORT SUMMARY ===`);
        console.log(`Total questions processed: ${allQuestionsWithImages.length}`);
        console.log(`Successfully updated: ${totalUpdated}`);
        console.log(`Not found in database: ${notFound}`);
        
    } catch (error) {
        console.error('Database error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

importAllJourneyBookImages();