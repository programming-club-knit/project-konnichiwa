const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  imageUrl: { type: String, default: '' },
  quote: { type: String, default: '' },
  about: { type: String, default: '' },
  socials: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Profile', profileSchema);
