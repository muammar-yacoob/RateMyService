const emailjs = require('emailjs-com'); 
const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;

emailjs.init(PUBLIC_KEY);

class EmailJsService {
    async sendEmail({ to, subject, text, html }) {
        const templateParams = {
            to_email: to,
            subject,
            message_html: html,
        };

        try {
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
            console.log('Email sent successfully using EmailJS');
        } catch (error) {
            console.error('Error sending email with EmailJS:', error);
            throw error;
        }
    }
}

module.exports = EmailJsService;