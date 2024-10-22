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
            user: 'atarimae@atarimae.com',
            pass: 'AtarimaeAdmin123!@#',
        },
    });

    // Send email
    const info = await transporter.sendMail({
        from: 'atarimae.com',
        to: toEmail,
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
