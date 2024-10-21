const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { Storage } = require("@google-cloud/storage");
const { google } = require('googleapis');
const multer = require("multer");
const path = require("path");

dotenv.config();

const authRoute = require("./Routes/AuthRoute");
const userRoute = require("./Routes/UserRoute");
const talentRoute = require("./Routes/TalentRoute");
const clientRoute = require("./Routes/ClientRoute");
const estimateRoute = require("./Routes/EstimateRoute");
const jobRoute = require("./Routes/JobRoute");

const key = require("./public/talentagency-9763b37d6a39.json");

const BUCKET_SCOPES = ['https://www.googleapis.com/auth/devstorage.read_write'];
const GOOGLE_PRIVATE_KEY = key.private_key.replace(/\\n/g, '\n'); // Handle line breaks
const GOOGLE_CLIENT_EMAIL = key.client_email;

const app = express();
const { MONGO_URL, PORT } = process.env;

// Connect to MongoDB
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is connected successfully"))
  .catch((err) => console.error(err));

// Middleware
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from the root directory

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/talent", talentRoute);
app.use("/api/client", clientRoute);
app.use("/api/estimate", estimateRoute);
app.use("/api/job", jobRoute);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const jwtBucketClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  BUCKET_SCOPES
);

// Google Cloud Storage Setup
const storageClient = new Storage({
  auth: jwtBucketClient, // Use the JWT client for authentication
  projectId: key.project_id
});

const bucketName = "talent";

app.post("/api/job/uploadFile", upload.single("briefFile"), async (req, res) => {
  console.log("In Image controller backend");
  console.log(req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname;

    const bucket = storageClient.bucket(bucketName);
    const file = bucket.file(originalName);

    await file.save(fileBuffer, {
      metadata: { contentType: req.file.mimetype },
      resumable: false,
    });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${originalName}`;
    return res.json({ success: true, message: "Success", imageUrl: publicUrl });
  } catch (err) {
    console.error("Error uploading to Google Cloud Storage: ", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
});

app.get('/images/:filename', (req, res) => {
  const fileName = req.params.filename;
  const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
  res.redirect(publicUrl); // Redirect to the public URL for the file
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});