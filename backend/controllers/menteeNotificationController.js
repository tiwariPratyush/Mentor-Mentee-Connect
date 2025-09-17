const MenteeNotification = require('../models/MenteeNotification');

exports.getMenteeNotifications = async (req, res) => {
  try {
    const menteeId = req.user._id; // Assuming the mentee's ID is available in req.user

    const notifications = await MenteeNotification.find({
      mentee: menteeId,
      activeNotification: true
    }).populate('mentor', 'name email') // Populate mentor details
      .sort({ createdAt: -1 }); // Sort by most recent first

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications: notifications
    });
  } catch (error) {
    console.error('Error fetching mentee notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const menteeId = req.user._id;

    const notification = await MenteeNotification.findOneAndUpdate(
      { _id: notificationId, mentee: menteeId },
      { activeNotification: false },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or not authorized'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
};

// New function to create a notification
exports.createMenteeNotification = async (req, res) => {
  try {
    const { mentee, message } = req.body;
    const mentor = req.user._id; // Assuming the mentor is the authenticated user creating the notification

    // Validate input
    if (!mentee || !message) {
      return res.status(400).json({
        success: false,
        message: 'Mentee ID and message are required'
      });
    }

    const newNotification = new MenteeNotification({
      mentor,
      mentee,
      message,
      activeNotification: true
    });

    await newNotification.save();

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      notification: newNotification
    });
  } catch (error) {
    console.error('Error creating mentee notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating notification',
      error: error.message
    });
  }
};