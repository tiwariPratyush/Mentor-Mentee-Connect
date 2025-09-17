const MenteeProfile = require('../models/MenteeProfile');

exports.createMenteeProfile = async (req, res) => {
  try {
    const menteeProfile = new MenteeProfile({
      user: req.user._id,
      ...req.body
    });
    await menteeProfile.save();
    res.status(201).json(menteeProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMenteeProfile = async (req, res) => {
  try {
    const menteeProfile = await MenteeProfile.findOne({ user: req.user._id });
    if (!menteeProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(menteeProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMenteeProfile = async (req, res) => {
  try {
    const menteeProfile = await MenteeProfile.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!menteeProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(menteeProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};