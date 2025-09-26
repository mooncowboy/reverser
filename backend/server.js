const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Reverser Backend API is running!' });
});

// Reverse string endpoint
app.post('/reverse', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        error: 'Text is required',
        reversed: ''
      });
    }
    
    const reversed = text.split('').reverse().join('');
    
    res.json({
      original: text,
      reversed: reversed
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Internal server error',
      reversed: ''
    });
  }
});

// GET endpoint for reverse (alternative)
app.get('/reverse/:text', (req, res) => {
  try {
    const { text } = req.params;
    
    if (!text) {
      return res.status(400).json({ 
        error: 'Text is required',
        reversed: ''
      });
    }
    
    const reversed = text.split('').reverse().join('');
    
    res.json({
      original: text,
      reversed: reversed
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Internal server error',
      reversed: ''
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});