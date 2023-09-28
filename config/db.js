const mongoose = require("mongoose"); 
require("dotenv").config({ path: "./config.env" });


const MongoDB_URI = process.env.MONGODB_URI;

mongoose.connect(MongoDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.on("error", () => {
    console.log("MongoDB Connection Failed...");
});

connection.on("connected", () => {
    console.log("MongoDB Connection Successfully");
});