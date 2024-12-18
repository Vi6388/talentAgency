const router = require("express").Router();
const passport = require('passport');
const { AddJob, UpdateJob, getJobById, getJobList, updateJobStatus, uploadFile, getCalendarList, downloadICS } = require('../Controller/JobController');

const multer = require('multer');
const upload = multer({
  limits: { fileSize: 100 * 1024 * 1024 }, // Limit to 100MB
});

router.get("/list/:sort/:order", getJobList);

router.post('/uploadFile', upload.fields([{ name: 'contractFile' }, { name: 'briefFile' }, { name: 'supportingFile' }]), uploadFile);

router.route('/add').post(AddJob);
router.route('/update/:id').post(UpdateJob);

router.get("/getById/:id", getJobById);
router.route("/updateJobStatus/:id").post(updateJobStatus);
router.get("/getCalendarEventList", getCalendarList);

module.exports = router;