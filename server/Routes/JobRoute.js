const fs = require('fs');
const router = require("express").Router();
const multer = require('multer');
const { Storage } = require("@google-cloud/storage");
const { AddJob, UpdateJob, getJobById, getJobList, updateJobStatus } = require('../Controller/JobController');

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const storageClient = new Storage({
  keyFilename: "/talent",
  projectId: 'talentAgency'
});

const bucketName = "talent";

router.get("/list", getJobList);

router.post("/uploadFile", upload.single("uploadFile"), async (req, res) => {
  console.log("uploadFile backend");
  try {
    if(!req.file) {
      return res.json({ status: 201, success: true, message: "No File Uploaded." });
    }
    const fileBuffer = req.file.buffer;
    const originalname = req.file.originalname;

    const bucket = storageClient.bucket(bucketName);
    const file = bucket.file(originalname);

    await file.save(fileBuffer);
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${originalname}`;
    console.log("image saved!", publicUrl);
    return res.json({ status: 200, success: true, profile_url: publicUrl });
  } catch (err) {
    console.log("Error uploading to Google Cloud Storage:", err);
    res.json({ status: 500, success: false, message: "Internal Server Error." })
  }
});

router.route('/add').post(AddJob);
router.route('/update/:id').post(UpdateJob);

router.get("/:id", getJobById);
router.route("/updateJobStatus/:id").post(updateJobStatus);

module.exports = router;