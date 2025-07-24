const TMDB_API_KEY = '3ade810499876bb5672f40e54960e6a2';
const BASE_URL = 'https://inspecting.github.io/bilm.github.io';

document.addEventListener('DOMContentLoaded', () => {
  // Nav buttons
  document.querySelectorAll('nav button').forEach(btn => {
    btn.onclick = () => {
      const page = btn.dataset.page;
      if (page === 'home') {
        window.location.href = `${BASE_URL}/home/`;
      } else if (page === 'movies') {
        window.location.href = `${BASE_URL}/movies/`;
      }
    };
  });

  const sections = [
    { title: 'Trending', endpoint: '/trending/movie/week' },
    { title: 'Popular', endpoint: '/movie/popular' },
    { title: 'Top Rated', endpoint: '/movie/top_rated' },
    { title: 'Now Playing', endpoint: '/movie/now_playing' }
  ];

  const container = document.getElementById('movieSections');
  sections.forEach(section => renderMovieSection(section, container));
});

async function renderMovieSection(section, container) {
  const sectionEl = document.createElement('div');
  sectionEl.className = 'section';

  const titleEl = document.createElement('h2');
  titleEl.className = 'section-title';
  titleEl.textContent = section.title;

  const rowEl = document.createElement('div');
  rowEl.className = 'scroll-row';

  sectionEl.appendChild(titleEl);
  sectionEl.appendChild(rowEl);
  container.appendChild(sectionEl);

  try {
    const res = await fetch(`https://api.themoviedb.org/3${section.endpoint}?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    const movies = data.results.slice(0, 15);
    movies.forEach(movie => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      const poster = document.createElement('img');
      poster.src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/140x210?text=No+Image';
      const title = document.createElement('p');
      title.textContent = `${movie.title} (${movie.release_date?.slice(0, 4) || 'N/A'})`;
      card.appendChild(poster);
      card.appendChild(title);
      rowEl.appendChild(card);
    });

    const moreCard = document.createElement('div');
    moreCard.className = 'show-more-card';
    moreCard.textContent = '→';
    moreCard.onclick = () => {
      alert(`Show more for ${section.title}`);
      // Optional: implement real loading later
    };
    rowEl.appendChild(moreCard);
  } catch (err) {
    console.error(`Failed to load ${section.title}`, err);
  }
}
