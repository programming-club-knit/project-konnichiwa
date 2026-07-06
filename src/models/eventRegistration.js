const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  rollNo: { type: String, required: true },
  year: { type: Number }, // 1-4 derived automatically
  branch: { type: String }, // derived from rollNo mapping
  contactNo: { type: String, required: true },
  email: { type: String, required: true },
  dynamic: { type: Object, default: {} },
}, { _id: false });

const eventRegistrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  // Type of registration
  type: { type: String, enum: ['individual', 'team'], default: 'individual', index: true },
  // Unique registration identifier (e.g. PTSC25E123)
  registrationId: { type: String, unique: true, index: true },
  // Individual registration fields (backward compatible)
  name: { type: String },
  gender: { type: String },
  rollNo: { type: String },
  year: { type: Number }, // 1-4 derived automatically for individual registrations
  branch: { type: String }, // derived automatically
  contactNo: { type: String },
  email: { type: String },
  dynamic: { type: Object, default: {} },
  // Team registration fields
  team: {
    teamName: { type: String },
    dynamic: { type: Object, default: {} },
  },
  participants: { type: [participantSchema], default: [] },
  leaderIndex: { type: Number, default: 0 },
  // Attendance tracking
  attended: { type: Boolean, default: false },
  attendedAt: { type: Date, default: null },
  // Soft delete
  deleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);
