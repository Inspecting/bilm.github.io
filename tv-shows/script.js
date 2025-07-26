const TMDB_API_KEY = '3ade810499876bb5672f40e54960e6a2';
const OMDB_API_KEY = '9bf8cd26';
const BASE_URL = 'https://inspecting.github.io/bilm.github.io';

const showsPerLoad = 15;
const loadedCounts = {};

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

  sections.forEach((section, index) => {
    loadedCounts[section.title] = 0;
    setTimeout(() => {
      renderTVSection(section, container);
    }, index * 200);
  });
});

async function fetchTMDBTV(endpoint, page) {
  const url = endpoint.includes('?')
    ? `https://api.themoviedb.org/3${endpoint}&api_key=${TMDB_API_KEY}&page=${page}`
    : `https://api.themoviedb.org/3${endpoint}?api_key=${TMDB_API_KEY}&page=${page}`;

  const res = await fetch(url);
  const data = await res.json();
  return data.results || [];
}

async function fetchOMDBTV(query, page) {
  const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=series&page=${page}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.Search || [];
}

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

    const [tmdbShows, omdbShows] = await Promise.all([
      fetchTMDBTV(section.endpoint, page),
      fetchOMDBTV(section.title, page)
    ]);

    const tvMap = new Map();

    tmdbShows.forEach(show => {
      const key = `${show.name}-${show.first_air_date?.slice(0, 4)}`;
      if (!tvMap.has(key)) {
        tvMap.set(key, {
          title: show.name,
          year: show.first_air_date?.slice(0, 4) || 'N/A',
          img: show.poster_path
            ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
            : 'https://via.placeholder.com/140x210?text=No+Image',
          link: `${BASE_URL}/tv-shows/viewer.html?id=${show.id}`,
          source: 'TMDB'
        });
      }
    });

    omdbShows.forEach(show => {
      const key = `${show.Title}-${show.Year}`;
      if (!tvMap.has(key)) {
        tvMap.set(key, {
          title: show.Title,
          year: show.Year,
          img: show.Poster !== 'N/A' ? show.Poster : 'https://via.placeholder.com/140x210?text=No+Image',
          link: `https://www.imdb.com/title/${show.imdbID}`,
          source: 'OMDB'
        });
      }
    });

    const oldShowMore = rowEl.querySelector('.show-more-card');
    if (oldShowMore) oldShowMore.remove();

    let renderedCount = 0;
    for (const show of tvMap.values()) {
      if (renderedCount >= showsPerLoad) break;

      const card = document.createElement('div');
      card.className = 'movie-card';
      card.dataset.source = show.source;

      const poster = document.createElement('img');
      poster.src = show.img;
      poster.alt = show.title;

      const title = document.createElement('p');
      title.textContent = `${show.title} (${show.year})`;

      card.appendChild(poster);
      card.appendChild(title);

      card.onclick = () => {
        console.log(`Clicked on "${show.title}" from API: ${show.source}`);
        window.location.href = show.link;
      };

      rowEl.appendChild(card);
      renderedCount++;
    }

    loadedCounts[section.title] += renderedCount;

    if (renderedCount >= showsPerLoad && tmdbShows.length === 20) {
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
    console.error(`❌ Failed to load section "${section.title}":`, err);
  }
}