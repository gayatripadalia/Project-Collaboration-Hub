const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  role: { type: String, enum: ["admin", "member"] },
  status: { type: String, enum: ["pending", "accepted", "rejected"] }
});

module.exports = mongoose.model("ProjectMember", schema);