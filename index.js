const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const classifiedsRoutes = require("./routes/classifieds");
const { connection } = require("./config/db");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Welcome to OLX Api")
})
// Routes
app.use("/classifieds", classifiedsRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
  try {
    await connection;
    console.log("Connection established successfully");
  } catch (error) {
    console.log("Error connecting with mongoose db", error);
  }

});
