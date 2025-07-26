const TMDB_API_KEY = '3ade810499876bb5672f40e54960e6a2';
const OMDB_API_KEY = '9bf8cd26';
const BASE_URL = 'https://inspecting.github.io/bilm.github.io';

const moviesPerLoad = 15;
const loadedCounts = {};
const addedMoviesBySection = {};

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Movie script loaded and DOM ready');

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
    addedMoviesBySection[section.title] = new Set();
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

    for (const movie of movies.slice(0, moviesPerLoad)) {
      const uniqueKey = `${movie.title}-${movie.release_date?.slice(0, 4)}`;
      if (addedMoviesBySection[section.title].has(uniqueKey)) continue;

      let poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null;

      // Try getting IMDb ID and then OMDB data
      const imdbId = await getImdbIdFromTmdb(movie.id);
      if (imdbId) {
        const omdbData = await fetchOmdbData(imdbId);
        if (omdbData?.Poster && omdbData.Poster !== 'N/A') {
          poster = omdbData.Poster;
        }
      }

      const card = document.createElement('div');
      card.className = 'movie-card';

      const posterImg = document.createElement('img');
      posterImg.src = poster || 'https://via.placeholder.com/140x210?text=No+Image';

      const title = document.createElement('p');
      title.textContent = `${movie.title} (${movie.release_date?.slice(0, 4) || 'N/A'})`;

      card.appendChild(posterImg);
      card.appendChild(title);

      card.onclick = () => {
        window.location.href = `${BASE_URL}/movies/viewer.html?id=${movie.id}`;
      };

      rowEl.appendChild(card);
      addedMoviesBySection[section.title].add(uniqueKey);
    }

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
    console.error('❌ Failed loading', section.title, err);
  }
}

async function getImdbIdFromTmdb(tmdbId) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    return data.imdb_id;
  } catch (e) {
    return null;
  }
}

async function fetchOmdbData(imdbId) {
  try {
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`);
    const data = await res.json();
    return data;
  } catch (e) {
    return null;
  }
}