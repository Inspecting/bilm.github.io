const BASE_URL = 'https://inspecting.github.io/bilm.github.io';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('nav button').forEach(btn => {
    btn.onclick = () => {
      const page = btn.dataset.page;
      window.location.href = `${BASE_URL}/${page}/`;
    };
  });

  const searchMovieBtn = document.getElementById('searchMovie');
  const searchTVBtn = document.getElementById('searchTV');
  const searchInput = document.getElementById('searchInput');

  searchMovieBtn.onclick = () => {
    const query = searchInput.value.trim();
    if (!query) return alert('Please enter a search term');
    window.location.href = `${BASE_URL}/movies/?search=${encodeURIComponent(query)}`;
  };

  searchTVBtn.onclick = () => {
    alert('TV search not implemented yet.');
  };
});
