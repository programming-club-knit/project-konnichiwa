const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// Load .env variables manually to avoid adding package dependencies
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value.trim();
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in .env file.");
  process.exit(1);
}

// Load the User model
const User = require("../src/models/user");

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    const adminEmail = "admin@ptsc.knit.ac.in";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists.`);
      console.log("Updating role to 'admin' and status to 'approved' just in case...");
      existingAdmin.role = "admin";
      existingAdmin.status = "approved";
      await existingAdmin.save();
      console.log("Admin user updated successfully.");
    } else {
      console.log("Creating new Admin user...");
      const password = "adminpassword123";

      const adminUser = new User({
        firstName: "PTSC",
        lastName: "Admin",
        username: "ptscadmin",
        email: adminEmail,
        mobile: 9999999999,
        password: password, // Mongoose model's pre-save hook will automatically hash this
        role: "admin",
        status: "approved",
      });

      await adminUser.save();
      console.log("-----------------------------------------");
      console.log("Admin user created successfully!");
      console.log(`Email:    ${adminEmail}`);
      console.log(`Password: ${password}`);
      console.log("-----------------------------------------");
    }
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seedAdmin();
