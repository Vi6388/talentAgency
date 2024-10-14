const fs = require('fs');
const router = require("express").Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');
const { AddJobEstimate, UpdateJobEstimate, getJobEstimateById, getJobEstimateList, makeJobLive } = require('../Controller/EstimateController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '../uploads/estimate/');
        fs.access(dir, (error) => {
            if (error) {
                fs.mkdir(dir, { recursive: true }, (err) => {
                    if (err) {
                        return cb(err, dir);
                    }
                    cb(null, dir);
                });
            } else {
                cb(null, dir);
            }
        });
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });

router.get("/list", getJobEstimateList);

router.route('/add').post(upload.single('uploadFile'), AddJobEstimate);
router.route('/update/:id').post(upload.single('uploadFile'), UpdateJobEstimate);

router.get("/:id", getJobEstimateById);
router.post("/makeJobLive/:id", makeJobLive);

module.exports = router;