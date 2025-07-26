const BASE_URL = 'https://inspecting.github.io/bilm.github.io';

// Call this once after navbar is loaded
function setupNavbarListeners() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      if (page === 'home') window.location.href = `${BASE_URL}/home/`;
      else if (page === 'movies') window.location.href = `${BASE_URL}/movies/`;
      else if (page === 'tv') window.location.href = `${BASE_URL}/tv-shows/`;
    });
  });
}
