const BASE_URL = 'https://inspecting.github.io/bilm.github.io';

document.addEventListener('DOMContentLoaded', () => {
  // Redirect buttons
  document.querySelectorAll('nav button').forEach(button => {
    button.addEventListener('click', () => {
      const page = button.getAttribute('data-page');

      if (page === 'home') {
        window.location.href = `${BASE_URL}/home/`;
      } else if (page === 'movies') {
        window.location.href = `${BASE_URL}/movies/`;
      } else if (page === 'tv-shows') {
        window.location.href = `${BASE_URL}/tv-shows/`;
      } else if (page === 'settings') {
        window.location.href = `${BASE_URL}/settings/`;
      } else {
        alert(`Unknown page: ${page}`);
      }
    });
  });

  // Search Movie
  const searchMovieBtn = document.getElementById('searchMovie');
  const searchInput = document.getElementById('searchInput');

  if (searchMovieBtn && searchInput) {
    searchMovieBtn.onclick = () => {
      const query = searchInput.value.trim();
      if (!query) return alert('Please enter a search term');
      window.location.href = `${BASE_URL}/movies/?search=${encodeURIComponent(query)}`;
    };
  }

  // Placeholder TV search
  const searchTVBtn = document.getElementById('searchTV');
  if (searchTVBtn) {
    searchTVBtn.onclick = () => {
      alert('TV search not implemented yet.');
    };
  }
});
