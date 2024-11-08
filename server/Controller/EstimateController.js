const JobEventModel = require("../Model/Job.Event.model");
const JobMediaModel = require("../Model/Job.Media.model");
const JobModel = require("../Model/Job.model");
const JobFinance = require("../Model/Job.Finance.model");
const JobPublishModel = require("../Model/Job.Publish.model");
const JobSocialModel = require("../Model/Job.Social.model");
const JobTravelModel = require("../Model/Job.Travel.model");

module.exports.getJobEstimateList = async (req, res, next) => {
  try {
    const jobList = await JobModel.find({ estimateStatus: true, isLive: false });
    return res.json({ status: 200, message: "Get Job list", success: true, data: jobList });
  } catch (error) {
    console.error(error);
  }
}

module.exports.AddJobEstimate = async (req, res, next) => {
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
        manager: detailData?.manager
      },
      labelColor: detailData?.labelColor,
      startDate: detailData?.startDate,
      endDate: detailData?.endDate,
      estimateStatus: true,
      isLive: false,
      jobStatus: 1
    });

    // Create Invoice List
    const jobInvoiceList = req.body.invoiceList;
    if (jobInvoiceList?.length > 0) {
      jobInvoiceList?.forEach(async (invoice) => {
        return await JobFinance.create({
          ...invoice,
          jobId: newJob?._id
        });
      });
    }

    // Create Job Summary List
    const jobSummaryList = req.body.jobSummaryList;
    if (jobSummaryList?.length > 0) {
      jobSummaryList?.forEach(async (summary) => {
        if (summary.type === 'social') {
          return await JobSocialModel.create({
            ...summary,
            jobId: newJob?._id
          });
        }
        if (summary.type === 'event') {
          return await JobEventModel.create({
            ...summary,
            jobId: newJob?._id,
          });
        }
        if (summary.type === 'publishing') {
          return await JobPublishModel.create({
            ...summary,
            jobId: newJob?._id
          });
        }
        if (summary.type === 'travel') {
          return await JobTravelModel.create({
            ...summary,
            jobId: newJob?._id
          });
        }
        if (summary.type === 'podcast' || summary.type === 'radio' || summary.type === 'webSeries' || summary.type === 'tv') {
          return await JobMediaModel.create({
            ...summary,
            jobId: newJob?._id
          });
        }
      })
    }
    return res.json({ status: 200, message: "Job added successfully", success: true, data: newJob });
  } catch (error) {
    console.error(error);
  }
};

module.exports.getJobEstimateById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.json({ success: false, status: 201, message: "Job Id is required." });
    } else {
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
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports.UpdateJobEstimate = async (req, res, next) => {
  try {
    const detailData = req.body;
    // Update Job Model
    const existJob = await JobModel.findById(req.params.id);
    if (existJob) {
      const updatedJob = await existJob.save({
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
          talentName: detailData?.talent?.talentName,
          email: detailData?.talent?.email,
          manager: detailData?.manager
        },
        labelColor: detailData?.labelColor,
        startDate: detailData?.startDate,
        endDate: detailData?.endDate,
      });

      // Dalete Exist Invoice List By jobEstimate id and Create new Invoice List
      const existInvoiceList = await JobFinance.find({ jobId: req.params.id });
      if (existInvoiceList?.length > 0) {
        await JobFinance.deleteMany({ jobId: req.params.id });
      }
      const jobInvoiceList = req.body.invoiceList;
      if (jobInvoiceList?.length > 0) {
        jobInvoiceList?.forEach(async (invoice) => {
          return await JobFinance.create({
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
        jobSummaryList?.forEach(async (summary) => {
          if (summary.type === 'social') {
            return await JobSocialModel.create({
              ...summary,
              jobId: existJob?._id
            });
          }
          if (summary.type === 'event') {
            return await JobEventModel.create({
              ...summary,
              jobId: existJob?._id,
            });
          }
          if (summary.type === 'publishing') {
            return await JobPublishModel.create({
              ...summary,
              jobId: existJob?._id
            });
          }
          if (summary.type === 'travel') {
            return await JobTravelModel.create({
              ...summary,
              jobId: existJob?._id
            });
          }
          if (summary.type === 'podcast' || summary.type === 'radio' || summary.type === 'webSeries' || summary.type === 'tv') {
            return await JobMediaModel.create({
              ...summary,
              jobId: existJob?._id
            });
          }
        })
      }
      return res.json({ status: 200, success: true, data: updatedJob, message: "Job updated successfully." });
    } else {
      return res.json({ status: 201, success: true, message: "Job Estimate doesn't exist." });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.makeJobLive = async (req, res, next) => {
  try {
    const job = await JobModel.findByIdAndUpdate(
      req.params.id,
      {
        estimateStatus: true,
        isLive: true,
      },
      { new: true }
    );

    if (job) {
      return res.json({ status: 200, success: true, data: job, message: "Job updated successfully." });
    } else {
      return res.json({ status: 200, success: true, message: "Job Estimate doesn't exist." });
    }
  } catch (err) {
    next(err);
  }
}
