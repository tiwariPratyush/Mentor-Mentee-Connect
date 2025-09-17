const mongoose = require('mongoose');

const connectedMentorsSchema = new mongoose.Schema({
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  mentors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

const ConnectedMentors = mongoose.model('ConnectedMentors', connectedMentorsSchema);

module.exports = ConnectedMentors;