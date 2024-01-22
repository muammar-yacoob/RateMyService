const fs = require('fs').promises;  // Importing the Promise-based version of fs
const path = require('path');
const directoryPath = path.join(__dirname, '../public/res/imgs/thankyou');

const getThankyouImage = async () => {
    try {
        const files = await fs.readdir(directoryPath);
        const randomIndex = Math.floor(Math.random() * files.length);
        const selectedImage = files[randomIndex];
        return `/res/imgs/thankyou/${selectedImage}`;
    } catch (err) {
        console.error(err);
        return '/res/imgs/default-image.jpg'; // Fallback image
    }
}

module.exports = getThankyouImage;