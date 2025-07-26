document.addEventListener('DOMContentLoaded', () => {
  const navbarPath = '/bilm.github.io/shared/navbar.html';
  fetch(navbarPath)
    .then(response => response.text())
    .then(html => {
      const container = document.getElementById('navbar-placeholder');
      if (container) {
        container.innerHTML = html;

        // Hook nav buttons
        document.querySelectorAll('nav button').forEach(btn => {
          const page = btn.dataset.page;
          btn.addEventListener('click', () => {
            const base = 'https://inspecting.github.io/bilm.github.io';
            if (page === 'home') window.location.href = `${base}/home/`;
            else if (page === 'movies') window.location.href = `${base}/movies/`;
            else if (page === 'tv') window.location.href = `${base}/tv-shows/`;
          });
        });
      }
    })
    .catch(err => console.error('Navbar failed to load:', err));
});
