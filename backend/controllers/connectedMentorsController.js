const ConnectedMentors = require('../models/ConnectedMentors');
const User = require('../models/User');

exports.getConnectedMentors = async (req, res) => {
  try {
    const menteeId = req.user._id; // Assuming the mentee's ID is available in req.user

    const connectedMentorsDoc = await ConnectedMentors.findOne({ mentee: menteeId });

    if (!connectedMentorsDoc) {
      return res.status(200).json({ mentors: [] });
    }

    const mentors = await User.find(
      { _id: { $in: connectedMentorsDoc.mentors } },
      'name email profilePicture bio subjectExpertise'
    );

    res.status(200).json({
      success: true,
      count: mentors.length,
      mentors: mentors
    });
  } catch (error) {
    console.error('Error fetching connected mentors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching connected mentors',
      error: error.message
    });
  }
};