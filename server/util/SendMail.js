const nodemailer = require('nodemailer');
const path = require("path");
const ejs = require('ejs');

const sendEmail = async ({ filename, data, subject, toEmail }) => {
    const emailTemplatePath = path.join(__dirname, '..', 'views', filename);
    const emailContent = await ejs.renderFile(emailTemplatePath, { result: data });

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: 'send.ahasend.com',
        port: 587,
        requireTLS: true, // Force TLS
        service: 'gmail',
        auth: {
            user: 'your.email@gmail.com',
            pass: 'your-email-password',
        },
    });

    // Send email
    const info = await transporter.sendMail({
        from: 'your.email@gmail.com',
        to: toEmail,
        subject: subject,
        html: emailContent,
        attachments: [{
            content: data,
            encoding: 'base64',
            cid: 'uniqueImageCID', // Referenced in the HTML template
        }],
    });

    console.log('Email sent:', info.messageId);
}

module.exports = { sendEmail }; // Export the function
