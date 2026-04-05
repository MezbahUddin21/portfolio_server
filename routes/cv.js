const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for CV upload
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, 'cv' + path.extname(file.originalname));
  }
});

const cvUpload = multer({
  storage: cvStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed.'));
    }
  }
});

// Upload CV
router.post('/upload', cvUpload.single('cv'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded'});
    }
    res.json({ message: 'CV uploaded successfully', filename: req.file.filename});
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error });
  }
});


// Download CV
router.get('/download', (req, res) => {
  const primaryPath = path.join(__dirname, '../uploads/cv.pdf');
  const fallbackPath = fs.readdirSync(path.join(__dirname, '../uploads')).find(file => file.toLowerCase().startsWith('cv') && file.toLowerCase().endsWith('.pdf'));

  if (fs.existsSync(primaryPath)) {
    return res.download(primaryPath, 'CV.pdf');
  }

  if (fallbackPath) {
    const filePath = path.join(__dirname, '../uploads', fallbackPath);
    return res.download(filePath, 'CV.pdf');
  }

  return res.status(404).json({ message: 'CV not found' });
});

module.exports = router;


