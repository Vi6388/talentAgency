const JobEventModel = require("../Model/Job.Event.model");
const JobMediaModel = require("../Model/Job.Media.model");
const JobModel = require("../Model/Job.model");
const JobFinance = require("../Model/Job.Finance.model");
const JobPublishModel = require("../Model/Job.Publish.model");
const JobSocialModel = require("../Model/Job.Social.model");
const JobTravelModel = require("../Model/Job.Travel.model");
const { sendEmail } = require("../util/SendMail");
const dotenv = require("dotenv");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");

dotenv.config();

const bucketName = "atarimaeagency";
const storage = new Storage({ keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS });
const path = require('path');

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
    const { sort, order } = req.params;
    let sortField = sort;
    if (sort === 'talent') {
      sortField = 'talent.talentName';
    }
    if (sort === 'client') {
      sortField = 'contactDetails.firstname';
    }
    const sortOrder = order === 'asc' ? 1 : -1;

    const jobList = await JobModel.find({ estimateStatus: false, isLive: true }).sort({ [sortField]: sortOrder });
    return res.json({ status: 200, message: "Get Job list", success: true, data: jobList });
  } catch (error) {
    console.error(error);
    return res.json({ status: 500, success: false, message: "Error fetching job list", error: error.message });
  }
}

