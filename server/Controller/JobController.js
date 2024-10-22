const JobEventModel = require("../Model/Job.Event.model");
const JobMediaModel = require("../Model/Job.Media.model");
const JobModel = require("../Model/Job.model");
const JobFinance = require("../Model/Job.Finance.model");
const JobPublishModel = require("../Model/Job.Publish.model");
const JobSocialModel = require("../Model/Job.Social.model");
const JobTravelModel = require("../Model/Job.Travel.model");
const { sendEmail } = require("../util/SendMail");
const dotenv = require("dotenv");
const { Storage } = require("@google-cloud/storage");
const { google } = require('googleapis');
const multer = require("multer");
const processFile = require("../Middlewares/UploadMiddleware");
const { format } = require("util");

dotenv.config();

const key = require("../public/verdant-oven-438907-b1-6b1cb6f3f747.json");

const BUCKET_SCOPES = ['https://www.googleapis.com/auth/devstorage.read_write'];
const GOOGLE_PRIVATE_KEY = key.private_key;
const GOOGLE_CLIENT_EMAIL = key.client_email;

const jwtBucketClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  BUCKET_SCOPES
);

// Google Cloud Storage Setup
const storage = new Storage({
  key: jwtBucketClient,
  projectId: key.project_id
});

const bucketName = "atarimaeagency";

const oauth2Client = new google.auth.OAuth2
  (
    process.env.CALENDAR_CLIENT_ID,
    process.env.CALENDAR_CLIENT_SECRET,
    process.env.CALENDAR_REDIRECT_URL
  );

module.exports.uploadFile = async (req, res, next) => {
  try {
    await processFile(req, res);

    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      res.status(500).send({ message: err.message });
    });

    blobStream.on("finish", async (data) => {
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );

      try {
        await bucket.file(req.file.originalname).makePublic();
      } catch {
        return res.status(500).send({
          message:
            `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
          url: publicUrl,
        });
      }

      return res.status(200).send({
        message: "Uploaded the file successfully: " + req.file.originalname,
        url: publicUrl,
      });
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
}

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
    console.log(detailData)
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
        manager: detailData?.manager
      },
      labelColor: detailData?.labelColor,
      startDate: new Date(detailData?.startDate),
      endDate: new Date(detailData?.endDate),
      estimateStatus: false,
      isLive: true,
      jobStatus: 1
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
    await this.createCalendarEvent(req);

    const emailData = {
      jobTitle: newJob?.jobName,
      startDate: new Date(newJob?.startDate).toLocaleDateString("en-US"),
      endDate: new Date(newJob?.endDate).toLocaleDateString("en-US"),
      jobDesc: ""
    };
    // await sendEmail({
    //   filename: 'UpdateJob.ejs',
    //   data: emailData,
    //   subject: "Update Job Notification",
    //   toEmail: newJob?.contactDetails?.email,
    // });
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
          manager: detailData?.manager
        },
        labelColor: detailData?.labelColor,
        startDate: new Date(detailData?.startDate),
        endDate: new Date(detailData?.endDate),
        uploadedFiles: {
          contactFile: detailData?.contactFile || existJob?.uploadedFiles?.contactFile,
          briefFile: detailData?.briefFile || existJob?.uploadedFiles?.briefFile,
          supportingFile: detailData?.supportingFile || existJob?.uploadedFiles?.supportingFile,
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
      return res.json({ status: 200, success: true, message: "Status updated successfully." });
    } else {
      return res.status(404).json({ status: 404, success: false, message: "Job doesn't exist." });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports.createCalendarEvent = async (req, res, next) => {
  const jobSummaryList = req.body.jobSummaryList;
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
          location: 'Atarimae',
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