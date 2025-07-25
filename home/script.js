const TMDB_API_KEY = '3ade810499876bb5672f40e54960e6a2';

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  const searchInput = document.getElementById('searchInput');
  const searchMovieBtn = document.getElementById('searchMovie');
  const searchTVBtn = document.getElementById('searchTV');
  const versionLabel = document.getElementById('versionLabel');

  header.style.opacity = '1';
  main.style.opacity = '1';
  if (versionLabel) versionLabel.textContent = 'Bilm v1.0';

  document.querySelectorAll('nav button').forEach(btn => {
    btn.onclick = () => {
      const page = btn.dataset.page;
      if (page === 'home') {
        window.location.href = 'https://inspecting.github.io/bilm.github.io/home/';
      } else if (page === 'movies') {
        window.location.href = 'https://inspecting.github.io/bilm.github.io/movies/';
      } else if (page === 'tv') {
        window.location.href = 'https://inspecting.github.io/bilm.github.io/tv-shows/';
      }
    };
  });

  searchMovieBtn.onclick = () => {
    const query = searchInput.value.trim();
    if (!query) return alert('Please enter a search term');
    window.location.href = `https://inspecting.github.io/bilm.github.io/movies/?search=${encodeURIComponent(query)}`;
  };

  searchTVBtn.onclick = () => {
    alert('TV search not implemented yet.');
  };
});
