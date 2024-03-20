require('dotenv').config(); // Ensure you load environment variables
const nodemailer = require('nodemailer');

/**
 * Send an email with optional embedded images and attachments.
 * 
 * @param {Object} mailOptions - The mail options
 * @param {string} mailOptions.to - Recipient email address(es)
 * @param {string} mailOptions.subject - Email subject
 * @param {string} mailOptions.text - Plain text email content
 * @param {string} mailOptions.html - HTML email content
 * @param {Array} mailOptions.attachments - Array of attachment objects
 */
async function sendEmail({to, subject, text, html, attachments = []}) {
    if(text){
        console.log(text);
        return;
    }
    if(html){
        console.log(html);
    }
}

module.exports = { sendEmail };
