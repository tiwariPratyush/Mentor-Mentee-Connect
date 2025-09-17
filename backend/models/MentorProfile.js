const mongoose = require('mongoose');

const mentorProfileSchema = new mongoose.Schema({
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
  teachingLanguage: {
    type: String,
    required: true
  },
  highestDegree: {
    type: String,
    required: true,
    enum: ['Bachelors', 'Masters', 'PhD', 'Diploma']
  },
  subjectExpertise: {
    type: String,
    required: true,
    enum: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Literature', 'History', 'Geography']
  },
  institute: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  achievements: {
    type: String
  },
  profileCompleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const MentorProfile = mongoose.model('MentorProfile', mentorProfileSchema);

module.exports = MentorProfile;