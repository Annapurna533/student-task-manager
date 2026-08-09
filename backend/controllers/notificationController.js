const Notification = require("../models/Notification");

// ==========================
// GET MY NOTIFICATIONS
// ==========================
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.user.id
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            notifications
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get notifications",
            error: error.message
        });
    }
};


// ==========================
// MARK NOTIFICATION AS READ
// ==========================
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to mark notification as read",
            error: error.message
        });
    }
};


// ==========================
// EXPORT
// ==========================
module.exports = {
    getMyNotifications,
    markAsRead
};