module.exports.AddJob = async (req, res, next) => {
  try {
    const detailData = req.body.details;
    // Create Job Model
    const newJob = await JobModel.create({
      contactDetails: {
        firstname: detailData?.firstname || "",
        surname: detailData?.surname || "",
        email: detailData?.email || "",
        position: detailData?.position || "",
        phoneNumber: detailData?.phoneNumber || "",
      },
      companyDetails: {
        companyName: detailData?.companyName || "",
        abn: detailData?.abn || "",
        postalAddress: detailData?.postalAddress || "",
        suburb: detailData?.suburb || "",
        state: detailData?.state || "",
        postcode: detailData?.postcode || "",
      },
      jobName: detailData?.jobName || "",
      talent: {
        talentName: detailData?.talentName || "",
        email: detailData?.talentEmail || "",
        phoneNumber: detailData?.talentPhoneNumber || "",
        manager: detailData?.manager || "",
      },
      supplierRequired: detailData?.supplierRequired || false,
      labelColor: detailData?.labelColor || "",
      startDate: detailData?.startDate || "",
      endDate: detailData?.endDate || "",
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
          gst: invoice.gst || null,
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
            return JobTravelModel.create({ ...summary, jobId: newJob?._id, clientPaying: summary?.clientPaying || null });
          case 'podcast':
          case 'radio':
          case 'webSeries':
          case 'tv':
          case 'Media':
            return JobMediaModel.create({ ...summary, jobId: newJob?._id });
          default:
            return null;
        }
      }));
    }

    const updatedSummaryList = [];
    const socialList = await JobSocialModel.find({ jobId: newJob?._id });
    socialList?.forEach(item => updatedSummaryList.push({ ...item?._doc, type: "social" }));
    const eventList = await JobEventModel.find({ jobId: newJob?._id });
    eventList?.forEach(item => updatedSummaryList.push({ ...item?._doc, type: "event" }));
    const publishList = await JobPublishModel.find({ jobId: newJob?._id });
    publishList?.forEach(item => updatedSummaryList.push({ ...item?._doc, type: "publishing" }));
    const mediaList = await JobMediaModel.find({ jobId: newJob?._id });
    mediaList?.forEach(item => updatedSummaryList.push({ ...item?._doc, type: "media" }));
    const travelList = await JobTravelModel.find({ jobId: newJob?._id });
    travelList?.forEach(item => updatedSummaryList.push({ ...item?._doc, type: "travel" }));

    const emailData = {
      job: newJob,
      summaryList: updatedSummaryList,
      type: "job"
    };
    const toEmail = newJob?.talent?.email || detailData?.talentEmail;
    const subject = "New Job - " + newJob?.jobName + " " + convertDateFormat(newJob?.createdAt);
    await sendEmail({
      filename: 'UpdateJob.ejs', // Ensure the correct file extension
      data: emailData,
      subject: subject,
      toEmail: toEmail,
    });
    return res.json({ status: 200, message: "Job added successfully", success: true, data: newJob });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const convertDateFormat = (date) => {
  if (date !== "Invalid Date" && new Date(date) !== "Invalid Date" && date !== "" && date !== undefined) {
    const day = new Date(date).getDate();
    const month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();
    return day + "/" + month + "/" + year;
  }
}

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
      return res.json({ status: 404, success: false, status: 404, message: "Job not found" });
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
          firstname: detailData?.firstname || existJob?.contactDetails?.firstname || "",
          surname: detailData?.surname || existJob?.contactDetails?.surname || "",
          email: detailData?.email || existJob?.contactDetails?.email || "",
          position: detailData?.position || existJob?.contactDetails?.position || "",
          phoneNumber: detailData?.phoneNumber || existJob?.contactDetails?.phoneNumber || "",
        },
        companyDetails: {
          companyName: detailData?.companyName || existJob?.companyDetails?.companyName || "",
          abn: detailData?.abn || existJob?.companyDetails?.abn || "",
          postalAddress: detailData?.postalAddress || existJob?.companyDetails?.postalAddress || "",
          suburb: detailData?.suburb || existJob?.companyDetails?.suburb || "",
          state: detailData?.state || existJob?.companyDetails?.suburb || "",
          postcode: detailData?.postcode || existJob?.companyDetails?.postcode || "",
        },
        jobName: detailData?.jobName || existJob?.jobName || "",
        talent: {
          talentName: detailData?.talentName || existJob?.talent?.talentName,
          email: detailData?.talentEmail || existJob?.talent?.email,
          manager: detailData?.manager || existJob?.talent?.manager,
          phonenumber: detailData?.talentPhoneNumber || existJob?.talent?.phoneNumber,
        },
        supplierRequired: detailData?.supplierRequired || existJob?.supplierRequired || false,
        labelColor: detailData?.labelColor || existJob?.labelColor || "",
        startDate: detailData?.startDate || existJob?.startDate || "",
        endDate: detailData?.endDate || existJob?.endDate || "",
        uploadedFiles: {
          contractFile: detailData?.uploadedFiles?.contractFile || existJob?.uploadedFiles?.contractFile || "",
          briefFile: detailData?.uploadedFiles?.briefFile || existJob?.uploadedFiles?.briefFile || "",
          supportingFile: detailData?.uploadedFiles?.supportingFile || existJob?.uploadedFiles?.supportingFile || "",
        },
        jobStatus: detailData?.jobStatus || existJob?.jobStatus || 0
      });

      await JobFinance.deleteMany({ jobId: req.params.id }); // Delete existing invoices
      const jobInvoiceList = req.body.invoiceList;
      if (jobInvoiceList?.length > 0) {
        await Promise.all(jobInvoiceList.map(invoice => {
          return JobFinance.create({
            ...invoice,
            gst: invoice.gst || null,
            jobId: existJob?._id
          });
        }));
      }

      const jobSocialCount = await JobSocialModel.countDocuments({ jobId: existJob._id });
      const jobEventCount = await JobEventModel.countDocuments({ jobId: existJob._id });
      const jobPublishCount = await JobPublishModel.countDocuments({ jobId: existJob._id });
      const jobTravelCount = await JobTravelModel.countDocuments({ jobId: existJob._id });
      const jobMediaCount = await JobMediaModel.countDocuments({ jobId: existJob._id });
      const deletePromises = [];

      if (jobSocialCount > 0) {
        deletePromises.push(JobSocialModel.deleteMany({ jobId: existJob._id }));
      }
      if (jobEventCount > 0) {
        deletePromises.push(JobEventModel.deleteMany({ jobId: existJob._id }));
      }
      if (jobPublishCount > 0) {
        deletePromises.push(JobPublishModel.deleteMany({ jobId: existJob._id }));
      }
      if (jobTravelCount > 0) {
        deletePromises.push(JobTravelModel.deleteMany({ jobId: existJob._id }));
      }
      if (jobMediaCount > 0) {
        deletePromises.push(JobMediaModel.deleteMany({ jobId: existJob._id }));
      }
      await Promise.all(deletePromises);

      const jobSummaryList = req.body.jobSummaryList;
      if (jobSummaryList?.length > 0) {
        await Promise.all(jobSummaryList.map(async (summary) => {
          delete summary._id;
          switch (summary.type) {
            case 'social':
              return await JobSocialModel.create({ ...summary, jobId: existJob?._id });
            case 'event':
              return await JobEventModel.create({ ...summary, jobId: existJob?._id });
            case 'publishing':
              return await JobPublishModel.create({ ...summary, jobId: existJob?._id });
            case 'travel':
              return await JobTravelModel.create({ ...summary, jobId: existJob?._id, clientPaying: summary?.clientPaying || null });
            case 'podcast':
            case 'radio':
            case 'webSeries':
            case 'tv':
            case 'Media':
              return await JobMediaModel.create({ ...summary, jobId: existJob?._id });
            default:
              return null;
          }
        }));
      }
      const updatedSummaryList = [];
      const socialList = await JobSocialModel.find({ jobId: existJob?._id });
      socialList?.forEach(item => updatedSummaryList.push({ ...item?._doc, type: "social" }));
      const eventList = await JobEventModel.find({ jobId: existJob?._id });
      eventList?.forEach(item => updatedSummaryList.push({ ...item?._doc, type: "event" }));
      const publishList = await JobPublishModel.find({ jobId: existJob?._id });
      publishList?.forEach(item => updatedSummaryList.push({ ...item?._doc, type: "publishing" }));
      const mediaList = await JobMediaModel.find({ jobId: existJob?._id });
      mediaList?.forEach(item => updatedSummaryList.push({ ...item?._doc, type: "media" }));
      const travelList = await JobTravelModel.find({ jobId: existJob?._id });
      travelList?.forEach(item => updatedSummaryList.push({ ...item?._doc, type: "travel" }));

      const emailData = {
        job: existJob,
        summaryList: updatedSummaryList,
        type: "job"
      };
      const toEmail = existJob?.talent?.email || detailData?.talentEmail;
      const subject = "Job Update - " + existJob?.jobName + " " + convertDateFormat(existJob?.createdAt);
      await sendEmail({
        filename: 'UpdateJob.ejs', // Ensure the correct file extension
        data: emailData,
        subject: subject,
        toEmail: toEmail,
      });

      const updateJob = await JobModel.findById(req.params.id);
      return res.json({ status: 200, success: true, data: updateJob, message: "Job updated successfully." });
    } else {
      return res.json({ status: 404, success: false, message: "Job doesn't exist." });
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
      const toEmail = existJob?.talent?.email;
      const emailData = {
        job: existJob,
        type: "other"
      };

      switch (req.body.jobStatus) {
        case 5: // Approved
          await sendEmail({
            filename: 'ApprovedJob.ejs',
            data: emailData,
            subject: "Approved - " + existJob?.jobName + " " + convertDateFormat(newJob?.createdAt),
            toEmail: toEmail,
          });
          break;
        case 6: // Invoice Request
          const invoice = await JobFinance.findOne({ jobId: req.params.id });
          const data = {
            talent: {
              name: existJob?.talent?.talentName
            },
            companyName: existJob?.companyDetails?.companyName,
            abn: "",
            companyAddress: existJob?.companyDetails?.companyAddress,
            contactDetails: {
              name: existJob?.contactDetails?.firstname + " " + existJob?.contactDetails?.surname,
              email: existJob?.contactDetails?.email,
            },
            gst: invoice?.gst,
            asf: invoice?.asf,
            commission: invoice?.commission,
            paymentTerms: invoice?.paymentTerms + " days"
          };
          await sendEmail({
            filename: 'InvoiceRequest.ejs',
            data: data,
            subject: "PLEASE SETUP SUPPLIER",
            toEmail: toEmail,
          });
          break;
        case 7: // Invoiced
          await sendEmail({
            filename: 'JobHasBeenInvoiced.ejs',
            data: emailData,
            subject: "JOB HAS BEEN INVOICED",
            toEmail: toEmail,
          });
          break;
        case 8: // Paid
          await sendEmail({
            filename: 'JobHasBeenPaid.ejs',
            data: emailData,
            subject: "JOB HAS BEEN PAID",
            toEmail: toEmail,
          });
        case 9: // Completed
          await this.moveToCompletedFolder(req, res);
        default:
          break;
      }

      return res.json({ status: 200, success: true, message: "Status updated successfully." });
    } else {
      return res.json({ status: 404, success: false, message: "Job doesn't exist." });
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
      const destinationFolder = `${talentName}/CompletedJobs/CompletedJob/`;
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
        contractFile: uploadFiles?.contractFile?.replace("NewJobs/NewJob/", "CompletedJobs/CompletedJob/") || "",
        briefFile: uploadFiles?.briefFile?.replace("NewJobs/NewJob/", "CompletedJobs/CompletedJob/") || "",
        supportingFile: uploadFiles?.supportingFile?.replace("NewJobs/NewJob/", "CompletedJobs/CompletedJob/") || ""
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

module.exports.getCalendarList = async (req, res) => {
  try {
    const jobList = await JobModel.find({ estimateStatus: false, isLive: true });
    let list = [];

    for (const job of jobList) {
      let eventList = [];

      const jobEventList = await JobEventModel.find({ jobId: job._id });
      jobEventList.forEach((item) => eventList.push({ ...item?._doc, type: "event", job: job }));

      const jobSocialList = await JobSocialModel.find({ jobId: job._id });
      jobSocialList.forEach((item) => eventList.push({ ...item?._doc, type: "social", job: job }));

      const jobMediaList = await JobMediaModel.find({ jobId: job._id });
      jobMediaList.forEach((item) => eventList.push({ ...item?._doc, job: job }));

      const jobPublishList = await JobPublishModel.find({ jobId: job._id });
      jobPublishList.forEach((item) => eventList.push({ ...item?._doc, type: "publishing", job: job }));

      const jobTravelList = await JobTravelModel.find({ jobId: job._id });
      jobTravelList.forEach((item) => eventList.push({ ...item?._doc, type: "travel", job: job }))

      const data = {
        job: job,
        talent: job.talent,
        eventList: eventList
      };

      list.push(data);
    }

    return res.json({ status: 200, success: true, list });
  } catch (err) {
    console.error("Error in GetCalendarList: ", err);
    return res.json({ status: 500, success: false, message: "An error occurred while listing events." });
  }
}