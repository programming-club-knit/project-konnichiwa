const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    rollNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    branch: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    platforms: {
      codeforces: {
        username: {
          type: String,
          default: null,
        },
      },

      codechef: {
        username: {
          type: String,
          default: null,
        },
      },

      leetcode: {
        username: {
          type: String,
          default: null,
        },
      },

      atcoder: {
        username: {
          type: String,
          default: null,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);