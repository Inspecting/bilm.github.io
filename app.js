// app.js
(() => {
  const TMDB_API_KEY = "3ade810499876bb5672f40e54960e6a2";

  const introOverlay = document.getElementById('introOverlay');
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  const searchContainer = document.getElementById('searchContainer');
  const searchInput = document.getElementById('searchInput');
  const searchMovieBtn = document.getElementById('searchMovie');
  const searchTVBtn = document.getElementById('searchTV');
  const overlay = document.getElementById('overlay');
  const closeOverlayBtn = document.getElementById('closeOverlay');
  const videoFrame = document.getElementById('videoFrame');
  const navButtons = document.querySelectorAll('nav button');

  // Fade out intro after 0.5s, then hide it and show header+main
  setTimeout(() => {
    introOverlay.style.opacity = '0';
    introOverlay.addEventListener('transitionend', () => {
      introOverlay.style.display = 'none';
      header.classList.add('visible');
      main.classList.add('visible');
    }, { once: true });
  }, 500);

  closeOverlayBtn.onclick = () => {
    videoFrame.src = '';
    overlay.style.display = 'none';
  };

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      alert('Page switching not yet implemented: ' + btn.dataset.page);
    });
  });

  searchMovieBtn.onclick = () => {
    alert('Movie search not yet connected');
  };

  searchTVBtn.onclick = () => {
    alert('TV search not yet connected');
  };

})();
