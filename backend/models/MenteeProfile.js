const mongoose = require('mongoose');

const menteeProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  currentLevel: {
    type: String,
    required: true
  },
  institution: {
    type: String,
    required: true
  },
  interestedSubjects: {
    type: [String],  // Changed to an array of strings
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;  // Ensure at least one subject is selected
      },
      message: 'At least one interested subject is required'
    }
  },
  profileCompleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const MenteeProfile = mongoose.model('MenteeProfile', menteeProfileSchema);

module.exports = MenteeProfile;