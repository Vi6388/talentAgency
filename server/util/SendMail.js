// const nodemailer = require('nodemailer');
// const fs = require('fs');
// const { promisify } = require('util');

// const readFileAsync = promisify(fs.readFile);

// async function sendEmail() {
//     // Read the HTML template and image file
//     const htmlTemplate = await readFileAsync('path/to/your/template.html', 'utf-8');
//     const imageAttachment = await readFileAsync('path/to/your/image.png');

//     // Create a Nodemailer transporter
//     const transporter = nodemailer.createTransport({
//         host: 'send.ahasend.com',
//         port: 587,
//         requireTLS: true, //Force TLS
//         service: 'gmail',
//         auth: {
//             user: 'your.email@gmail.com',
//             pass: 'your-email-password',
//         },
//     });

//     // Send email
//     const info = await transporter.sendMail({
//         from: 'your.email@gmail.com',
//         to: 'recipient.email@example.com',
//         subject: 'Your Subject',
//         html: htmlTemplate,
//         attachments: [{
//             filename: 'image.png',
//             content: imageAttachment,
//             encoding: 'base64',
//             cid: 'uniqueImageCID', // Referenced in the HTML template
//         }],
//     });

//     console.log('Email sent:', info.messageId);
// }

// sendEmail();