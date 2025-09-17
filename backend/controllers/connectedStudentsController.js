const ConnectedMentees = require('../models/ConnectedMentees');
const User = require('../models/User'); // Assuming you have a User model

exports.getConnectedStudents = async (req, res) => {
  try {
    const mentorId = req.user._id; // Assuming the mentor's ID is available in req.user

    const connectedMentees = await ConnectedMentees.findOne({ mentor: mentorId });

    if (!connectedMentees) {
      return res.status(200).json({ students: [] });
    }

    // Fetch details of connected students
    const students = await User.find(
      { _id: { $in: connectedMentees.mentees } },
      'name email profilePicture' // Add or remove fields as needed
    );

    res.status(200).json({ students });
  } catch (error) {
    console.error('Error fetching connected students:', error);
    res.status(500).json({ message: 'Error fetching connected students', error: error.message });
  }
};