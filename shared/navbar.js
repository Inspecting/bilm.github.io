// Wait for DOM load (if script is added dynamically)
document.addEventListener('DOMContentLoaded', () => {
  const BASE_URL = 'https://inspecting.github.io/bilm.github.io';

  document.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      window.location.href = `${BASE_URL}/${page === 'home' ? 'home' : page === 'tv' ? 'tv-shows' : page}/`;
    });
  });
});
