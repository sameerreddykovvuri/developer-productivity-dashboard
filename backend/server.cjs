const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dataPath = (file) => path.join(__dirname, "data", file);

function readData(file) {
  return JSON.parse(fs.readFileSync(dataPath(file), "utf8"));
}

function writeData(file, data) {
  fs.writeFileSync(dataPath(file), JSON.stringify(data, null, 2));
}

// HEALTH
app.get("/", (req, res) => {
  res.json({ message: "BuildScope API is running successfully 🚀" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "API is healthy" });
});

// ================= USERS =================

// GET all users
app.get("/api/users", (req, res) => {
  res.json(readData("users.json"));
});

// GET single user
app.get("/api/users/:id", (req, res) => {
  const users = readData("users.json");

  const user = users.find(
    (u) => String(u.id) === String(req.params.id)
  );

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

// CREATE user
app.post("/api/users", (req, res) => {
  const users = readData("users.json");

  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({
      error: "name, email and role are required"
    });
  }

  const user = {
    id: Date.now().toString(),
    name,
    email,
    role
  };

  users.push(user);
  writeData("users.json", users);

  res.status(201).json(user);
});

// UPDATE user
app.put("/api/users/:id", (req, res) => {
  const users = readData("users.json");

  const index = users.findIndex(
    (u) => String(u.id) === String(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users[index] = {
    ...users[index],
    ...req.body,
    id: users[index].id
  };

  writeData("users.json", users);

  res.json(users[index]);
});

// DELETE user
app.delete("/api/users/:id", (req, res) => {
  const users = readData("users.json");

  const index = users.findIndex(
    (u) => String(u.id) === String(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const deletedUser = users.splice(index, 1)[0];

  writeData("users.json", users);

  res.json({
    message: "User deleted successfully",
    user: deletedUser
  });
});

// =====================================================
// PROJECTS CRUD
// =====================================================

// GET ALL PROJECTS
app.get("/api/projects", (req, res) => {
  const projects = readData("projects.json");
  res.status(200).json(projects);
});

// GET SINGLE PROJECT
app.get("/api/projects/:id", (req, res) => {
  const projects = readData("projects.json");

  const project = projects.find(
    (p) => String(p.id) === String(req.params.id)
  );

  if (!project) {
    return res.status(404).json({
      error: "Project not found"
    });
  }

  res.status(200).json(project);
});

// CREATE PROJECT
app.post("/api/projects", (req, res) => {
  const projects = readData("projects.json");

  const { name, description, status, progress } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Project name is required"
    });
  }

  const project = {
    id: Date.now().toString(),
    name,
    description: description || "",
    status: status || "Active",
    progress: Number(progress) || 0
  };

  projects.push(project);
  writeData("projects.json", projects);

  res.status(201).json(project);
});

// UPDATE PROJECT
app.put("/api/projects/:id", (req, res) => {
  const projects = readData("projects.json");

  const index = projects.findIndex(
    (p) => String(p.id) === String(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      error: "Project not found"
    });
  }

  projects[index] = {
    ...projects[index],
    ...req.body
  };

  writeData("projects.json", projects);

  res.status(200).json(projects[index]);
});

// DELETE PROJECT
app.delete("/api/projects/:id", (req, res) => {
  const projects = readData("projects.json");

  const index = projects.findIndex(
    (p) => String(p.id) === String(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      error: "Project not found"
    });
  }

  const deletedProject = projects.splice(index, 1)[0];

  writeData("projects.json", projects);

  res.status(200).json({
    message: "Project deleted successfully",
    project: deletedProject
  });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Internal server error"
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`BuildScope API running on http://localhost:${PORT}`);
});