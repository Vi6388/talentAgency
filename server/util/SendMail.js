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

        let summaryList = data?.summaryList;
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

const convertDateFormat = (date) => {
    if (date !== "Invalid Date" && new Date(date) !== "Invalid Date" && date !== "" && date !== undefined) {
        const day = new Date(date).getDate();
        const month = new Date(date).getMonth() + 1;
        const year = new Date(date).getFullYear();
        return year + "-" + month + "-" + day;
    }
}

const combineDateAndTime = (date, time) => {
    if (date !== "Invalid Date" && new Date(date) !== "Invalid Date" && date !== "" && date !== undefined) {
        const [hours, minutes] = time.split(':').map(Number); // Split and convert to numbers
        const newDate = new Date(date); // Create a new Date object based on the original date
        newDate.setUTCHours(hours, minutes, 0, 0); // Set the hours and minutes (UTC)
        return newDate;
    }
};

const generateICSFile = (event) => {
    try {
        let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\n";

        let start = "";
        let end = "";
        if (event?.type === "event") {
            const eventDate = convertDateFormat(new Date(event?.eventDate));
            start = new Date(eventDate + " " + event?.eventStartTime);
            end = new Date(eventDate + " " + event?.eventEndTime);
        }

        if (event?.type === "social") {
            start = combineDateAndTime(new Date(event?.contentDueDate), "09:00");
            end = combineDateAndTime(new Date(event?.contentDueDate), "17:00");
        }

        if (['podcast', 'tv', 'radio', 'webSeries', 'Media'].includes(event?.type)) {
            start = new Date(event.startDate);
            end = new Date(event.endDate);
        }

        if (event?.type === "publishing") {
            start = combineDateAndTime(new Date(event?.finalDate), "09:00");
            end = combineDateAndTime(new Date(event?.finalDate), "17:00");
        }

        if (event.type === "travel") {
            start = combineDateAndTime(new Date(event?.departureDate), event?.departureTime);
            end = combineDateAndTime(new Date(event?.arrivalDate), event?.arrivalTime);
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

        // Construct the public URL for the ICS file
        const publicUrl = `http://82.112.255.74:4000/download-ics/${fileName}`;

        return publicUrl;
    } catch (error) {
        console.error('Error creating folder or file:', error);
        return;
    }
}

module.exports = { sendEmail }; // Export the function