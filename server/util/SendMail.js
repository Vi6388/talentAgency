const nodemailer = require('nodemailer');
const path = require("path");
const ejs = require('ejs');
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async ({ filename, data, subject, toEmail }) => {
    try {
        const emailTemplatePath = path.join(__dirname, '..', 'views', filename);
        const emailContent = await ejs.renderFile(emailTemplatePath, { result: data });

        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_SERVER,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Send email
        const info = await transporter.sendMail({
            from: process.env.PUBLIC_URL,
            to: toEmail,
            subject: subject,
            html: emailContent,
            attachments: [{
                content: data
            }],
        });

        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = { sendEmail }; // Export the function
