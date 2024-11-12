const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const dotenv = require("dotenv");
dotenv.config();

const { google } = require('googleapis');
const authRoute = require("./Routes/AuthRoute");
const userRoute = require("./Routes/UserRoute");
const talentRoute = require("./Routes/TalentRoute");
const clientRoute = require("./Routes/ClientRoute");
const estimateRoute = require("./Routes/EstimateRoute");
const jobRoute = require("./Routes/JobRoute");

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
  origin: '*',
  credentials: true,
}
app.use(cors(corsOpts));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files from the root directory

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.CALENDAR_REDIRECT_URL
);

// Configure passport with Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALENDAR_REDIRECT_URL,
}, (accessToken, refreshToken, profile, done) => {
  // Save tokens and user profile in session
  req.session.tokens = { access_token: accessToken, refresh_token: refreshToken };
  console.log("--------", req.session.tokens)
  const user = { profile, accessToken, refreshToken };
  return done(null, user);
}));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Auth route to initiate OAuth flow
app.get('/auth', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: process.env.CALENDAR_SCOPES,
  });
  return res.redirect(url);
});

// Callback route after Google authentication
app.get("/auth/redirect", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    req.session.tokens = tokens;
    // return res.redirect('http://localhost:3000/auth/redirect');
  } catch (error) {
    console.error("Error during authentication:", error);
    return res.status(500).json({ success: false, message: "Authentication failed." });
  }
});


// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/talent", talentRoute);
app.use("/api/client", clientRoute);
app.use("/api/estimate", estimateRoute);
app.use("/api/job", jobRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});