document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('introOverlay');
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  const API_KEY = '3ade810499876bb5672f40e54960e6a2';

  // Intro animation
  setTimeout(() => {
    intro.style.opacity = '0';
    setTimeout(() => {
      intro.style.display = 'none';
      header.classList.add('visible');
      main.classList.add('visible');
    }, 500);
  }, 1000);

  // Nav button logic (stub)
  document.querySelectorAll('nav button').forEach(btn => {
    btn.onclick = () => {
      alert('Page switching not implemented yet: ' + btn.dataset.page);
    };
  });

  // Overlay
  const overlay = document.getElementById('overlay');
  const closeOverlay = document.getElementById('closeOverlay');
  const videoFrame = document.getElementById('videoFrame');

  closeOverlay.onclick = () => {
    videoFrame.src = '';
    overlay.style.display = 'none';
  };

  // Search Movie
  document.getElementById('searchMovie').onclick = async () => {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return alert('Enter a movie name');
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log('Movies:', data.results);
    alert(`Found ${data.results.length} movie(s). Check console.`);
  };

  // Search TV
  document.getElementById('searchTV').onclick = async () => {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return alert('Enter a TV show name');
    const url = `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log('TV Shows:', data.results);
    alert(`Found ${data.results.length} show(s). Check console.`);
  };
});
