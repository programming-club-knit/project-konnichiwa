const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true, 
    index: true 
  },
  registrationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'EventRegistration', 
    required: true,
    index: true 
  },
  emailType: { 
    type: String, 
    enum: ['registration', 'participation', 'certificate'], 
    required: true,
    index: true
  },
  recipientEmail: { 
    type: String, 
    required: true 
  },
  recipientName: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['pending', 'sent', 'failed'], 
    default: 'pending',
    index: true 
  },
  sentAt: { 
    type: Date 
  },
  failedAt: { 
    type: Date 
  },
  errorMessage: { 
    type: String 
  },
  retryCount: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound index for efficient queries
emailLogSchema.index({ eventId: 1, emailType: 1, status: 1 });

// Update timestamp on save
emailLogSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('EmailLog', emailLogSchema);
