require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// uploads
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}
app.use("/uploads", express.static(uploadPath));

// db
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL error:", err.message);
    return;
  }
  console.log("✅ MySQL connected");
});

// multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// routes
app.get("/api/menu", (req, res) => {
  db.query("SELECT * FROM menu", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get("/api/menu/:id", (req, res) => {
  db.query(
    "SELECT * FROM menu WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (!result.length)
        return res.status(404).json({ message: "Item not found" });
      res.json(result[0]);
    }
  );
});

app.post("/api/menu", upload.single("image"), (req, res) => {
  const { name, description, price, category = "food" } = req.body;
  if (!req.file)
    return res.status(400).json({ message: "Image required" });

  const image_url = `/uploads/${req.file.filename}`;

  db.query(
    "INSERT INTO menu (name, description, image_url, price, category) VALUES (?, ?, ?, ?, ?)",
    [name, description, image_url, price, category],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Item added", id: result.insertId });
    }
  );
});

app.delete("/api/menu/:id", (req, res) => {
  db.query(
    "DELETE FROM menu WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Item deleted" });
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log("🚀 Server running on port", PORT)
);
