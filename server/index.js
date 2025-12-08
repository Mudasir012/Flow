const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const mediaStore = require("./mediaStore");

const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const id = uuidv4();
    const ext = path.extname(file.originalname) || "";
    cb(null, id + ext);
  },
});

const upload = multer({ storage });

app.get("/media", (req, res) => {
  const list = mediaStore.getAll();
  // Provide a public URL for each media
  const base = `${req.protocol}://${req.get("host")}`;
  const withSrc = list.map((m) => ({ ...m, src: `${base}/media/${m.id}` }));
  res.json(withSrc);
});

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const { originalname, size, filename } = req.file;
    const { duration, type } = req.body;
    const id = path.parse(filename).name; // uuid
    const media = {
      id,
      name: originalname,
      type: type || (req.file.mimetype || "").split("/")[0] || "video",
      duration: duration ? Number(duration) : null,
      size: size,
      filename,
    };
    mediaStore.add(media);
    const base = `${req.protocol}://${req.get("host")}`;
    res.json({ ...media, src: `${base}/media/${id}` });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "upload failed" });
  }
});

app.get("/media/:id", (req, res) => {
  const id = req.params.id;
  const media = mediaStore.getById(id);
  if (!media) return res.status(404).send("Not found");
  const filePath = path.join(UPLOAD_DIR, media.filename);
  if (!fs.existsSync(filePath)) return res.status(404).send("File not found");
  res.sendFile(filePath);
});

app.delete("/media/:id", (req, res) => {
  const id = req.params.id;
  const removed = mediaStore.removeById(id);
  if (!removed) return res.status(404).json({ error: "Not found" });
  const filePath = path.join(UPLOAD_DIR, removed.filename);
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (e) {
    console.warn("Failed to delete file", e);
  }
  res.json({ success: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Media server running on http://localhost:${PORT}`));
