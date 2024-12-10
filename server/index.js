const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const path = require('path');

const dotenv = require("dotenv");
dotenv.config();

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
  origin: '*'
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

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/talent", talentRoute);
app.use("/api/client", clientRoute);
app.use("/api/estimate", estimateRoute);
app.use("/api/job", jobRoute);

app.get('/download-ics/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'generated-events', filename);

  res.download(filePath, filename, (err) => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});