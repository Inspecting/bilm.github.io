// /shared/navbar.js
document.addEventListener('DOMContentLoaded', () => {
  const placeholder = document.getElementById('navbar-placeholder');

  if (!placeholder) return;

  fetch('/bilm.github.io/shared/navbar.html')
    .then(res => res.text())
    .then(html => {
      placeholder.innerHTML = html;

      // Navigation behavior
      const base = 'https://inspecting.github.io/bilm.github.io';
      document.querySelectorAll('nav button').forEach(btn => {
        const page = btn.dataset.page;
        btn.onclick = () => {
          if (page === 'home') window.location.href = `${base}/home/`;
          else if (page === 'movies') window.location.href = `${base}/movies/`;
          else if (page === 'tv') window.location.href = `${base}/tv-shows/`;
        };
      });
    });
});
