import React, { useState } from 'react';
import axios from 'axios';

const CertificateSearch = () => {
  const [certificateId, setCertificateId] = useState('');
  const [certificate, setCertificate] = useState(null);
  
  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/certificates/${certificateId}`);
      setCertificate(res.data);
    } catch (err) {
      console.error(err);
      alert('Certificate not found.');
    }
  };
  
  return (
    <div>
      <h2>Search Certificate</h2>
      <input 
        type="text" 
        value={certificateId}
        onChange={(e) => setCertificateId(e.target.value)}
        placeholder="Enter Certificate ID"
      />
      <button onClick={handleSearch}>Search</button>
      {certificate && (
        <div>
          <h3>Certificate Details</h3>
          <p>Name: {certificate.studentName}</p>
          <p>Domain: {certificate.internshipDomain}</p>
          <p>Start Date: {new Date(certificate.startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(certificate.endDate).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

export default CertificateSearch;
