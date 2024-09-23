const express = require('express');
const router = express.Router();
const { uploadExcel, getCertificate } = require('../controllers/certificateController');

// POST route to upload Excel file
router.post('/upload', uploadExcel);

// GET route to fetch certificate by ID
router.get('/:id', getCertificate);

module.exports = router;
