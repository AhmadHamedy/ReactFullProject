const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());

// ======================
// UPLOADS FOLDER
// ======================
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

app.use("/uploads", express.static(uploadPath));

// ======================
// DATABASE
// ======================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "restaurant_db",
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.log("❌ MySQL error:", err.message);
    return;
  }
  console.log("✅ MySQL connected");
});

// ======================
// MULTER
// ======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ======================
// ROUTES
// ======================

// ✅ GET ALL ITEMS (FIX)
app.get("/api/menu", (req, res) => {
  db.query("SELECT * FROM menu_items", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// GET ONE ITEM
app.get("/api/menu/:id", (req, res) => {
  db.query(
    "SELECT * FROM menu_items WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0)
        return res.status(404).json({ message: "Item not found" });
      res.json(result[0]);
    }
  );
});

// ADD ITEM
app.post("/api/menu", upload.single("image"), (req, res) => {
  const { name, description, price } = req.body;
  const category = req.body.category || "food";

  if (!req.file) {
    return res.status(400).json({ message: "Image required" });
  }

  const image_url = `/uploads/${req.file.filename}`;

  const sql =
    "INSERT INTO menu_items (name, description, image_url, price, category) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sql,
    [name, description, image_url, price, category],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Item added", id: result.insertId });
    }
  );
});

// DELETE ITEM
app.delete("/api/menu/:id", (req, res) => {
  db.query(
    "DELETE FROM menu_items WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Item deleted" });
    }
  );
});

// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});