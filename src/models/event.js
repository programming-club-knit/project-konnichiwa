const mongoose = require("mongoose");

const registrationFieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  required: { type: Boolean, default: false },
  placeholder: { type: String },
  description: { type: String },
  validation: { type: String },
  options: { type: [String], default: [] },
  allowedTypes: { type: [String], default: [] }, // For file inputs: ['.pdf', '.jpg']
}, { _id: false });

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  ruleBookUrl: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  // Array of resource links (label + url) to assist participants for preparation
  resources: {
    type: [
      new mongoose.Schema({
        label: { type: String, required: true },
        url: { type: String, required: true },
      }, { _id: false })
    ],
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
    index: true,
  },
  time: {
    type: String,
  },
  status: {
    type: String,
    index: true,
  },
  googleFormLink: {
    type: String,
  },
  whatsappGroupLink: {
    type: String,
  },
  coverImageUrl: {
    type: String,
  },
  forceGoogleForm: {
    type: Boolean,
    default: false,
  },
  useCustomForm: {
    type: Boolean,
    default: false,
  },
  registrationFields: {
    type: [registrationFieldSchema],
    default: [],
  },
  // Registration type: individual (default) or team
  registrationType: {
    type: String,
    enum: ['individual', 'team'],
    default: 'individual',
  },
  // Team settings (only for registrationType === 'team')
  teamMinSize: { type: Number, default: 1 },
  teamMaxSize: { type: Number, default: 1 },
  // Fields that apply to each participant in a team
  participantFields: {
    type: [registrationFieldSchema],
    default: [],
  },
  // Event completion tracking - can only be marked completed after event date
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // Email summary - cached counts to avoid recalculating
  emailSummary: {
    type: {
      registration: {
        sent: { type: Number, default: 0 },
        failed: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      participation: {
        sent: { type: Number, default: 0 },
        failed: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      certificate: {
        sent: { type: Number, default: 0 },
        failed: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      }
    },
    default: {
      registration: { sent: 0, failed: 0, pending: 0, total: 0 },
      participation: { sent: 0, failed: 0, pending: 0, total: 0 },
      certificate: { sent: 0, failed: 0, pending: 0, total: 0 }
    }
  },
  winners: {
    overall: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventRegistration' }],
    overallFirstYear: { type: mongoose.Schema.Types.ObjectId, ref: 'EventRegistration' },
    overallFirstYearGirls: { type: mongoose.Schema.Types.ObjectId, ref: 'EventRegistration' },
    overallGirls: { type: mongoose.Schema.Types.ObjectId, ref: 'EventRegistration' },
    dynamicCategories: [{
      title: { type: String, required: true },
      winners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventRegistration' }]
    }],
    published: { type: Boolean, default: false }
  }
})
module.exports = mongoose.model("Event", eventSchema);
