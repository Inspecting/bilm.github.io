const TMDB_API_KEY = '3ade810499876bb5672f40e54960e6a2';
const BASE_URL = 'https://inspecting.github.io/bilm.github.io';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchMovieBtn = document.getElementById('searchMovie');
  const searchTVBtn = document.getElementById('searchTV');

  // Nav click handlers
  document.querySelectorAll('nav button').forEach(btn => {
    btn.onclick = () => {
      const page = btn.dataset.page;
      if (page === 'home') {
        window.location.href = `${BASE_URL}/home/`;
      } else if (page === 'movies') {
        window.location.href = `${BASE_URL}/movies/`;
      } else if (page === 'tv-shows') {
        window.location.href = `${BASE_URL}/tv-shows/`;
      } else if (page === 'settings') {
        window.location.href = `${BASE_URL}/settings/`;
      }
    };
  });

  searchMovieBtn.onclick = () => {
    const query = searchInput.value.trim();
    if (!query) return alert('Please enter a search term');
    window.location.href = `${BASE_URL}/movies/?search=${encodeURIComponent(query)}`;
  };

  searchTVBtn.onclick = () => {
    alert('TV search not implemented yet.');
  };
});
