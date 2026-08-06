const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// Load .env variables if file exists (local dev only — Vercel injects them automatically)
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value.trim();
      }
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("⚠️  MONGODB_URI is not set. Skipping admin seed.");
  process.exit(0); // Exit cleanly — don't fail the build
}

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@ptsc.knit.ac.in";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "adminpassword123";

// Load the User model
const User = require("../src/models/user");

async function seedAdmin() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB.");

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log(`ℹ️  Admin ${ADMIN_EMAIL} already exists. Ensuring role/status are correct...`);
      existingAdmin.role = "admin";
      existingAdmin.status = "approved";
      await existingAdmin.save();
      console.log("✅ Admin user confirmed.");
    } else {
      console.log(`🚀 Creating admin user: ${ADMIN_EMAIL}`);
      const adminUser = new User({
        firstName: "PTSC",
        lastName: "Admin",
        username: "ptscadmin",
        email: ADMIN_EMAIL,
        mobile: 9999999999,
        password: ADMIN_PASSWORD, // pre-save hook hashes this
        role: "admin",
        status: "approved",
      });

      await adminUser.save();
      console.log("------------------------------------------");
      console.log("✅ Admin user created successfully!");
      console.log(`   Email:    ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      console.log("------------------------------------------");
    }
  } catch (error) {
    console.error("❌ Admin seed failed:", error.message);
    // Don't exit(1) — we don't want to fail the Vercel build over this
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
  }
}

seedAdmin();
