const TMDB_API_KEY = '3ade810499876bb5672f40e54960e6a2';
const moviesPerLoad = 15;

const movieSections = [
  { title: 'Trending', endpoint: '/trending/movie/week' },
  { title: 'Popular', endpoint: '/movie/popular' },
  { title: 'Top Rated', endpoint: '/movie/top_rated' },
  { title: 'Now Playing', endpoint: '/movie/now_playing' },
  { title: 'Action', endpoint: '/discover/movie?with_genres=28' },
  { title: 'Adventure', endpoint: '/discover/movie?with_genres=12' },
  { title: 'Animation', endpoint: '/discover/movie?with_genres=16' },
  { title: 'Comedy', endpoint: '/discover/movie?with_genres=35' },
  { title: 'Crime', endpoint: '/discover/movie?with_genres=80' },
  { title: 'Documentary', endpoint: '/discover/movie?with_genres=99' },
  { title: 'Drama', endpoint: '/discover/movie?with_genres=18' },
  { title: 'Family', endpoint: '/discover/movie?with_genres=10751' },
  { title: 'Fantasy', endpoint: '/discover/movie?with_genres=14' },
  { title: 'History', endpoint: '/discover/movie?with_genres=36' },
  { title: 'Horror', endpoint: '/discover/movie?with_genres=27' },
  { title: 'Music', endpoint: '/discover/movie?with_genres=10402' },
  { title: 'Mystery', endpoint: '/discover/movie?with_genres=9648' },
  { title: 'Romance', endpoint: '/discover/movie?with_genres=10749' },
  { title: 'Science Fiction', endpoint: '/discover/movie?with_genres=878' },
  { title: 'TV Movie', endpoint: '/discover/movie?with_genres=10770' },
  { title: 'Thriller', endpoint: '/discover/movie?with_genres=53' },
  { title: 'War', endpoint: '/discover/movie?with_genres=10752' },
  { title: 'Western', endpoint: '/discover/movie?with_genres=37' }
];

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('movieSections');
  movieSections.forEach(section => renderSection(section, container));
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

    (data.results || []).slice(0, moviesPerLoad).forEach(movie => {
      const card = document.createElement('div');
      card.className = 'card';

      const poster = document.createElement('img');
      poster.src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : 'https://via.placeholder.com/200x300?text=No+Image';

      const title = document.createElement('p');
      title.className = 'card-title';
      title.textContent = movie.title;

      const year = document.createElement('p');
      year.className = 'card-date';
      year.textContent = movie.release_date?.slice(0, 4) || 'N/A';

      card.appendChild(poster);
      card.appendChild(title);
      card.appendChild(year);
      row.appendChild(card);
    });
  } catch (e) {
    row.textContent = 'Error loading section';
  }
}
