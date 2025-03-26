const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route to call Python ML API
router.post('/predict', async (req, res) => {
  try {
    const inputData = req.body; // Input data from client

    // Call Flask API to get predictions
    const response = await axios.post('http://localhost:5000/predict', inputData);
    
    // Return predictions to client
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get predictions' });
  }
});

module.exports = router;
