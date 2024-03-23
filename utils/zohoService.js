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
    let transporter = nodemailer.createTransport({
        host: 'smtp.zoho.eu',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.ZOHO_EMAIL,
            pass: process.env.ZOHO_PASSWORD,
        }
    });

    try {
        let info = await transporter.sendMail({
            from: process.env.ZOHO_EMAIL, 
            to, 
            subject,
            text, 
            html, 
            attachments, 
        });

        return `Message sent: ${info.messageId}`;
    } catch (error) {
        throw new Error(`Error sending email: ${error}`);
    }
}

module.exports = { sendEmail };
