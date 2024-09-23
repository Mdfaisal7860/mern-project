const Certificate = require('../models/Certificate');
const XLSX = require('xlsx');

// Upload and process Excel file
exports.uploadExcel = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).send('No file uploaded.');
    }

    const file = req.files.file;
    const workbook = XLSX.read(file.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Validate and save data to DB
    for (let row of worksheet) {
      const newCertificate = new Certificate({
        certificateId: row['Certificate ID'],
        studentName: row['Student Name'],
        internshipDomain: row['Internship Domain'],
        startDate: new Date(row['Start Date']),
        endDate: new Date(row['End Date']),
      });

      // Check for duplicate certificate IDs
      const existingCertificate = await Certificate.findOne({ certificateId: row['Certificate ID'] });
      if (existingCertificate) {
        console.warn(`Duplicate Certificate ID: ${row['Certificate ID']}`);
        continue; // Skip saving if duplicate
      }

      await newCertificate.save();
    }

    res.status(200).send('Data uploaded successfully.');
  } catch (err) {
    console.error('Error uploading Excel:', err);
    res.status(500).send('Internal server error during upload');
  }
};

// Retrieve certificate by ID
exports.getCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.id });
    if (!certificate) {
      return res.status(404).send('Certificate not found.');
    }
    res.status(200).json(certificate);
  } catch (err) {
    console.error('Error retrieving certificate:', err);
    res.status(500).send('Internal server error');
  }
};
