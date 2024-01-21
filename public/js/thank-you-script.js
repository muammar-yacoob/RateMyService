const fs = require('fs');
const path = require('path');
const directoryPath = path.join(__dirname, '../public/res/imgs/thankyou');

document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (e) {
        const refreshButton = e.target.closest(".refresh-button");
        if (refreshButton) {
            e.preventDefault(); 
            const action = refreshButton.getAttribute("data-action");
            if (action === "reload") {
                let thankYouImages = fs.readdirSync(directoryPath);
                let randomIndex = Math.floor(Math.random() * thankYouImages.length);
                let selectedImage = thankYouImages[randomIndex];
                document.getElementById('thankYouImage').src = `/res/imgs/thankyou/${selectedImage}`;
            }
        }
    });
});