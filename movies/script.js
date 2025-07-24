const TMDB_API_KEY = '3ade810499876bb5672f40e54960e6a2';
const BASE_URL = 'https://inspecting.github.io/bilm.github.io';

const showsPerLoad = 15;
const loadedCounts = {};

document.addEventListener('DOMContentLoaded', () => {
  // Navigation buttons
  document.querySelectorAll('nav button').forEach(btn => {
    btn.onclick = () => {
      const page = btn.dataset.page;
      if (page === 'home') {
        window.location.href = `${BASE_URL}/home/`;
      } else if (page === 'tv') {
        window.location.href = `${BASE_URL}/tv-shows/`;
      } else if (page === 'movies') {
        window.location.href = `${BASE_URL}/movies/`;
      }
    };
  });

  const sections = [
    { title: 'Trending', endpoint: '/trending/tv/week' },
    { title: 'Popular', endpoint: '/tv/popular' },
    { title: 'Airing Today', endpoint: '/tv/airing_today' },
    { title: 'On The Air', endpoint: '/tv/on_the_air' },
    { title: 'Top Rated', endpoint: '/tv/top_rated' },
    { title: 'Action & Adventure', endpoint: '/discover/tv?with_genres=10759' },
    { title: 'Animation', endpoint: '/discover/tv?with_genres=16' },
    { title: 'Comedy', endpoint: '/discover/tv?with_genres=35' },
    { title: 'Crime', endpoint: '/discover/tv?with_genres=80' },
    { title: 'Documentary', endpoint: '/discover/tv?with_genres=99' },
    { title: 'Drama', endpoint: '/discover/tv?with_genres=18' },
    { title: 'Family', endpoint: '/discover/tv?with_genres=10751' },
    { title: 'Kids', endpoint: '/discover/tv?with_genres=10762' },
    { title: 'Mystery', endpoint: '/discover/tv?with_genres=9648' },
    { title: 'News', endpoint: '/discover/tv?with_genres=10763' },
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

    // Remove old Show More button if present
    const oldShowMore = rowEl.querySelector('.show-more-card');
    if (oldShowMore) oldShowMore.remove();

    const shows = data.results || [];

    shows.slice(0, showsPerLoad).forEach(show => {
      const card = document.createElement('a');
      card.className = 'movie-card';
      card.href = `viewer.html?id=${show.id}`;

      const poster = document.createElement('img');
      poster.src = show.poster_path
        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
        : 'https://via.placeholder.com/140x210?text=No+Image';

      const title = document.createElement('p');
      title.textContent = `${show.name} (${show.first_air_date?.slice(0, 4) || 'N/A'})`;

      card.appendChild(poster);
      card.appendChild(title);
      rowEl.appendChild(card);
    });

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
    console.error('Failed loading', section.title, err);
  }
}
