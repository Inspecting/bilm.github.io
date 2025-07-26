document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  header.style.opacity = '1';
  main.style.opacity = '1';

  searchBtn.onclick = () => {
    const query = searchInput.value.trim();
    if (!query) return alert('Please enter a search term');
    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
  };
});
