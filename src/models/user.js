const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: [6, "Username must be at least 6 characters long"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters long"],
  },
  role: {
    type: String,
    enum: ["admin", "member", "normal"],
    default: "normal",
    index: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "denied"],
    default: "pending",
    index: true,
  },
  // New properties controlled by admin
  batch: { type: Number }, // e.g., 2022
  post: {
    type: String,
    enum: [
      "Joint Secretary",
      "Competitive Programming Head",
      "Web Development Head",
      "Data Science Head",
      "GenAI Head",
      "App Dev Head",
      "Media and Design Head",
      "Class Mentor",
      "Event Head",
      "Executive members",
    ],
  },
  imageSrc: {
    type: String,
  },
  rollNo: {
    type: String,
    trim: true,
  },
  achievements: [
    {
      event: { type: String, required: true },
      status: { type: String, required: true },
      category: { type: String, required: true, default: "HACKATHONS" },
    },
  ],
  hideAchievementsCard: {
    type: Boolean,
    default: false,
  },
  showInHireUs: {
    type: Boolean,
    default: false,
  },
  availability: {
    type: String,
    enum: ["Internship", "Full-time", "Freelance", "Part-time"],
    default: "Full-time",
  },
  headlineRole: {
    type: String,
    trim: true,
  },
  domain: {
    type: String,
    trim: true,
  },
  skills: [{ type: String }],
  github: { type: String, trim: true },
  linkedin: { type: String, trim: true },
  portfolio: { type: String, trim: true },
  resume: { type: String, trim: true },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

if (mongoose.models && mongoose.models.User) {
  delete mongoose.models.User;
}

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
