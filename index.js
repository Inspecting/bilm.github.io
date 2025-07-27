import express from 'express';
import { getVipstreamEmbed } from './utils/fetchEmbedLink.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/embed/:tmdbId', async (req, res) => {
  const { tmdbId } = req.params;
  const embedUrl = await getVipstreamEmbed(tmdbId);
  if (embedUrl) {
    res.json({ embed: embedUrl });
  } else {
    res.status(404).json({ error: 'Embed link not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Scraper API running at http://localhost:${PORT}`);
});
