const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("mongo db connected".cyan.bold);
    } catch (error) {
        console.log(`${error.message}`.red.bold);
        console.log("error connecting db");
        process.exit();
    }
}