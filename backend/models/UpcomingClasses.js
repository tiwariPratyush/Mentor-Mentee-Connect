const mongoose = require('mongoose');

const upcomingClassesSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  classes: [{
    date: {
      type: Date,
      required: true
    },
    title: {
      type: String,
      default: 'Scheduled Class'
    }
  }]
}, { timestamps: true });

const UpcomingClasses = mongoose.model('UpcomingClasses', upcomingClassesSchema);

module.exports = UpcomingClasses;