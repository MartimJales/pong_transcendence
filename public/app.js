const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to serve index2.html
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to serve login.html
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Route to serve authenticated.html
app.get('/authenticated.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'authenticated.html'));
});

// Route to serve 42_auth.html
app.get('/auth/42', (req, res) => {
  res.sendFile(path.join(__dirname, '42_auth.html'));
});

// Start the server
app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000');
});
