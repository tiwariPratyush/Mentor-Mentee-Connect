const MentorProfile = require('../models/MentorProfile');

exports.createMentorProfile = async (req, res) => {
  try {
    const mentorProfile = new MentorProfile({
      user: req.user._id,
      ...req.body
    });
    await mentorProfile.save();
    res.status(201).json(mentorProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMentorProfile = async (req, res) => {
  try {
    const mentorProfile = await MentorProfile.findOne({ user: req.user._id });
    if (!mentorProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(mentorProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMentorProfile = async (req, res) => {
  try {
    const mentorProfile = await MentorProfile.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!mentorProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(mentorProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};