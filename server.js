import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Initialize data file if missing
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ roster: null, games: null }));
}

function readStore() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writeStore(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.use(express.json({ limit: "1mb" }));

// Serve built frontend in production
const distPath = path.join(__dirname, "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// GET all data
app.get("/api/data", (_req, res) => {
  res.json(readStore());
});

// PUT roster
app.put("/api/roster", (req, res) => {
  const store = readStore();
  store.roster = req.body;
  writeStore(store);
  res.json({ ok: true });
});

// PUT games
app.put("/api/games", (req, res) => {
  const store = readStore();
  store.games = req.body;
  writeStore(store);
  res.json({ ok: true });
});

// SPA fallback
if (fs.existsSync(distPath)) {
  app.get("/{*path}", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
