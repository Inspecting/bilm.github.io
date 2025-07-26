const TMDB_API_KEY = '3ade810499876bb5672f40e54960e6a2';
const OMDB_API_KEY = '9bf8cd26';
const BASE_URL = 'https://inspecting.github.io/bilm.github.io';

const showsPerLoad = 15;
const loadedCounts = {};
const addedShowsBySection = {};

document.addEventListener('DOMContentLoaded', () => {
  const sections = [
    { title: 'Trending', endpoint: '/trending/tv/week' },
    { title: 'Popular', endpoint: '/tv/popular' },
    { title: 'Top Rated', endpoint: '/tv/top_rated' },
    { title: 'Airing Today', endpoint: '/tv/airing_today' },
    { title: 'Action & Adventure', endpoint: '/discover/tv?with_genres=10759' },
    { title: 'Animation', endpoint: '/discover/tv?with_genres=16' },
    { title: 'Comedy', endpoint: '/discover/tv?with_genres=35' },
    { title: 'Crime', endpoint: '/discover/tv?with_genres=80' },
    { title: 'Drama', endpoint: '/discover/tv?with_genres=18' },
    { title: 'Family', endpoint: '/discover/tv?with_genres=10751' },
    { title: 'Kids', endpoint: '/discover/tv?with_genres=10762' },
    { title: 'Mystery', endpoint: '/discover/tv?with_genres=9648' },
    { title: 'Reality', endpoint: '/discover/tv?with_genres=10764' },
    { title: 'Sci-Fi & Fantasy', endpoint: '/discover/tv?with_genres=10765' },
    { title: 'Soap', endpoint: '/discover/tv?with_genres=10766' },
    { title: 'Talk', endpoint: '/discover/tv?with_genres=10767' },
    { title: 'War & Politics', endpoint: '/discover/tv?with_genres=10768' },
    { title: 'Western', endpoint: '/discover/tv?with_genres=37' }
  ];

  const container = document.getElementById('tvSections');
  sections.forEach(section => {
    loadedCounts[section.title] = 0;
    addedShowsBySection[section.title] = new Set();
    renderTVSection(section, container);
  });
});

async function renderTVSection(section, container) {
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
    const page = Math.floor(alreadyLoaded / showsPerLoad) + 1;

    const url = section.endpoint.includes('?')
      ? `https://api.themoviedb.org/3${section.endpoint}&api_key=${TMDB_API_KEY}&page=${page}`
      : `https://api.themoviedb.org/3${section.endpoint}?api_key=${TMDB_API_KEY}&page=${page}`;

    const res = await fetch(url);
    const data = await res.json();

    const oldShowMore = rowEl.querySelector('.show-more-card');
    if (oldShowMore) oldShowMore.remove();

    const shows = data.results || [];

    for (const show of shows.slice(0, showsPerLoad)) {
      const uniqueKey = `${show.name}-${show.first_air_date?.slice(0, 4)}`;
      if (addedShowsBySection[section.title].has(uniqueKey)) continue;

      let poster = show.poster_path
        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
        : null;

      const imdbId = await getImdbIdFromTmdbTV(show.id);
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
      title.textContent = `${show.name} (${show.first_air_date?.slice(0, 4) || 'N/A'})`;

      card.appendChild(posterImg);
      card.appendChild(title);

      card.onclick = () => {
        window.location.href = `${BASE_URL}/tv-shows/viewer.html?id=${show.id}`;
      };

      rowEl.appendChild(card);
      addedShowsBySection[section.title].add(uniqueKey);
    }

    loadedCounts[section.title] = alreadyLoaded + showsPerLoad;

    if (loadedCounts[section.title] < data.total_results) {
      const moreCard = document.createElement('div');
      moreCard.className = 'show-more-card';
      moreCard.textContent = '→';
      moreCard.title = `Show more ${section.title}`;
      moreCard.onclick = () => {
        renderTVSection(section, container);
      };
      rowEl.appendChild(moreCard);
    }
  } catch (err) {
    console.error('❌ Failed loading', section.title, err);
  }
}

async function getImdbIdFromTmdbTV(tmdbId) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`);
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