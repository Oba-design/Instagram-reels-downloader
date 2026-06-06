const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/api/video', async (req, res) => {
  const postUrl = req.query.postUrl;
  if (!postUrl) return res.status(400).json({ error: 'postUrl is required' });

  try {
    const encoded = encodeURIComponent(postUrl);
    const apiRes = await fetch(`https://snapinsta.app/api/ajax`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0',
      },
      body: `url=${encoded}&lang=en`,
    });

    const text = await apiRes.text();
    const match = text.match(/https:\/\/[^"'\s]+\.mp4[^"'\s]*/);
    if (!match) return res.status(404).json({ error: 'No video found' });

    res.json({
      status: 'success',
      data: { videoUrl: match[0] }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Running on port 3000'));
