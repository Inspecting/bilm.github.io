document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('introOverlay');
  const header = document.querySelector('header');
  const main = document.querySelector('main');

  setTimeout(() => {
    intro.style.opacity = '0';
    setTimeout(() => {
      intro.style.display = 'none';
      header.classList.add('visible');
      main.classList.add('visible');
    }, 500);
  }, 500);

  document.getElementById('searchMovie').onclick = () => {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return alert("Enter a movie name!");
    window.location.href = `/bilm.github.io/movies/?query=${encodeURIComponent(query)}`;
  };

  document.getElementById('searchTV').onclick = () => {
    alert("TV search coming soon");
  };
});
