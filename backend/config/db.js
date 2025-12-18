
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://mmv-01:iTLTu6ADqy9TMqFo@mmv25.7zpqnry.mongodb.net/?appName=MMV25";
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`✅ MongoDB Connected`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};      

module.exports = connectDB;
