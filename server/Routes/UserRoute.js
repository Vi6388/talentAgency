const { UserAdd, UserUpdate, getUserList, getUserById } = require("../Controller/UserController");
const fs = require('fs');
const router = require("express").Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '../uploads/user/');
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

router.get("/list", getUserList);

router.route('/add').post(upload.single('avatar'), UserAdd);
router.route('/update/:id').post(upload.single('avatar'), UserUpdate);

router.get("/:id", getUserById);

module.exports = router;