const JobEventModel = require("../Model/Job.Event.model");
const JobMediaModel = require("../Model/Job.Media.model");
const JobModel = require("../Model/Job.model");
const JobFinance = require("../Model/Job.Finance.model");
const JobPublishModel = require("../Model/Job.Publish.model");
const JobSocialModel = require("../Model/Job.Social.model");
const JobTravelModel = require("../Model/Job.Travel.model");
const { sendEmail } = require("../util/SendMail");
const dotenv = require("dotenv");
const { google } = require('googleapis');
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");

dotenv.config();

const key = require("../public/verdant-oven-438907-b1-6b1cb6f3f747.json");

const bucketName = "atarimaeagency";

const oauth2Client = new google.auth.OAuth2
  (
    process.env.CALENDAR_CLIENT_ID,
    process.env.CALENDAR_CLIENT_SECRET,
    process.env.CALENDAR_REDIRECT_URL
  );

const storage = new Storage({ keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS });

const bucket = storage.bucket("atarimaeagency");

module.exports.uploadFile = async (req, res, next) => {
  try {
    const talentName = req.body.talentName; // Replace with dynamic talent name if needed
    const newJobsFolder = 'NewJobs';
    const newJobFolder = 'NewJob';
    const talentFolderPrefix = `${talentName}/`;
    const newJobsFolderPath = `${talentFolderPrefix}${newJobsFolder}/`;
    const newJobFolderPath = `${newJobsFolderPath}${newJobFolder}`;

    // Check if the req.body.talentName folder exists
    const [talentNameFiles] = await bucket.getFiles({ prefix: talentFolderPrefix });
    if (talentNameFiles.length === 0) {
      console.log(`Folder '${talentName}' does not exist. Creating it...`);
    }

    // Check if the "NewJobs" folder exists
    const [newJobsFiles] = await bucket.getFiles({ prefix: newJobsFolderPath });
    if (newJobsFiles.length === 0) {
      console.log(`Folder '${newJobsFolder}' does not exist. Creating it...`);
    }

    // Check if the "NewJob" folder exists
    const [newJobFiles] = await bucket.getFiles({ prefix: newJobFolderPath });
    if (newJobFiles.length === 0) {
      console.log(`Folder '${newJobFolder}' does not exist. Creating it...`);
    }

    let filesToUpload = [];

    if (req.files.contractFile?.length > 0) {
      filesToUpload.push({ key: 'contractFile', name: `${newJobFolderPath}/Contract/${req.files.contractFile[0]?.originalname}` });
    }
    if (req.files.briefFile?.length > 0) {
      filesToUpload.push({ key: 'briefFile', name: `${newJobFolderPath}/Brief/${req.files.briefFile[0]?.originalname}` });
    }
    if (req.files.supportingFile?.length > 0) {
      filesToUpload.push({ key: 'supportingFile', name: `${newJobFolderPath}/Supportingfiles/${req.files.supportingFile[0]?.originalname}` });
    }

    const uploadPromises = filesToUpload.map(file => {
      return new Promise((resolve, reject) => {
        if (!file.name) {
          return resolve();
        }

        const blob = bucket.file(file.name);
        const blobStream = blob.createWriteStream({ resumable: false });

        blobStream.on("error", (err) => {
          console.error("Blob stream error:", err);
          reject({ name: file.name, message: err.message });
        });

        blobStream.on("finish", async () => {
          const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);

          try {
            await blob.makePublic();
            resolve({ name: file.name, url: publicUrl, key: file.key });
          } catch (err) {
            console.error("Make public error:", err);
            resolve({
              name: file.name,
              message: `Uploaded successfully, but public access is denied!`,
              url: publicUrl,
              key: file.key
            });
          }
        });

        blobStream.end(req.files[file.key][0].buffer);
      });
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    return res.json({
      status: 200,
      message: "Files processed successfully.",
      data: uploadedFiles.filter(Boolean), // Filter out undefined values
    });

  } catch (err) {
    console.error("Upload error:", err);
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.json({
        status: 413,
        message: "File size cannot be larger than 2MB!",
      });
    }
    return res.json({
      status: 500,
      message: `Could not upload the files. ${err.message}`,
    });
  }
};

