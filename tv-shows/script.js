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
  sections.forEach(section => {
    loadedCounts[section.title] = 0;
    renderTVSection(section, container);
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
    const tmdbShows = data.results || [];

    const uniqueShowsMap = new Map();

    // Add TMDB shows first
    tmdbShows.forEach(s => uniqueShowsMap.set(s.id, { source: 'TMDB', data: s }));

    // For each TMDB show, fetch external IDs to get imdb_id and fetch OMDB if available
    const imdbFetches = tmdbShows.map(async (show) => {
      if (!show.id) return null;
      try {
        const extRes = await fetch(`https://api.themoviedb.org/3/tv/${show.id}/external_ids?api_key=${TMDB_API_KEY}`);
        const extData = await extRes.json();
        const imdbID = extData.imdb_id;
        if (imdbID) {
          const omdbData = await fetchOMDBByImdbId(imdbID);
          if (omdbData && !uniqueShowsMap.has(omdbData.imdbID)) {
            uniqueShowsMap.set(`omdb_${omdbData.imdbID}`, { source: 'OMDB', data: omdbData });
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

    const uniqueShowsArray = Array.from(uniqueShowsMap.values());

    const showsToShow = uniqueShowsArray.slice(alreadyLoaded, alreadyLoaded + showsPerLoad);

    showsToShow.forEach(({ source, data }) => {
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
        titleText = `${data.name} (${data.first_air_date?.slice(0, 4) || 'N/A'})`;
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
        console.log(`Clicked TV show "${titleText}" from API: ${source}`);
        if (source === 'TMDB') {
          window.location.href = `${BASE_URL}/tv-shows/viewer.html?id=${clickId}`;
        } else {
          // OMDB fallback
          window.open(`https://www.imdb.com/title/${clickId}/`, '_blank');
        }
      };

      rowEl.appendChild(card);
    });

    loadedCounts[section.title] = alreadyLoaded + showsPerLoad;

    if (loadedCounts[section.title] < uniqueShowsArray.length) {
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
    console.error('Failed loading', section.title, err);
  }
}