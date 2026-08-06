const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ptsc_db";

async function cleanDummyTalent() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    const dummyEmails = [
      "rohan.23405@knit.ac.in",
      "sakshi.23406@knit.ac.in",
      "aditya.23407@knit.ac.in",
      "priya.23408@knit.ac.in",
    ];

    const result = await mongoose.connection.collection("users").deleteMany({
      email: { $in: dummyEmails },
    });

    console.log(`Deleted ${result.deletedCount} dummy talent users from MongoDB.`);
  } catch (error) {
    console.error("Error cleaning dummy talent:", error);
  } finally {
    await mongoose.disconnect();
  }
}

cleanDummyTalent();
