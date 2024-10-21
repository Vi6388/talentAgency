const nodemailer = require('nodemailer');
const path = require("path");
const ejs = require('ejs');

const sendEmail = async ({ filename, data, subject, toEmail }) => {
    const emailTemplatePath = path.join(__dirname, '..', 'views', filename);
    const emailContent = await ejs.renderFile(emailTemplatePath, { result: data });

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: '103.73.64.225',
        port: 587,
        requireTLS: true, // Force TLS
        auth: {
            user: 'honeypot.owner@gmail.com',
            pass: 'TalentAgency!@#123',
        },
    });

    // Send email
    const info = await transporter.sendMail({
        from: 'honeypot.owner@gmail.com',
        to: "laurahuillier90@gmail.com",
        subject: subject,
        html: emailContent,
        attachments: [{
            content: data
        }],
    });

    console.log(info)

    console.log('Email sent:', info.messageId);
}

module.exports = { sendEmail }; // Export the function
