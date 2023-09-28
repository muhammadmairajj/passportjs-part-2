const express = require("express");
const cors = require("cors");
const router = require("./routes");
const passport = require("passport");
const passportJwt = require("./config/passport");
require("./config/db");

const app = express();

// Middleware:
// Express Middleware
app.use(express.json());
// Cors Middleware
app.use(cors());
// Passport Middleware
app.use(passport.initialize());
passportJwt(passport);

// Api Route
app.use("/api", router);

// app.use(passport.initialize());

app.listen(process.env.PORT, () => {
    console.log(`server started at on ${process.env.PORT}`);
});