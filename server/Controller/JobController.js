const JobEventModel = require("../Model/Job.Event.model");
const JobMediaModel = require("../Model/Job.Media.model");
const JobModel = require("../Model/Job.model");
const JobFinance = require("../Model/Job.Finance.model");
const JobPublishModel = require("../Model/Job.Publish.model");
const JobSocialModel = require("../Model/Job.Social.model");
const JobTravelModel = require("../Model/Job.Travel.model");

module.exports.getJobList = async (req, res, next) => {
  try {
    const jobList = await JobModel.find();
    return res.json({ status: 200, message: "Get Job list", success: true, data: jobList });
  } catch (error) {
    console.error(error);
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
        manager: detailData?.manager
      },
      labelColor: detailData?.labelColor,
      startDate: new Date(detailData?.startDate),
      endDate: new Date(detailData?.endDate),
      uploadedFiles: {
        contactFile: detailData?.contactFile,
        briefFile: detailData?.briefFile,
        supportingFile: detailData?.supportingFile,
      },
    });

    // Create Invoice List
    const jobInvoiceList = req.body.invoiceList;
    if (jobInvoiceList?.length > 0) {
      jobInvoiceList?.forEach(invoice => {
        return JobFinance.create({
          ...invoice,
          jobId: newJob?._id
        });
      });
    }

    // Create Job Summary List
    const jobSummaryList = req.body.jobSummaryList;
    if (jobSummaryList?.length > 0) {
      jobSummaryList?.forEach(summary => {
        if (summary.type === 'social') {
          return JobSocialModel.create({
            ...summary,
            jobId: newJob?._id
          });
        }
        if (summary.type === 'event') {
          return JobEventModel.create({
            ...summary,
            jobId: newJob?._id,
          });
        }
        if (summary.type === 'publishing') {
          return JobPublishModel.create({
            ...summary,
            jobId: newJob?._id
          });
        }
        if (summary.type === 'travel') {
          return JobTravelModel.create({
            ...summary,
            jobId: newJob?._id
          });
        }
        if (summary.type === 'podcast' || summary.type === 'radio' || summary.type === 'webSeries' || summary.type === 'tv') {
          return JobMediaModel.create({
            ...summary,
            jobId: newJob?._id
          });
        }
      })
    }

    const emailData = {
      jobTitle: newJob?.jobName,
      startDate: new Date(newJob?.startDate).toLocaleDateString("en-US"),
      endDate: new Date(newJob?.endDate).toLocaleDateString("en-US"),
      jobDesc: ""
    };
    await sendEmail({
      filename: 'UpdateJob.ejs', // Ensure the correct file extension
      data: emailData,
      subject: "Update Job Notification",
      toEmail: job?.contactDetails?.email,
    });

    return res.json({ status: 200, message: "Job added successfully", success: true, data: newJob });
  } catch (error) {
    console.error(error);
  }
};

module.exports.getJobById = async (req, res, next) => {
  try {
    if (req.params.id !== undefined) {
      const job = await JobModel.findById(req.params.id);
      const invoice = await JobFinance.find({ jobId: req.params.id });
      const social = await JobSocialModel.find({ jobId: req.params.id });
      const event = await JobEventModel.find({ jobId: req.params.id });
      const publishing = await JobPublishModel.find({ jobId: req.params.id });
      const travel = await JobTravelModel.find({ jobId: req.params.id });
      const media = await JobMediaModel.find({ jobId: req.params.id });

      let list = [];
      social?.forEach((item) => {
        list.push({
          ...item?._doc,
          type: "social"
        });
      })
      event?.forEach((item) => {
        list.push({
          ...item?._doc,
          type: "event"
        });
      })
      publishing?.forEach((item) => {
        list.push({
          ...item?._doc,
          type: "publishing"
        });
      })
      travel?.forEach((item) => {
        list.push({
          ...item?._doc,
          type: "travel"
        });
      })
      media?.forEach((item) => {
        list.push(item);
      })

      const data = {
        details: job,
        invoiceList: invoice,
        jobSummaryList: list,
      }

      if (job) {
        return res.json({ success: true, status: 200, message: "Job is exist", data: data });
      } else {
        return res.json({ success: true, status: 201, message: "Job not found" });
      }
    } else {
      return res.json({ success: true, status: 201, message: "Job not found" });
    }

  } catch (error) {
    console.error(error);
  }
}

module.exports.UpdateJob = async (req, res, next) => {
  try {
    const detailData = req.body.details;
    // Update Job Model
    const existJob = await JobModel.findById(req.params.id);
    if (existJob) {
      existJob.updateOne({
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
      });

      // Dalete Exist Invoice List By jobEstimate id and Create new Invoice List
      const existInvoiceList = await JobFinance.find({ jobId: req.params.id });
      if (existInvoiceList?.length > 0) {
        await JobFinance.deleteMany({ jobId: req.params.id });
      }
      const jobInvoiceList = req.body.invoiceList;
      if (jobInvoiceList?.length > 0) {
        jobInvoiceList?.forEach(invoice => {
          return JobFinance.create({
            ...invoice,
            jobId: existJob?._id
          });
        });
      }

      // Delete Job Summary List By jobEstimateId and Create new Job Summary List
      await JobSocialModel.deleteMany({ jobId: req.params.id });
      await JobEventModel.deleteMany({ jobId: req.params.id });
      await JobPublishModel.deleteMany({ jobId: req.params.id });
      await JobTravelModel.deleteMany({ jobId: req.params.id });
      await JobMediaModel.deleteMany({ jobId: req.params.id });

      const jobSummaryList = req.body.jobSummaryList;
      if (jobSummaryList?.length > 0) {
        jobSummaryList?.forEach(summary => {
          if (summary.type === 'social') {
            return JobSocialModel.create({
              ...summary,
              jobId: existJob?._id
            });
          }
          if (summary.type === 'event') {
            return JobEventModel.create({
              ...summary,
              jobId: existJob?._id,
            });
          }
          if (summary.type === 'publishing') {
            return JobPublishModel.create({
              ...summary,
              jobId: existJob?._id
            });
          }
          if (summary.type === 'travel') {
            return JobTravelModel.create({
              ...summary,
              jobId: existJob?._id
            });
          }
          if (summary.type === 'podcast' || summary.type === 'radio' || summary.type === 'webSeries' || summary.type === 'tv') {
            return JobMediaModel.create({
              ...summary,
              jobId: existJob?._id
            });
          }
        })
      }

      const emailData = {
        jobTitle: existJob?.jobName,
        startDate: new Date(existJob?.startDate).toLocaleDateString("en-US"),
        endDate: new Date(existJob?.endDate).toLocaleDateString("en-US"),
        jobDesc: ""
      };
      await sendEmail({
        filename: 'UpdateJob.ejs', // Ensure the correct file extension
        data: emailData,
        subject: "Update Job Notification",
        toEmail: job?.contactDetails?.email,
      });
      return res.json({ status: 200, success: true, data: existJob, message: "Job updated successfully." });
    } else {
      return res.json({ status: 201, success: true, message: "Job Estimate doesn't exist." });
    }
  } catch (err) {
    next(err);
  }
};