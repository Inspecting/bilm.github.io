const TMDB_API_KEY = '3ade810499876bb5672f40e54960e6a2';
const OMDB_API_KEY = '9bf8cd26';
const BASE_URL = 'https://inspecting.github.io/bilm.github.io';

const moviesPerLoad = 15;
const loadedCounts = {};

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
    renderMovieSection(section, container);
  });
});

async function fetchOMDBByImdbId(imdbID) {
  try {
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_API_KEY}`);
    const data = await res.json();
    if (data.Response === 'True') return data;
  } catch (e) {
    // ignore errors
  }
  return null;
}

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
    const tmdbMovies = data.results || [];

    // We'll store unique movies by TMDB id
    const uniqueMoviesMap = new Map();

    // Add TMDB movies first
    tmdbMovies.forEach(m => uniqueMoviesMap.set(m.id, { source: 'TMDB', data: m }));

    // For each TMDB movie with imdb_id, fetch OMDB info and add if unique by imdbID
    // We fetch OMDB in parallel to speed up
    const imdbFetches = tmdbMovies.map(async (movie) => {
      if (!movie.id) return null;
      try {
        // First, get TMDB external IDs to find imdb_id
        const extRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/external_ids?api_key=${TMDB_API_KEY}`);
        const extData = await extRes.json();
        const imdbID = extData.imdb_id;
        if (imdbID) {
          const omdbData = await fetchOMDBByImdbId(imdbID);
          if (omdbData && !uniqueMoviesMap.has(omdbData.imdbID)) {
            // Add OMDB movie with a synthetic id with prefix to avoid collision
            uniqueMoviesMap.set(`omdb_${omdbData.imdbID}`, { source: 'OMDB', data: omdbData });
          }
        }
      } catch {
        // ignore errors
      }
    });

    await Promise.all(imdbFetches);

    // Clear old show-more card if exists
    const oldShowMore = rowEl.querySelector('.show-more-card');
    if (oldShowMore) oldShowMore.remove();

    // Now create cards from uniqueMoviesMap
    // We slice the number of moviesPerLoad from unique results starting from alreadyLoaded
    const uniqueMoviesArray = Array.from(uniqueMoviesMap.values());

    const moviesToShow = uniqueMoviesArray.slice(alreadyLoaded, alreadyLoaded + moviesPerLoad);

    moviesToShow.forEach(({ source, data }) => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.setAttribute('data-source', source);

      let posterSrc = 'https://via.placeholder.com/140x210?text=No+Image';
      let titleText = '';
      let clickId = '';
      if (source === 'TMDB') {
        posterSrc = data.poster_path
          ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
          : posterSrc;
        titleText = `${data.title} (${data.release_date?.slice(0, 4) || 'N/A'})`;
        clickId = data.id;
      } else if (source === 'OMDB') {
        posterSrc = (data.Poster && data.Poster !== 'N/A')
          ? data.Poster
          : posterSrc;
        titleText = `${data.Title} (${data.Year || 'N/A'})`;
        clickId = data.imdbID;
      }

      const poster = document.createElement('img');
      poster.src = posterSrc;

      const title = document.createElement('p');
      title.textContent = titleText;

      card.appendChild(poster);
      card.appendChild(title);

      card.onclick = () => {
        console.log(`Clicked movie "${titleText}" from API: ${source}`);
        if (source === 'TMDB') {
          window.location.href = `${BASE_URL}/movies/viewer.html?id=${clickId}`;
        } else {
          // OMDB doesn't have a viewer page, fallback to IMDb website
          window.open(`https://www.imdb.com/title/${clickId}/`, '_blank');
        }
      };

      rowEl.appendChild(card);
    });

    loadedCounts[section.title] = alreadyLoaded + moviesPerLoad;

    if (loadedCounts[section.title] < uniqueMoviesArray.length) {
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