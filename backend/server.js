const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require('multer'); // For handling file uploads
const path = require('path');
const fs = require('fs');
const { request } = require("http");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
// app.use(fileUpload())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.json({ limit: "50mb" }));

app.use(express.urlencoded({ extended: true }));




const port = 5000;

// Enable CORS for React Native app
app.use(cors());
app.use(express.json()); // To parse JSON request bodies
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// MySQL database connection
const db = mysql.createConnection({
  host: "localhost", // Your MySQL host
  user: "root", // Your MySQL username
  password: "", // Your MySQL password
  database: "vendor_management", // Replace with your actual database name
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database");
});

// Endpoint to get all vendors
app.get("/vendors", (req, res) => {
  const query = "SELECT * FROM vendors";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching vendors:", err);
      return res.status(500).json({ error: "Failed to fetch vendors" });
    }
    res.json(results);
  });
});

// Endpoint to add a new vendor
app.post("/vendors", (req, res) => {
  const { name, username, email, password } = req.body;
  const query = `INSERT INTO vendors (name, username, email, password) VALUES (?, ?, ?, ?)`;

  db.query(query, [name, username, email, password], (err, results) => {
    if (err) {
      console.error("Error adding vendor:", err);
      return res.status(500).json({ error: "Failed to add vendor" });
    }
    res.status(201).json({ message: "Vendor added successfully" });
  });
});

// Endpoint to delete a vendor by id
app.delete("/vendors/:id", (req, res) => {
  const vendorId = req.params.id;
  const query = `DELETE FROM vendors WHERE id = ?`;

  db.query(query, [vendorId], (err, results) => {
    if (err) {
      console.error("Error deleting vendor:", err);
      return res.status(500).json({ error: "Failed to delete vendor" });
    }
    res.status(200).json({ message: "Vendor deleted successfully" });
  });
});




















// Vendor login route
app.post('/vendor/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM vendors WHERE email = ? AND password = ?';

  db.query(query, [email, password], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Database query error' });
      }

      if (results.length > 0) {
          const user = results[0];
          res.json({ message: `Welcome, ${user.name}!`, vendor: user });
      } else {
          res.status(401).json({ error: 'Invalid email or password' });
      }
  });
});


















// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ dest: 'uploads/' });

// Endpoint to upload a picture
app.post('/vendor/upload',upload.single('file'), (req, res) => {
  console.log(req.file) 
  res.status(200)
  return  

  const vendorId = req.body.vendorId;
  const picturePath = req.file.filename;
  //155

const query = 'INSERT INTO pictures (vendor_id, path) VALUES (?, ?)';
  db.query(query, [vendorId, picturePath], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to upload picture.' });
    }
    res.status(200).json({ message: 'Picture uploaded successfully.' });
  });
});

// Endpoint to fetch pictures by vendor ID
app.get('/vendor/pictures/:vendorId', (req, res) => {
  const vendorId = req.params.vendorId;
  const query = 'SELECT * FROM pictures WHERE vendor_id = ?';

  db.query(query, [vendorId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch pictures.' });
    }
    res.status(200).json(results);
  });
});

// Endpoint to delete a picture by ID
app.delete('/vendor/pictures/:pictureId', (req, res) => {
  const pictureId = req.params.pictureId;
  const query = 'SELECT path FROM pictures WHERE id = ?';

  db.query(query, [pictureId], (err, result) => {
    if (err || result.length === 0) {
      return res.status(500).json({ error: 'Failed to find picture.' });
    }

    const filePath = `./uploads/${result[0].path}`;
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) {
        return res.status(500).json({ error: 'Failed to delete file.' });
      }

      const deleteQuery = 'DELETE FROM pictures WHERE id = ?';
      db.query(deleteQuery, [pictureId], (deleteErr) => {
        if (deleteErr) {
          return res.status(500).json({ error: 'Failed to delete picture from database.' });
        }
        res.status(200).json({ message: 'Picture deleted successfully.' });
      });
    });
  });
});

















// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
