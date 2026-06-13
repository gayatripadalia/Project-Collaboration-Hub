const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String,
  message: String,
  projectId: mongoose.Schema.Types.ObjectId,
  isRead: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);