import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

// Embed route returning Vidsrc embed URL
app.get('/embed/:id', (req, res) => {
  const movieId = req.params.id;

  // Construct the Vidsrc embed URL
  const embedUrl = `https://vidsrc.to/embed/movie/${movieId}`;

  res.json({ embed: embedUrl });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
