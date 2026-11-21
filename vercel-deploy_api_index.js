const express = require("express");
const cors = require("cors");

const app = express();

// In-memory store per warm serverless instance (plus client-side IndexedDB/localStorage/Firebase)
const usersStore = {};

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "devops-cloud-studio-vercel-api" });
});

app.get("/api/users/:username", (req, res) => {
  const key = req.params.username.toLowerCase();
  if (!usersStore[key]) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(usersStore[key]);
});

app.put("/api/users/:username", (req, res) => {
  const key = req.params.username.toLowerCase();
  usersStore[key] = {
    ...usersStore[key],
    ...req.body,
    username: key,
    updatedAt: new Date().toISOString()
  };
  res.json({ ok: true, user: usersStore[key] });
});

app.get("/api/users", (req, res) => {
  res.json(Object.values(usersStore));
});

module.exports = app;
