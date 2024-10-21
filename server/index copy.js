const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { Storage } = require("@google-cloud/storage");

dotenv.config();

const authRoute = require("./Routes/AuthRoute");
const userRoute = require("./Routes/UserRoute");
const talentRoute = require("./Routes/TalentRoute");
const clientRoute = require("./Routes/ClientRoute");
const estimateRoute = require("./Routes/EstimateRoute");

const { google } = require('googleapis');
const key = require("./public/talentagency-9763b37d6a39.json");
const multer = require("multer");
const path = require("path");

const SCOPES = process.env.SCOPES;
const BUCKET_SCOPES = ['https://www.googleapis.com/auth/devstorage.read_write'];
const GOOGLE_PRIVATE_KEY = key.private_key.replace(/\\n/g, '\n');
const GOOGLE_CLIENT_EMAIL = key.client_email;
const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER;
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  SCOPES
);

const calendar = google.calendar({
  version: 'v3',
  project: GOOGLE_PROJECT_NUMBER,
  auth: jwtClient
});

const oauth2Client = new google.auth.OAuth2
  (
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );

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


// app.get('/', (req, res) => {
//   const url = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: 'https://www.googleapis.com/auth/calendar.readonly'
//   });
//   res.redirect(url);
// });

// app.get('/redirect', (req, res) => {
//   // Extract the code from the query parameter
//   const code = req.query.code;
//   console.log('---------', code)
//   // Exchange the code for tokens
//   oauth2Client.getToken(code, (err, tokens) => {
//     if (err) {
//       // Handle error if token exchange fails
//       console.error('Couldn\'t get token', err);
//       res.send('Error');
//       return;
//     }
//     // Set the credentials for the Google API client
//     oauth2Client.setCredentials(tokens);
//     // Notify the user of a successful login
//     res.send('Successfully logged in');
//   });
// });

// // Route to list all calendars
// app.get('/calendars', (req, res) => {
//   const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
//   calendar.calendarList.list({}, (err, response) => {
//     if (err) {
//       console.error('Error fetching calendars', err);
//       res.end('Error!');
//       return;
//     }
//     const calendars = response.data.items;
//     res.json(calendars);
//   });
// });

// // Route to list events from a specified calendar
// app.get('/events', (req, res) => {
//   // Get the calendar ID from the query string, default to 'primary'
//   const calendarId = req.query.calendar ?? 'primary';
//   // Create a Google Calendar API client
//   const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
//   // List events from the specified calendar
//   calendar.events.list({
//     calendarId,
//     timeMin: (new Date()).toISOString(),
//     maxResults: 15,
//     singleEvents: true,
//     orderBy: 'startTime'
//   }, (err, response) => {
//     if (err) {
//       // Handle error if the API request fails
//       console.error('Can\'t fetch events');
//       res.send('Error');
//       return;
//     }
//     // Send the list of events as JSON
//     const events = response.data.items;
//     res.json(events);
//   });
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const app = express();
// const port = 4000;
// app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.urlencoded({ extended: false }));

// const data = {
//   jobTitle: "SOCIAL CAMPAIGN FOR BOOST JUICE 02/24",
//   startDate: "05/07/2024",
//   endDate: "05/08/2024",
//   jobDesc: "Rest volo omnimusandae ea pediti tem quis arum audam venditi bustet liae num ipsam quas et aut post, " +
//     "non ped molupta tquaspe riaepudae corporehende vella sincitatius et officiti invello rempere providit " +
//     "eumquosanim simpore planiat ibuscius sitatio nsequos conectios eatur arcietur, cor aut eum derum " +
//     "fugit quae lam aliquam quia doluptatur, consequi conectatur aut re commod ma aut aut assit et quaeserum quae dion cusam, quae laut que nat laccatio. Pit a quiat im volores maios" +
//     "sed mi, tem hit, quis aliquae sa porestis nus remolor enisquae nem earum et repro te ex exere nis " +
//     "volorep errovidus aliquiam, ut magnihit et magnatia dolupta temquis et quos volorio maione reptate " +
//     "ssimaion et occulparchil mi, ut volla nos inumquo ditatiundis inistio consent liquamus nistrum quaspe " +
//     "volo to maximet ut aut anda quam ut esse mo conesenihil exceate rest asint, omnihicia" +
//     "m volupta qui dipsa volupta poreperci coremporibus sam derrovit quatemolum et experum et as " +
//     "alibusam nus dis voluptum nis natis porporio. Met es ducimi, ipsam qui sus apediam quatquibus nis " +
//     "aliquati ut hillaccuptam harum vendi alignim porpossunti intorem ipicipitin cum quatem dignimaio. Tem " +
//     "rehenis quis sus quia ipsam, te as eosam int quis dipsapi sseque odisque numquo odi quam, to vero volorro et et dolecabor molo quiaera pori beatemp orepedi quam sincti quiduci mincidenecum voluptatem"
// }

// const dataInvoice = {
//   talent: {
//     name: "Talent",
//   },
//   companyName: "Company",
//   companyAddress: "Company Address",
//   abn: "abn",
//   contactDetails: {
//     name: "Jenny",
//     email: "jenny@gmail.com",
//   },
//   campaign: {
//     name: "Campaign Name",
//     date: "05/07/2024",
//     deliverables: "Campaign Deliverables"
//   },
//   expenses: "Expense",
//   poNumber: "PO 2345",
//   gst: true,
//   asp: false,
//   commission: "commission",
//   paymentTerms: 10,
// }
// app.get('/', (req, res) => {
//   res.render('NewJob', { result: data });
// });
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

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
  keyFilename: jwtBucketClient,
  projectId: key.project_id
});

const bucketName = "talent";

app.post("/api/job/uploadFile", upload.single("briefFile"), async (req, res) => {
  console.log("In Image controller backend");
  console.log(req.file)
  try {
    if (!req.file) {
      return res.json({ success: true, message: "No file uploaded" });
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
    res.json({ success: false, message: "Internal Server Error." });
  }
});

app.get('/images/:filename', (req, res) => {
  const fileName = req.params.filename;
  const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
  res.redirect(publicUrl); // Redirect to the public URL for the file
});