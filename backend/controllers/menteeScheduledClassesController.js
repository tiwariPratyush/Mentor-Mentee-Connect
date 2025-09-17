const ConnectedMentors = require('../models/ConnectedMentors');
const User = require('../models/User');
const UpcomingClasses = require('../models/UpcomingClasses');

exports.getConnectedMentorsAndClasses = async (req, res) => {
  try {
    const menteeId = req.user._id; // Assuming the mentee's ID is available in req.user

    // Find the connected mentors document for this mentee
    const connectedMentorsDoc = await ConnectedMentors.findOne({ mentee: menteeId });

    if (!connectedMentorsDoc) {
      return res.status(200).json({
        success: true,
        message: "No connected mentors found for this mentee.",
        mentorsWithClasses: []
      });
    }

    // Fetch the names of the connected mentors and their scheduled classes
    const mentorsWithClasses = await Promise.all(connectedMentorsDoc.mentors.map(async (mentorId) => {
      const mentor = await User.findById(mentorId, 'name');
      const upcomingClasses = await UpcomingClasses.findOne({ mentorId });

      return {
        id: mentor._id,
        name: mentor.name,
        scheduledClasses: upcomingClasses ? upcomingClasses.classes.map(cls => ({
          id: cls._id,
          title: cls.title,
          date: cls.date
        })) : []
      };
    }));

    res.status(200).json({
      success: true,
      message: "Connected mentors and their classes retrieved successfully.",
      mentorsWithClasses
    });

  } catch (error) {
    console.error('Error fetching connected mentors and classes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching connected mentors and classes',
      error: error.message
    });
  }
};