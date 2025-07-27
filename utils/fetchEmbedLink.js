import axios from 'axios';
import cheerio from 'cheerio';

export async function getVipstreamEmbed(tmdbId) {
  const url = `https://vidsrc.to/embed/movie/${tmdbId}`;

  try {
    const { data: html } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(html);
    const vipIframe = $('iframe[src*="vipstream"]');
    if (vipIframe.length > 0) {
      return vipIframe.attr('src');
    }
    return null;
  } catch (err) {
    console.error("Scraping failed:", err.message);
    return null;
  }
}
