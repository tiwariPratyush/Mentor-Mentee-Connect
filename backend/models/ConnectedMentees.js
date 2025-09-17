const mongoose = require('mongoose');

const connectedMenteesSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  mentees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

const ConnectedMentees = mongoose.model('ConnectedMentees', connectedMenteesSchema);

module.exports = ConnectedMentees;