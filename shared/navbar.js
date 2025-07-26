document.addEventListener('DOMContentLoaded', () => {
  const BASE_URL = 'https://inspecting.github.io/bilm.github.io';

  // Handle navigation
  document.querySelectorAll('[data-page]').forEach(btn => {
    btn.onclick = () => {
      const page = btn.dataset.page;
      const pagePath = page === 'tv' ? 'tv-shows' : page;
      window.location.href = `${BASE_URL}/${pagePath}/`;
    };
  });

  // Handle search
  const searchInput = document.getElementById('navbarSearch');
  const searchBtn = document.getElementById('navbarSearchBtn');

  function doSearch() {
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `${BASE_URL}/home/search.html?q=${encodeURIComponent(query)}`;
    }
  }

  searchBtn.onclick = doSearch;
  searchInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') doSearch();
  });
});
