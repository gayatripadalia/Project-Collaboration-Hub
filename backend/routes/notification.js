const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");

// ✅ Get Notifications for a user
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ _id: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Mark Notification as Read
router.post("/read/:id", auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ msg: "Not found" });
    
    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    notification.isRead = true;
    await notification.save();
    res.json({ msg: "Marked as read" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
