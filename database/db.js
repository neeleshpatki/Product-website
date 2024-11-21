const mongoose = require("mongoose");

async function dbconnection() {
    var connection = await mongoose.connect(
        "mongodb+srv://admin:admin@cluster0.eeyt5.mongodb.net/userdetails"
    );
    return connection;
}

module.exports = dbconnection;