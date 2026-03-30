require("dotenv").config();

const mongoose = require('mongoose');
const dbgr = require('debug')("development:mongoose");

mongoose
.connect(`${process.env.MONGO_URI}/scatch`)
.then(function () {
    dbgr("connected");
})
.catch(function (err) {
    dbgr(err);
});

module.exports = mongoose.connection;
