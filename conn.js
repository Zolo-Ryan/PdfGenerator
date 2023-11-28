const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
    await mongoose.connect(process.env.MONGODB_CONNECT_URL).then((res) => {
        console.log('MongoDB connected!');
    });
    const connection = mongoose.connection;
    connection.once("open",() => {
        console.log("MongoDB connected!");
    });
}

module.exports = {
    dbConnect
}