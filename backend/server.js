const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

// MongoDB Connection
mongoose.connect('mongodb+srv://faisal:faisal@cluster0.quz9i.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds timeout
  bufferCommands: false // Disable command buffering
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit if database connection fails
  });

// Import Routes
const certificateRoutes = require('./routes/certificateRoutes');
app.use('/api/certificates', certificateRoutes);

app.get('/', (req, res) => {
  res.send("Welcome to certificate management system");
});

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
