const UpcomingClasses = require('../models/UpcomingClasses');

exports.scheduleClass = async (req, res) => {
  try {
    const mentorId = req.user._id; // Using the authenticated user's ID
    const { date, title } = req.body;

    let upcomingClasses = await UpcomingClasses.findOne({ mentorId });

    if (!upcomingClasses) {
      upcomingClasses = new UpcomingClasses({ mentorId, classes: [] });
    }

    upcomingClasses.classes.push({ date, title });
    await upcomingClasses.save();

    res.status(201).json({ message: 'Class scheduled successfully', upcomingClasses });
  } catch (error) {
    console.error('Error scheduling class:', error);
    res.status(500).json({ message: 'Error scheduling class', error: error.message });
  }
};

exports.getUpcomingClasses = async (req, res) => {
  try {
    const mentorId = req.user._id; // Using the authenticated user's ID
    const upcomingClasses = await UpcomingClasses.findOne({ mentorId });

    if (!upcomingClasses) {
      return res.status(404).json({ message: 'No upcoming classes found for this mentor' });
    }

    res.status(200).json(upcomingClasses);
  } catch (error) {
    console.error('Error fetching upcoming classes:', error);
    res.status(500).json({ message: 'Error fetching upcoming classes', error: error.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const mentorId = req.user._id; // Using the authenticated user's ID
    const { classId } = req.params;

    const upcomingClasses = await UpcomingClasses.findOne({ mentorId });

    if (!upcomingClasses) {
      return res.status(404).json({ message: 'No upcoming classes found for this mentor' });
    }

    upcomingClasses.classes = upcomingClasses.classes.filter(
      (cls) => cls._id.toString() !== classId
    );

    await upcomingClasses.save();

    res.status(200).json({ message: 'Class deleted successfully', upcomingClasses });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ message: 'Error deleting class', error: error.message });
  }
};