// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const EMAIL_FROM = process.env.EMAIL_FROM;

// const sendEmail = async ({ to, subject, text, html }) => {
//     const msg = {
//         from: EMAIL_FROM, 
//         to, 
//         subject,
//         text,
//         html,
//     };

//     try {
//         await sgMail.send(msg);
//         console.log('Email sent successfully');
//     } catch (error) {
//         console.error('Error sending email:', error);
//         if (error.response) {
//             console.error(error.response.body);
//         }
//         throw error;
//     }
// };

// module.exports = sendEmail;
