const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  bio: { type: String, default: "" },
  experienceLevel: { type: String, default: "Beginner" },
  skills: [String]
});

module.exports = mongoose.model("User", userSchema);