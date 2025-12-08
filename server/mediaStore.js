const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "media.json");

function load() {
  try {
    if (!fs.existsSync(DB_PATH)) return [];
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    console.error("Failed to load media DB", e);
    return [];
  }
}

function save(list) {
  fs.writeFileSync(DB_PATH, JSON.stringify(list, null, 2), "utf8");
}

function getAll() {
  return load();
}

function getById(id) {
  return load().find((m) => m.id === id) || null;
}

function add(media) {
  const list = load();
  list.push(media);
  save(list);
  return media;
}

function removeById(id) {
  const list = load();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  const removed = list.splice(idx, 1)[0];
  save(list);
  return removed;
}

module.exports = { getAll, getById, add, removeById };