module.exports.getFiles = async (req, res, next) => {
  try {
    const fileName = req.params.filename;
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    return res.json({ status: 200, success: true, data: publicUrl });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

module.exports.getJobList = async (req, res, next) => {
  try {
    const jobList = await JobModel.find({ estimateStatus: false, isLive: true });
    return res.json({ status: 200, message: "Get Job list", success: true, data: jobList });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error fetching job list", error: error.message });
  }
}

module.exports.AddJob = async (req, res, next) => {
  try {
    const detailData = req.body.details;
    // Create Job Model
    const newJob = await JobModel.create({
      contactDetails: {
        firstname: detailData?.firstname,
        surname: detailData?.surname,
        email: detailData?.email,
        position: detailData?.position,
        phoneNumber: detailData?.phoneNumber,
      },
      companyDetails: {
        companyName: detailData?.companyName,
        abn: detailData?.abn,
        postalAddress: detailData?.postalAddress,
        suburb: detailData?.suburb,
        state: detailData?.state,
        postcode: detailData?.postcode
      },
      jobName: detailData?.jobName,
      talent: {
        talentName: detailData?.talentName,
        email: detailData?.talentEmail,
        highlightColor: detailData?.highlightColor,
        manager: detailData?.manager
      },
      supplierRequired: detailData?.supplierRequired,
      labelColor: detailData?.labelColor,
      startDate: new Date(detailData?.startDate),
      endDate: new Date(detailData?.endDate),
      estimateStatus: false,
      isLive: true,
      jobStatus: 1,
      uploadedFiles: {
        contractFile: detailData?.uploadedFiles?.contractFile || "",
        briefFile: detailData?.uploadedFiles?.briefFile || "",
        supportingFile: detailData?.uploadedFiles?.supportingFile || "",
      },
    });

    const jobInvoiceList = req.body.invoiceList;
    if (jobInvoiceList?.length > 0) {
      await Promise.all(jobInvoiceList.map(invoice => {
        return JobFinance.create({
          ...invoice,
          jobId: newJob?._id
        });
      }));
    }

    const jobSummaryList = req.body.jobSummaryList;
    if (jobSummaryList?.length > 0) {
      await Promise.all(jobSummaryList.map(async summary => {
        switch (summary.type) {
          case 'social':
            return JobSocialModel.create({ ...summary, jobId: newJob?._id });
          case 'event':
            return JobEventModel.create({ ...summary, jobId: newJob?._id });
          case 'publishing':
            return JobPublishModel.create({ ...summary, jobId: newJob?._id });
          case 'travel':
            return JobTravelModel.create({ ...summary, jobId: newJob?._id });
          case 'podcast':
          case 'radio':
          case 'webSeries':
          case 'tv':
            return JobMediaModel.create({ ...summary, jobId: newJob?._id });
          default:
            return null;
        }
      }));
    }
    // await this.createCalendarEvent(req, res, next);

    const emailData = {
      jobTitle: newJob?.jobName,
      startDate: new Date(newJob?.startDate).toLocaleDateString("en-US"),
      endDate: new Date(newJob?.endDate).toLocaleDateString("en-US"),
      jobDesc: ""
    };
    const toEmail = newJob?.talent?.email || newJob?.contactDetails?.email;
    await sendEmail({
      filename: 'NewJob.ejs',
      data: emailData,
      subject: "New Job Notification",
      toEmail: toEmail,
    });
    return res.json({ status: 200, message: "Job added successfully", success: true, data: newJob });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports.getJobById = async (req, res, next) => {
  try {
    const job = await JobModel.findById(req.params.id);
    const invoice = await JobFinance.find({ jobId: req.params.id });
    const social = await JobSocialModel.find({ jobId: req.params.id });
    const event = await JobEventModel.find({ jobId: req.params.id });
    const publishing = await JobPublishModel.find({ jobId: req.params.id });
    const travel = await JobTravelModel.find({ jobId: req.params.id });
    const media = await JobMediaModel.find({ jobId: req.params.id });

    let list = [];
    social.forEach((item) => {
      list.push({ ...item?._doc, type: "social" });
    });
    event.forEach((item) => {
      list.push({ ...item?._doc, type: "event" });
    });
    publishing.forEach((item) => {
      list.push({ ...item?._doc, type: "publishing" });
    });
    travel.forEach((item) => {
      list.push({ ...item?._doc, type: "travel" });
    });
    media.forEach((item) => {
      list.push(item);
    });

    const data = {
      details: job,
      invoiceList: invoice,
      jobSummaryList: list,
    };

    if (job) {
      return res.json({ success: true, status: 200, message: "Job exists", data: data });
    } else {
      return res.status(404).json({ success: false, status: 404, message: "Job not found" });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
}

module.exports.UpdateJob = async (req, res, next) => {
  try {
    const detailData = req.body.details;
    const existJob = await JobModel.findById(req.params.id);
    if (existJob) {
      await existJob.updateOne({
        contactDetails: {
          firstname: detailData?.firstname,
          surname: detailData?.surname,
          email: detailData?.email,
          position: detailData?.position,
          phoneNumber: detailData?.phoneNumber,
        },
        companyDetails: {
          companyName: detailData?.companyName,
          abn: detailData?.abn,
          postalAddress: detailData?.postalAddress,
          suburb: detailData?.suburb,
          state: detailData?.state,
          postcode: detailData?.postcode
        },
        jobName: detailData?.jobName,
        talent: {
          talentName: detailData?.talentName,
          email: detailData?.talentEmail,
          highlightColor: detailData?.highlightColor,
          manager: detailData?.manager
        },
        supplierRequired: detailData?.supplierRequired,
        labelColor: detailData?.labelColor,
        startDate: new Date(detailData?.startDate),
        endDate: new Date(detailData?.endDate),
        uploadedFiles: {
          contractFile: detailData?.uploadedFiles?.contractFile || existJob?.uploadedFiles?.contractFile,
          briefFile: detailData?.uploadedFiles?.briefFile || existJob?.uploadedFiles?.briefFile,
          supportingFile: detailData?.uploadedFiles?.supportingFile || existJob?.uploadedFiles?.supportingFile,
        },
        jobStatus: detailData?.jobStatus
      });

      await JobFinance.deleteMany({ jobId: req.params.id }); // Delete existing invoices
      const jobInvoiceList = req.body.invoiceList;
      if (jobInvoiceList?.length > 0) {
        await Promise.all(jobInvoiceList.map(invoice => {
          return JobFinance.create({
            ...invoice,
            jobId: existJob?._id
          });
        }));
      }

      await JobSocialModel.deleteMany({ jobId: req.params.id });
      await JobEventModel.deleteMany({ jobId: req.params.id });
      await JobPublishModel.deleteMany({ jobId: req.params.id });
      await JobTravelModel.deleteMany({ jobId: req.params.id });
      await JobMediaModel.deleteMany({ jobId: req.params.id });

      const jobSummaryList = req.body.jobSummaryList;
      if (jobSummaryList?.length > 0) {
        await Promise.all(jobSummaryList.map(summary => {
          switch (summary.type) {
            case 'social':
              return JobSocialModel.create({ ...summary, jobId: existJob?._id });
            case 'event':
              return JobEventModel.create({ ...summary, jobId: existJob?._id });
            case 'publishing':
              return JobPublishModel.create({ ...summary, jobId: existJob?._id });
            case 'travel':
              return JobTravelModel.create({ ...summary, jobId: existJob?._id });
            case 'podcast':
            case 'radio':
            case 'webSeries':
            case 'tv':
              return JobMediaModel.create({ ...summary, jobId: existJob?._id });
            default:
              return null;
          }
        }));
      }
      // await this.createCalendarEvent(req, res, next);

      const emailData = {
        jobTitle: existJob?.jobName,
        startDate: new Date(existJob?.startDate).toLocaleDateString("en-US"),
        endDate: new Date(existJob?.endDate).toLocaleDateString("en-US"),
        jobDesc: ""
      };
      const toEmail = existJob?.talent?.email || existJob?.contactDetails?.email;
      await sendEmail({
        filename: 'UpdateJob.ejs', // Ensure the correct file extension
        data: emailData,
        subject: "Update Job Notification",
        toEmail: toEmail,
      });
      return res.json({ status: 200, success: true, data: existJob, message: "Job updated successfully." });
    } else {
      return res.status(404).json({ status: 404, success: false, message: "Job doesn't exist." });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports.updateJobStatus = async (req, res, next) => {
  try {
    const existJob = await JobModel.findById(req.params.id);
    if (existJob) {
      await existJob.updateOne({ jobStatus: req.body.jobStatus });
      const toEmail = existJob?.talent?.email || existJob?.contactDetails?.email;
      const emailData = {
        jobTitle: existJob?.jobName,
        startDate: new Date(existJob?.startDate).toLocaleDateString("en-US"),
        endDate: new Date(existJob?.endDate).toLocaleDateString("en-US"),
        jobDesc: ""
      }

      switch (req.body.jobStatus) {
        case 4: // Approved
          await sendEmail({
            filename: 'ApprovedJob.ejs',
            data: emailData,
            subject: "Approved Job Notification",
            toEmail: toEmail,
          });
          break;
        case 5: // Invoice Request
          await sendEmail({
            filename: 'InvoiceRequest.ejs',
            data: emailData,
            subject: "Invoice Request Notification",
            toEmail: toEmail,
          });
          break;
        case 6: // Invoiced
          await sendEmail({
            filename: 'JobHasBeenInvoiced.ejs',
            data: emailData,
            subject: "Job Has Been Invoiced Notification",
            toEmail: toEmail,
          });
          break;
        case 7: // Paid
          await sendEmail({
            filename: 'JobHasBeenPaid.ejs',
            data: emailData,
            subject: "Job Has Been Paid Notification",
            toEmail: toEmail,
          });
        case 8: // Completed
          await this.moveToCompletedFolde();
        default:
          break;
      }

      return res.json({ status: 200, success: true, message: "Status updated successfully." });
    } else {
      return res.status(404).json({ status: 404, success: false, message: "Job doesn't exist." });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports.moveToCompletedFolder = async (req, res) => {
  try {
    const existJob = await JobModel.findById(req.params.id);
    if (existJob) {
      const talentName = existJob?.talent?.talentName; // Get talent name from request body
      const sourceFolder = `${talentName}/NewJobs/NewJob/`;
      const destinationFolder = `${talentName}/CompletedJobs/CompletedJob`;
      const [files] = await bucket.getFiles({ prefix: sourceFolder }); // List files in the source folder
      if (files.length === 0) {
        return res.json({
          status: 404,
          message: "No files found in the folder.",
        });
      }
      const movePromises = files.map(async (file) => { // Move each file
        const newFileName = file.name.replace(sourceFolder, destinationFolder);
        const newFile = bucket.file(newFileName);
        await file.copy(newFile);  // Copy the file to the new location
        await file.delete(); // Delete the original file
        return {
          oldFile: file.name,
          newFile: newFileName,
        };
      });
      const movedFiles = await Promise.all(movePromises);

      const uploadFiles = existJob?.uploadedFiles;
      const completedUploadFiles = {
        contractFile: uploadFiles?.contractFile?.replace("NewJobs/NewJob", "CompletedJobs/CompletedJob") || "",
        briefFile: uploadFiles?.briefFile?.replace("NewJobs/NewJob", "CompletedJobs/CompletedJob") || "",
        supportingFile: uploadFiles?.supportingFile?.replace("NewJobs/NewJob", "CompletedJobs/CompletedJob") || ""
      }
      await existJob.updateOne({
        uploadedFiles: completedUploadFiles
      });
      return res.json({
        status: 200,
        message: "Files moved successfully.",
        data: movedFiles,
      });
    }
  } catch (err) {
    console.error("Move error:", err);
    return res.json({
      status: 500,
      message: `Could not move the files. ${err.message}`,
    });
  }
};

module.exports.createCalendarEvent = async (req, res, next) => {
  try {
    const jobSummaryList = req.body.jobSummaryList;
    if (!oauth2Client.credentials || !oauth2Client.credentials.access_token) {
      return res.json({ success: false, status: 401, redirectUrl: '/auth' });
    } else {
      if (jobSummaryList?.length > 0) {
        await Promise.all(jobSummaryList.map(async summary => {
          const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
          if (summary.type === "social" || summary.type === "event") {
            const conceptDueDateObj = new Date(summary.conceptDueDate);
            const startDateTime = new Date(conceptDueDateObj.toISOString().slice(0, 10) + 'T' + summary.eventStartTime + ':00');
            const endDateTime = new Date(conceptDueDateObj.toISOString().slice(0, 10) + 'T' + summary.eventEndTime + ':00');

            const start = summary.type === "social" ? new Date(summary?.conceptDueDate) : startDateTime.toISOString();
            const end = summary.type === "social" ? new Date(summary?.contentDueDate) : endDateTime.toISOString();
            const event = {
              summary: summary.jobTitle,
              location: 'https://atarimaewf.com',
              description: summary.deleverables,
              start: {
                dateTime: start
              },
              end: {
                dateTime: end
              },
              colorId: 1,
              attendees: [
                { email: newJob?.contactDetails?.email },
              ]

            };
            const result = await calendar.events.insert({
              calendarId: 'primary',
              auth: oauth2Client,
              conferenceDataVersion: 1,
              sendUpdates: 'all',
              resource: event
            });
          }
        }));
        return res.json({ status: 200, success: true, message: "Calendar Event Created Successfully." });
      }
    }
  } catch (err) {
    return res.json({ success: false, status: 401, redirectUrl: '/auth' });
  }
}