const fs = require('fs');
const router = require("express").Router();
const multer = require('multer');
const { Storage } = require("@google-cloud/storage");
const { AddJob, UpdateJob, getJobById, getJobList, updateJobStatus, uploadFile } = require('../Controller/JobController');

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const storageClient = new Storage({
  keyFilename: "/talent",
  projectId: 'talentAgency'
});

const bucketName = "talent";

router.get("/list", getJobList);

router.route('/uploadFile').post(upload.single('briefFile'), uploadFile);

router.route('/add').post(AddJob);
router.route('/update/:id').post(UpdateJob);

router.get("/:id", getJobById);
router.route("/updateJobStatus/:id").post(updateJobStatus);

module.exports = router;