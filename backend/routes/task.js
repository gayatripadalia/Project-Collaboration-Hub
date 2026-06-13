const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const ProjectMember = require("../models/ProjectMember");
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");

// ✅ Create Task (ADMIN ONLY)
router.post("/create", auth, async (req, res) => {
  try {
    const { projectId, title, description, assignedTo, priority, deadline } = req.body;
    const createdBy = req.user.id;

    // 🔒 Check if creator is admin
    const member = await ProjectMember.findOne({ projectId, userId: createdBy });
    if (!member || member.role !== "admin") {
      return res.status(403).json({ msg: "Only admin can create tasks" });
    }

    const task = await Task.create({
      projectId,
      title,
      description,
      assignedTo,
      createdBy,
      priority,
      deadline
    });

    // 🔔 CREATE NOTIFICATION
    const notification = await Notification.create({
      userId: assignedTo,
      type: "task",
      message: `You have been assigned a new task: ${title}`,
      projectId
    });

    if (req.io) {
      req.io.to(assignedTo.toString()).emit("notification", notification);
    }

    res.json(task);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Get Tasks by Project
router.get("/:projectId", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name");
    res.json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Update Task Status (ONLY ASSIGNED USER)
router.post("/update/:taskId", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.user.id;

    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // 🔒 Check if user is assigned
    if (task.assignedTo.toString() !== userId) {
      return res.status(403).json({ msg: "Not allowed to update this task" });
    }

    task.status = status;
    await task.save();

    // Notify task creator
    const notification = await Notification.create({
      userId: task.createdBy,
      type: "update",
      message: `Task status updated to ${status}: ${task.title}`,
      projectId: task.projectId
    });

    if (req.io) {
      req.io.to(task.createdBy.toString()).emit("notification", notification);
      // Emit task update event to the whole project room or just trigger refetch via notification
    }

    res.json(task);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;