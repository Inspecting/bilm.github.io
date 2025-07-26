const BASE_URL = 'https://inspecting.github.io/bilm.github.io';

export const navbarHTML = `
  <nav>
    <button data-page="home">Home</button>
    <button data-page="movies">Movies</button>
    <button data-page="tv">TV Shows</button>
  </nav>
`;

export function setupNavbar() {
  document.querySelectorAll('nav button').forEach(btn => {
    btn.onclick = () => {
      const page = btn.dataset.page;
      window.location.href = `${BASE_URL}/${page === 'home' ? 'home' : page}/`;
    };
  });
}
