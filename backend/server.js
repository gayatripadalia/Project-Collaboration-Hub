const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(cors());
app.use(express.json());

// Make io accessible in our router
app.use((req, res, next) => {
  req.io = io;
  next();
});

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const projectRoutes = require("./routes/project");
app.use("/api/projects", projectRoutes);

const taskRoutes = require("./routes/task");
app.use("/api/tasks", taskRoutes);

const notificationRoutes = require("./routes/notification");
app.use("/api/notifications", notificationRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API running");
});

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  
  // User joins their own personal room to receive targeted notifications
  socket.on("joinUserRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their notification room`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));