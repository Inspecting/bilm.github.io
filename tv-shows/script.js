const TMDB_API_KEY = '3ade810499876bb5672f40e54960e6a2';
const showsPerLoad = 15;

const tvSections = [
  { title: 'Trending', endpoint: '/trending/tv/week' },
  { title: 'Popular', endpoint: '/tv/popular' },
  { title: 'Top Rated', endpoint: '/tv/top_rated' },
  { title: 'Airing Today', endpoint: '/tv/airing_today' },
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

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('tvSections');
  tvSections.forEach(section => renderSection(section, container));
});

async function renderSection(section, container) {
  const sectionEl = document.createElement('section');
  sectionEl.className = 'section';

  const title = document.createElement('h2');
  title.textContent = section.title;
  sectionEl.appendChild(title);

  const row = document.createElement('div');
  row.className = 'scroll-row';
  sectionEl.appendChild(row);
  container.appendChild(sectionEl);

  try {
    const url = section.endpoint.includes('?')
      ? `https://api.themoviedb.org/3${section.endpoint}&api_key=${TMDB_API_KEY}&page=1`
      : `https://api.themoviedb.org/3${section.endpoint}?api_key=${TMDB_API_KEY}&page=1`;

    const res = await fetch(url);
    const data = await res.json();

    (data.results || []).slice(0, showsPerLoad).forEach(show => {
      const card = document.createElement('div');
      card.className = 'card';

      const poster = document.createElement('img');
      poster.src = show.poster_path
        ? `https://image.tmdb.org/t/p/w300${show.poster_path}`
        : 'https://via.placeholder.com/200x300?text=No+Image';

      const title = document.createElement('p');
      title.className = 'card-title';
      title.textContent = show.name;

      const year = document.createElement('p');
      year.className = 'card-date';
      year.textContent = show.first_air_date?.slice(0, 4) || 'N/A';

      card.appendChild(poster);
      card.appendChild(title);
      card.appendChild(year);
      row.appendChild(card);
    });
  } catch (e) {
    row.textContent = 'Error loading section';
  }
}
