// Attach click handlers to navbar buttons for page navigation
document.querySelectorAll('nav button').forEach(btn => {
  btn.onclick = () => {
    const page = btn.dataset.page;
    if (page === 'home') {
      window.location.href = '/bilm.github.io/home/';
    } else if (page === 'movies') {
      window.location.href = '/bilm.github.io/movies/';
    } else if (page === 'tv') {
      window.location.href = '/bilm.github.io/tv-shows/';
    } else if (page === 'settings') {
      window.location.href = '/bilm.github.io/settings/';
    }
  };
});
