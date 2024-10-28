const router = require("express").Router();
const { AddJob, UpdateJob, getJobById, getJobList, updateJobStatus, uploadFile } = require('../Controller/JobController');

const multer = require('multer');
const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit to 2MB
});

router.get("/list", getJobList);

router.post('/uploadFile', upload.fields([{ name: 'contractFile' }, { name: 'briefFile' }, { name: 'supportingFile' }]), uploadFile);

router.route('/add').post(AddJob);
router.route('/update/:id').post(UpdateJob);

router.get("/:id", getJobById);
router.route("/updateJobStatus/:id").post(updateJobStatus);

module.exports = router;