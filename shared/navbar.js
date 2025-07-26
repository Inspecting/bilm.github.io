const BASE_URL = 'https://inspecting.github.io/bilm.github.io';

// Nav button clicks (logo too)
document.querySelectorAll('[data-page]').forEach(btn => {
  btn.onclick = () => {
    const page = btn.dataset.page;
    if (page === 'home') window.location.href = `${BASE_URL}/home/`;
    else if (page === 'movies') window.location.href = `${BASE_URL}/movies/`;
    else if (page === 'tv') window.location.href = `${BASE_URL}/tv-shows/`;
    else if (page === 'settings') window.location.href = `${BASE_URL}/settings/`;
  };
});

// Search functionality
document.getElementById('searchBtn')?.addEventListener('click', () => {
  const query = document.getElementById('searchInput')?.value?.trim();
  if (query) {
    window.location.href = `${BASE_URL}/home/search.html?query=${encodeURIComponent(query)}`;
  }
});

document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('searchBtn')?.click();
  }
});
