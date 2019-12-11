// import { Mongoose } from "mongoose"
var mongoose = require("mongoose");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://<dbuser>:<dbpassword>@ds253368.mlab.com:53368/heroku_11dr059t";

mongoose.connect(MONGODB_URI);