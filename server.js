const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 8000;

const CLIENT_ID = 'u-s4t2ud-3cd946f76d5e4f4cb864f92d1cb885ad6108aa5a32412c10ca9219d02dfdea41';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:8000/auth/42';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'index.html'));
});

app.get('/auth/42', async (req, res) => {
  const code = req.query.code;
  try {
    const response = await axios.post('https://api.intra.42.fr/oauth/token', {
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
    });
    const accessToken = response.data.access_token;
    const userResponse = await axios.get('https://api.intra.42.fr/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userData = userResponse.data;
    res.json(userData);
  } catch (error) {
    res.status(500).send('Authentication failed');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
