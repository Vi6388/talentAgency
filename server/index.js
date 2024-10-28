const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const { google } = require('googleapis');
const authRoute = require("./Routes/AuthRoute");
const userRoute = require("./Routes/UserRoute");
const talentRoute = require("./Routes/TalentRoute");
const clientRoute = require("./Routes/ClientRoute");
const estimateRoute = require("./Routes/EstimateRoute");
const jobRoute = require("./Routes/JobRoute");

const oauth2Client = new google.auth.OAuth2
  (
    process.env.CALENDAR_CLIENT_ID,
    process.env.CALENDAR_CLIENT_SECRET,
    process.env.CALENDAR_REDIRECT_URL
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
const corsOpts = {
  origin: '*'
}
app.use(cors(corsOpts));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(__dirname)); // Serve static files from the root directory

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/talent", talentRoute);
app.use("/api/client", clientRoute);
app.use("/api/estimate", estimateRoute);
app.use("/api/job", jobRoute);

app.get('/auth', (req, res) => {
  const url = oauth2Client.generateAuthUrl
    ({
      access_type: 'offline',
      scope: process.env.CALENDAR_SCOPES
    });
  res.redirect(url);
}
);

app.get("/auth/redirect", async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code);
  oauth2Client.setCredentials(tokens);
  res.send('Authentication successful! Please return to the console.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});