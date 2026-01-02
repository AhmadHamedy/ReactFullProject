require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}
app.use("/uploads", express.static(uploadPath));


const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect((err) => {
  if (err) {
    console.error(" MySQL error:", err.message);
    return;
  }
  console.log(" MySQL connected");
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });


function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header)
    return res.status(401).json({ message: "Login required" });

  const token = header.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}


app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt for: ${email}`); 

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json(err);
      }
      
      if (!result.length) {
        console.log("User not found in database");
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = result[0];

      if (password !== user.password) {
        console.log(`Password mismatch: Received ${password}, expected ${user.password}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      console.log("Login successful!");
      res.json({ token });
    }
  );
});

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


app.post("/api/menu", auth, upload.single("image"), (req, res) => {
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


app.delete("/api/menu/:id", auth, (req, res) => {
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
  console.log(" Server running on port", PORT)
);
