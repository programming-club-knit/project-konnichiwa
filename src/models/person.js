import mongoose from "mongoose";

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    batch: {
      type: String,
      required: [true, "Batch is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    domain: {
      type: String,
      required: [true, "Domain is required"],
      trim: true,
    },
    imageSrc: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    isPTSCAlumni: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Person || mongoose.model("Person", personSchema);
