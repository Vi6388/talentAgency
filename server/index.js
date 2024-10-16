const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const authRoute = require("./Routes/AuthRoute");
const userRoute = require("./Routes/UserRoute");
const talentRoute = require("./Routes/TalentRoute");
const clientRoute = require("./Routes/ClientRoute");
const estimateRoute = require("./Routes/EstimateRoute");

dotenv.config();

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