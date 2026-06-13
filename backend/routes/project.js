const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const ProjectMember = require("../models/ProjectMember");
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");

// ✅ Create Project
router.post("/create", auth, async (req, res) => {
  try {
    const { title, description, requiredSkills, capacity, deadline } = req.body;
    const userId = req.user.id;

    const project = await Project.create({
      title,
      description,
      requiredSkills: requiredSkills || [],
      capacity: capacity || 10,
      deadline,
      createdBy: userId
    });

    // Make creator admin
    await ProjectMember.create({
      userId,
      projectId: project._id,
      role: "admin",
      status: "accepted"
    });

    res.json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Get All Projects (with member counts)
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find().populate('createdBy', 'name').lean();
    
    // Add accepted member count for each project
    const projectsWithCounts = await Promise.all(projects.map(async (p) => {
      const acceptedCount = await ProjectMember.countDocuments({ projectId: p._id, status: "accepted" });
      return { ...p, acceptedCount };
    }));

    res.json(projectsWithCounts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Get My Projects
router.get("/my-projects", auth, async (req, res) => {
  try {
    const memberships = await ProjectMember.find({
      userId: req.user.id,
      status: "accepted"
    }).populate("projectId");

    const projects = memberships.map(m => m.projectId).filter(p => p);
    res.json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Request to Join
router.post("/join/:projectId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    const existing = await ProjectMember.findOne({ userId, projectId });
    if (existing) return res.json({ msg: "Already requested or member" });

    const request = await ProjectMember.create({
      userId,
      projectId,
      role: "member",
      status: "pending"
    });

    // Notify Project Admin
    const project = await Project.findById(projectId);
    if (project) {
      const notification = await Notification.create({
        userId: project.createdBy,
        type: "request",
        message: "New join request for your project",
        projectId
      });
      // Emit via socket
      if (req.io) {
        req.io.to(project.createdBy.toString()).emit("notification", notification);
      }
    }

    res.json(request);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Get Join Requests (Admin)
router.get("/requests/:projectId", auth, async (req, res) => {
  try {
    const requests = await ProjectMember.find({
      projectId: req.params.projectId,
      status: "pending"
    }).populate("userId", "name email skills bio experienceLevel");

    res.json(requests);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Accept Request
router.post("/accept/:id", auth, async (req, res) => {
  try {
    const reqData = await ProjectMember.findById(req.params.id);
    if (!reqData) return res.status(404).json({ msg: "Request not found" });

    reqData.status = "accepted";
    await reqData.save();

    // Notify User
    const notification = await Notification.create({
      userId: reqData.userId,
      type: "update",
      message: "Your request to join the project was accepted",
      projectId: reqData.projectId
    });
    
    if (req.io) {
      req.io.to(reqData.userId.toString()).emit("notification", notification);
    }

    res.json({ msg: "Accepted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Reject Request
router.post("/reject/:id", auth, async (req, res) => {
  try {
    const reqData = await ProjectMember.findById(req.params.id);
    if (!reqData) return res.status(404).json({ msg: "Request not found" });

    reqData.status = "rejected";
    await reqData.save();

    res.json({ msg: "Rejected" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Get Project Members
router.get("/members/:projectId", auth, async (req, res) => {
  try {
    const members = await ProjectMember.find({
      projectId: req.params.projectId,
      status: "accepted"
    }).populate("userId", "name email skills bio experienceLevel");

    res.json(members);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Remove Teammate
router.delete("/members/:projectId/:userId", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    const isAdminMember = await ProjectMember.findOne({ projectId: req.params.projectId, userId: req.user.id, role: "admin" });
    const isCreator = project.createdBy && project.createdBy.toString() === req.user.id;

    if (!isCreator && !isAdminMember) {
      return res.status(403).json({ msg: "Only the project admin can remove members" });
    }

    const targetIsCreator = project.createdBy && project.createdBy.toString() === req.params.userId;
    const targetIsAdmin = await ProjectMember.findOne({ projectId: req.params.projectId, userId: req.params.userId, role: "admin" });

    if (targetIsCreator || targetIsAdmin) {
      return res.status(400).json({ msg: "Cannot remove a project admin" });
    }

    await ProjectMember.findOneAndDelete({
      projectId: req.params.projectId,
      userId: req.params.userId
    });

    res.json({ msg: "Member removed" });
  } catch (err) {
    console.error("Remove Member Error:", err);
    res.status(500).json(err);
  }
});

// ✅ Delete Project
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    // Check if user is creator OR an admin in ProjectMember (for older projects)
    const isAdminMember = await ProjectMember.findOne({ projectId: req.params.id, userId: req.user.id, role: "admin" });
    const isCreator = project.createdBy && project.createdBy.toString() === req.user.id;

    if (!isCreator && !isAdminMember) {
      return res.status(403).json({ msg: "Only the project admin can delete a project" });
    }

    const Task = require("../models/Task");
    // Delete tasks, members, and project
    await Task.deleteMany({ projectId: req.params.id });
    await ProjectMember.deleteMany({ projectId: req.params.id });
    await Project.findByIdAndDelete(req.params.id);

    res.json({ msg: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete Project Error:", err);
    res.status(500).json(err);
  }
});

module.exports = router;