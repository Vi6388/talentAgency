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

app.get('/create-event', async (req, res) => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const event = {
    summary: 'Tech Talk with Jesus',
    location: 'Google Meet',

    description: "Demo event for Jesus's Blog Post.",
    start: {
      dateTime: "2024-10-14T19:30:00+05:30"
    },
    end: {
      dateTime: "2024-10-14T20:30:00+05:30"
    },
    colorId: 1,
    conferenceData: {
      createRequest: {
        requestId: 1,
      }
    },

    attendees: [
      { email: 'honeypot.owner@gmail.com' },
    ]

  };
  // try {
  //   const result = await calendar.events.insert({
  //     calendarId: 'primary',
  //     auth: oauth2Client,
  //     conferenceDataVersion: 1,
  //     sendUpdates: 'all',
  //     resource: event
  //   });

  //   return res.send({
  //     status: 200,
  //     message: 'Event created',
  //     link: result.data.hangoutLink
  //   });
  // } catch (err) {
  //   console.log(err);
  //   res.send(err);
  // }
}
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});