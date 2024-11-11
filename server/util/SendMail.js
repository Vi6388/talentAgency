const nodemailer = require('nodemailer');
const path = require("path");
const ejs = require('ejs');
const dotenv = require("dotenv");
dotenv.config();

const fs = require('fs');
const juice = require('juice');

const sendEmail = async ({ filename, data, subject, toEmail }) => {
    try {
        // Read the EJS template
        const templateString = fs.readFileSync(`./views/${filename}`, 'utf-8');
        const htmlWithStyles = templateString;
        const inlinedHtml = juice(htmlWithStyles);

        // Render HTML string
        const html = ejs.render(inlinedHtml, { result: data });

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
            from: process.env.SMTP_USERNAME,
            to: toEmail,
            subject: subject,
            html: html,
        });

        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = { sendEmail }; // Export the function