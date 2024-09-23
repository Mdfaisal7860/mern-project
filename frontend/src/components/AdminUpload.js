import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Make sure to install this package

const AdminUpload = () => {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(selectedFile);
      setErrorMessage(''); // Clear previous error message
      setSuccessMessage(''); // Clear success message
    } else {
      setErrorMessage('Please upload a valid Excel file (.xlsx).');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    // Read the file to check for required fields
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Assuming the required fields are in the first sheet
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      // Validate required fields
      const missingFields = jsonData.filter(row => !row.symbol || !row.expiry_date); // Adjust according to your fields
      if (missingFields.length > 0) {
        setErrorMessage('Missing required fields in the uploaded file.');
        return;
      }

      // Prepare formData for upload
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await axios.post('http://localhost:5000/api/certificates/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 60000
        });
        setSuccessMessage('Upload successful: ' + res.data);
      } catch (err) {
        if (err.response) {
          setErrorMessage('Upload failed: ' + err.response.data);
        } else {
          setErrorMessage('Upload failed: ' + err.message);
        }
        console.error(err);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h2>Admin Upload</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default AdminUpload;
