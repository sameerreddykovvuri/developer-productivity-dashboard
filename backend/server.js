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

// Health
app.get("/", (req, res) => {
  res.json({ message: "BuildScope API is running successfully 🚀" });
});
// USERS
app.get("/api/users", (req, res) => {
  res.json(readData("users.json"));
});
app.get("/api/users", (req, res) => {
  const users = readData("users.json");
  res.json(users);
});
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "API is healthy" });
});



app.post("/api/users", (req, res) => {
  const users = readData("users.json");
  const user = { id: Date.now().toString(), ...req.body };
  users.push(user);
  writeData("users.json", users);
  res.status(201).json(user);
});
app.get("/api/users", (req, res) => {
  const users = readData("users.json");
  res.status(200).json(users);
});
app.put("/api/users/:id", (req, res) => {
  const users = readData("users.json");
  const index = users.findIndex((u) => u.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users[index] = { ...users[index], ...req.body };
  writeData("users.json", users);
  res.json(users[index]);
});

app.delete("/api/users/:id", (req, res) => {
  const users = readData("users.json");
  const filtered = users.filter((u) => u.id !== req.params.id);

  if (filtered.length === users.length) {
    return res.status(404).json({ error: "User not found" });
  }

  writeData("users.json", filtered);
  res.json({ message: "User deleted successfully" });
});

// PROJECTS
app.get("/api/projects", (req, res) => {
  res.json(readData("projects.json"));
});

app.post("/api/projects", (req, res) => {
  const projects = readData("projects.json");
  const project = { id: Date.now().toString(), ...req.body };
  projects.push(project);
  writeData("projects.json", projects);
  res.status(201).json(project);
});

app.put("/api/projects/:id", (req, res) => {
  const projects = readData("projects.json");
  const index = projects.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Project not found" });
  }

  projects[index] = { ...projects[index], ...req.body };
  writeData("projects.json", projects);
  res.json(projects[index]);
});

app.delete("/api/projects/:id", (req, res) => {
  const projects = readData("projects.json");
  const filtered = projects.filter((p) => p.id !== req.params.id);

  if (filtered.length === projects.length) {
    return res.status(404).json({ error: "Project not found" });
  }

  writeData("projects.json", filtered);
  res.json({ message: "Project deleted successfully" });
});

// TASKS
app.get("/api/tasks", (req, res) => {
  res.json(readData("tasks.json"));
});

app.post("/api/tasks", (req, res) => {
  const tasks = readData("tasks.json");
  const task = { id: Date.now().toString(), ...req.body };
  tasks.push(task);
  writeData("tasks.json", tasks);
  res.status(201).json(task);
});

app.put("/api/tasks/:id", (req, res) => {
  const tasks = readData("tasks.json");
  const index = tasks.findIndex((t) => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks[index] = { ...tasks[index], ...req.body };
  writeData("tasks.json", tasks);
  res.json(tasks[index]);
});

app.delete("/api/tasks/:id", (req, res) => {
  const tasks = readData("tasks.json");
  const filtered = tasks.filter((t) => t.id !== req.params.id);

  if (filtered.length === tasks.length) {
    return res.status(404).json({ error: "Task not found" });
  }

  writeData("tasks.json", filtered);
  res.json({ message: "Task deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`BuildScope API running on http://localhost:${PORT}`);
});
app.post("/api/users", (req, res) => {
  const users = readData("users.json");

  const newUser = {
    id: Date.now(),
    name: req.body.name,
    email: req.body.email
  };

  users.push(newUser);
  writeData("users.json", users);

  res.status(201).json(newUser);
});