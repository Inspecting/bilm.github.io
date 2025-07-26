document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("navbar-placeholder");
  if (placeholder) {
    fetch("/bilm.github.io/shared/navbar.html")
      .then(res => res.text())
      .then(html => {
        placeholder.innerHTML = html;

        // After loading the HTML, activate the nav buttons
        document.querySelectorAll('nav button').forEach(btn => {
          btn.onclick = () => {
            const page = btn.dataset.page;
            if (page === 'home') {
              window.location.href = '/bilm.github.io/home/';
            } else if (page === 'movies') {
              window.location.href = '/bilm.github.io/movies/';
            } else if (page === 'tv') {
              window.location.href = '/bilm.github.io/tv-shows/';
            }
          };
        });
      })
      .catch(err => console.error("Failed to load navbar:", err));
  }
});
