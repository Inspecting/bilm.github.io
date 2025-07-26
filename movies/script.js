const TMDB_API_KEY = '3ade810499876bb5672f40e54960e6a2';
const BASE_URL = 'https://inspecting.github.io/bilm.github.io';

const moviesPerLoad = 15;
const loadedCounts = {};

document.addEventListener('DOMContentLoaded', () => {
  // Wait a moment for navbar to load before attaching listeners
  setTimeout(() => {
    document.querySelectorAll('nav button').forEach(btn => {
      btn.onclick = () => {
        const page = btn.dataset.page;
        if (page === 'home') {
          window.location.href = `${BASE_URL}/home/`;
        } else if (page === 'movies') {
          window.location.href = `${BASE_URL}/movies/`;
        } else if (page === 'tv') {
          window.location.href = `${BASE_URL}/tv-shows/`;
        }
      };
    });
  }, 100);

  const sections = [
    { title: 'Trending', endpoint: '/trending/movie/week' },
    { title: 'Popular', endpoint: '/movie/popular' },
    { title: 'Top Rated', endpoint: '/movie/top_rated' },
    { title: 'Now Playing', endpoint: '/movie/now_playing' },
    { title: 'Action', endpoint: '/discover/movie?with_genres=28' },
    { title: 'Adventure', endpoint: '/discover/movie?with_genres=12' },
    { title: 'Animation', endpoint: '/discover/movie?with_genres=16' },
    { title: 'Comedy', endpoint: '/discover/movie?with_genres=35' },
    { title: 'Crime', endpoint: '/discover/movie?with_genres=80' },
    { title: 'Drama', endpoint: '/discover/movie?with_genres=18' },
    { title: 'Fantasy', endpoint: '/discover/movie?with_genres=14' },
    { title: 'Horror', endpoint: '/discover/movie?with_genres=27' },
    { title: 'Mystery', endpoint: '/discover/movie?with_genres=9648' },
    { title: 'Romance', endpoint: '/discover/movie?with_genres=10749' },
    { title: 'Science Fiction', endpoint: '/discover/movie?with_genres=878' },
    { title: 'Thriller', endpoint: '/discover/movie?with_genres=53' }
  ];

  const container = document.getElementById('movieSections');
  sections.forEach(section => {
    loadedCounts[section.title] = 0;
    renderMovieSection(section, container);
  });
});

async function renderMovieSection(section, container) {
  let sectionEl = document.getElementById(`section-${section.title.replace(/\s/g, '')}`);
  let rowEl;

  if (!sectionEl) {
    sectionEl = document.createElement('div');
    sectionEl.className = 'section';
    sectionEl.id = `section-${section.title.replace(/\s/g, '')}`;

    const titleEl = document.createElement('h2');
    titleEl.className = 'section-title';
    titleEl.textContent = section.title;

    rowEl = document.createElement('div');
    rowEl.className = 'scroll-row';
    rowEl.id = `row-${section.title.replace(/\s/g, '')}`;

    sectionEl.appendChild(titleEl);
    sectionEl.appendChild(rowEl);
    container.appendChild(sectionEl);
  } else {
    rowEl = sectionEl.querySelector('.scroll-row');
  }

  try {
    const alreadyLoaded = loadedCounts[section.title] || 0;
    const page = Math.floor(alreadyLoaded / moviesPerLoad) + 1;

    const url = section.endpoint.includes('?')
      ? `https://api.themoviedb.org/3${section.endpoint}&api_key=${TMDB_API_KEY}&page=${page}`
      : `https://api.themoviedb.org/3${section.endpoint}?api_key=${TMDB_API_KEY}&page=${page}`;

    const res = await fetch(url);
    const data = await res.json();

    const oldShowMore = rowEl.querySelector('.show-more-card');
    if (oldShowMore) oldShowMore.remove();

    const movies = data.results || [];

    movies.slice(0, moviesPerLoad).forEach(movie => {
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

      card.onclick = () => {
        window.location.href = `${BASE_URL}/movies/viewer.html?id=${movie.id}`;
      };

      rowEl.appendChild(card);
    });

    loadedCounts[section.title] = alreadyLoaded + moviesPerLoad;

    if (loadedCounts[section.title] < data.total_results) {
      const moreCard = document.createElement('div');
      moreCard.className = 'show-more-card';
      moreCard.textContent = '→';
      moreCard.title = `Show more ${section.title}`;
      moreCard.onclick = () => {
        renderMovieSection(section, container);
      };
      rowEl.appendChild(moreCard);
    }
  } catch (err) {
    console.error('Failed loading', section.title, err);
  }
}
