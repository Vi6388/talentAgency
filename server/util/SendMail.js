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

        const summaryList = data?.summaryList;
        const icsFiles = [];

        if (summaryList?.length > 0 && data?.type === "job") {
            const updatedSummaryList = [];
            for (const item of summaryList) {
                const icsFile = generateICSFile(item);
                icsFiles.push(icsFile);
                updatedSummaryList.push({
                    ...item,
                    fileUrl: icsFile
                })
            }
            summaryList = updatedSummaryList;
        }
        console.log(summaryList);

        const totalEsitmate = 0;

        // Render HTML string
        const html = ejs.render(inlinedHtml, {
            summaryList: summaryList,
            job: data?.job,
            invoiceList: data?.invoiceList,
            totalEsitmate: totalEsitmate,
            icsFiles: icsFiles
        });

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

        const emailOptions = {
            from: process.env.SMTP_USERNAME,
            to: toEmail,
            subject: subject,
            html: html,
        };

        if (icsFiles.length > 0) {
            emailOptions.attachments = icsFiles.map(filePath => ({
                filename: path.basename(filePath),
                path: filePath,
                contentType: 'text/calendar',
            }));
        }

        // Send email
        if (toEmail) {
            const info = await transporter.sendMail(emailOptions);
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


const generateICSFile = (event) => {
    try {
        let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\n";

        let start = "";
        let end = "";
        if (event?.type === "event") {
            const eventDate = new Date(event?.eventDate).toISOString().replace(/[-:]/g, '').split('.')[0];
            start = eventDate + " " + event?.eventStartTime;
            end = eventDate + " " + event?.eventEndTime;
        }

        const startDate = start;
        const endDate = end;
        const description = event?.keyMessages + "\n" + "DELIVERABLES: " + "\n" + event?.deleverables;

        icsContent += `BEGIN:VEVENT\n`;
        icsContent += `SUMMARY:${event?.jobTitle}\n`;
        icsContent += `DTSTART:${startDate}\n`;
        icsContent += `DTEND:${endDate}\n`;
        icsContent += `DESCRIPTION:${description}\n`;
        icsContent += `LOCATION:Online\n`; // Customize location as needed
        icsContent += `STATUS:CONFIRMED\n`;
        icsContent += `BEGIN:VALARM\nTRIGGER:-PT15M\nDESCRIPTION:Reminder for ${event?.jobTitle}\nACTION:DISPLAY\nEND:VALARM\n`;
        icsContent += `END:VEVENT\n`;

        icsContent += "END:VCALENDAR";

        const folderPath = path.join(__dirname, '../public/generated-events');

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const fileName = `${event?.type}-${event?._id}.ics`;
        const filePath = path.join(folderPath, fileName);
        fs.writeFileSync(filePath, icsContent);

        return filePath;
    } catch (error) {
        console.error('Error creating folder or file:', error);
        return;
    }
}

module.exports = { sendEmail }; // Export the function