const TMDB_API_KEY = '3ade810499876bb5672f40e54960e6a2';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w300';
const movieSections = document.getElementById('movieSections');

const categories = [
  { id: 'trending', label: '🔥 Trending', endpoint: `/trending/movie/week` },
  { id: 'popular', label: '🌟 Popular', endpoint: `/movie/popular` },
  { id: 'now_playing', label: '🎬 Now Playing', endpoint: `/movie/now_playing` },
  { id: 'upcoming', label: '⏭ Upcoming', endpoint: `/movie/upcoming` },
];

document.addEventListener('DOMContentLoaded', () => {
  // Header fade-in
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  if (header) header.classList.add('visible');
  if (main) main.classList.add('visible');

  // Nav button actions
  document.querySelectorAll('nav button').forEach(btn => {
    btn.onclick = () => {
      const page = btn.dataset.page;
      if (page === 'home') window.location.href = 'https://inspecting.github.io/bilm.github.io/home/';
      if (page === 'movies') window.location.href = 'https://inspecting.github.io/bilm.github.io/movies/';
    };
  });

  // Load each category section
  categories.forEach(section => {
    createSection(section);
  });
});

function createSection({ id, label, endpoint }) {
  const section = document.createElement('div');
  section.className = 'section';

  section.innerHTML = `
    <div class="section-title">
      <span>${label}</span>
      <span class="scroll-arrow" onclick="document.getElementById('${id}Row').scrollBy({ left: 300, behavior: 'smooth' })">→</span>
    </div>
    <div class="scroll-row" id="${id}Row"></div>
  `;

  movieSections.appendChild(section);
  fetchMovies(endpoint, id);
}

async function fetchMovies(endpoint, rowId) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
    const data = await res.json();
    const movies = data.results.slice(0, 15);
    renderMovies(movies, rowId);
  } catch (err) {
    console.error(`Failed to load ${rowId}`, err);
  }
}

function renderMovies(movies, rowId) {
  const row = document.getElementById(rowId + 'Row');
  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';

    const poster = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : 'https://via.placeholder.com/140x210?text=No+Image';
    const year = movie.release_date ? movie.release_date.slice(0, 4) : '----';

    card.innerHTML = `
      <img src="${poster}" alt="${movie.title}" />
      <p>${movie.title} (${year})</p>
    `;

    row.appendChild(card);
  });
}
