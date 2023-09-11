const mongoose = require("mongoose");
require("dotenv").config()


const connection = mongoose.connect("mongodb+srv://saurabhwakde430:S@urabhMongo@cluster0.p4hftyi.mongodb.net/olx_classifieds");
module.exports = { connection };