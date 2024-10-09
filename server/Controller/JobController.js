const JobEventModel = require("../Model/Job.Event.model");
const JobFinanceModel = require("../Model/Job.Finance.model");
const JobMediaModel = require("../Model/Job.Media.model");
const JobModel = require("../Model/Job.model");
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
    const url = req.protocol + '://' + req.get("host");
    const { uploadedFiles } = req.body.uploadedFiles;
    const newJobFinance = JobFinanceModel.create(req.body.jobFinance);
    const newJobSocial = JobSocialModel.create(req.body.jobSocial);
    const newJobEvent = JobEventModel.create(req.body.jobEvent);
    const newJobMedia = JobMediaModel.create(req.body.jobMedia);
    const newJobPublish = JobPublishModel.create(req.body.jobPublish);
    const newJobTravel = JobTravelModel.create(req.body.jobTravel);
    const jobData = {
      contactDetails: req.body.contactDetails,
      companyDetails: req.body.companyDetails,
      jobName: req.body.jobName,
      talent: req.body.talent,
      ambassadorship: req.body.ambassadorship,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      uploadedFiles: uploadedFiles,
      jobFinance: newJobFinance,
      jobSocial: newJobSocial,
      jobEvent: newJobEvent,
      jobMedia: newJobMedia,
      jobPublish: newJobPublish,
      jobTravel: newJobTravel
    }
    const newJob = JobModel.create(jobData);
    // const user = JobModel.create({
    //   ...req.body,
    //   avatar: url + '/uploads/user/' + req.file.filename
    // });
    return res.json({ status: 200, message: "Job added successfully", success: true, data: newJob });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.getJobById = async (req, res, next) => {
  try {
    const job = await JobModel.findById(req.params.id);
    if (job) {
      return res.json({ success: true, status: 200, message: "Job is exist", data: job });
    } else {
      return res.json({ success: true, status: 201, message: "Job not found" });
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports.UpdateJob = async (req, res, next) => {
  try {
    const job = await JobModel.findById(req.params.id);
    // const url = req.protocol + '://' + req.get("host");
    // var data = req.body;
    // if(req.file !== undefined) {
    //   data.avatar = url + '/uploads/user/' + req.file.filename;
    // }
    // if(req.body.avatar === 'undefined') {
    //   data.avatar = user.avatar;
    // }
    await JobModel.findById(req.params.id).updateMany(data);
    res.json({ status: 200, success: true, data: job, message: "Job updated successfully." });
  } catch (err) {
    next(err);
  }
};
