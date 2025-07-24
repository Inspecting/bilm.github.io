const TMDB_API_KEY = '3ade810499876bb5672f40e54960e6a2';
const BASE_URL = 'https://api.themoviedb.org/3';

document.addEventListener('DOMContentLoaded', () => {
  const sections = [
    { title: 'Trending', path: '/trending/movie/day' },
    { title: 'Popular', path: '/movie/popular' },
    { title: 'Top Rated', path: '/movie/top_rated' },
    { title: 'Now Playing', path: '/movie/now_playing' }
  ];

  const container = document.getElementById('movieSections');

  sections.forEach(section => {
    createMovieSection(section.title, section.path);
  });

  function createMovieSection(title, apiPath) {
    let page = 1;
    const section = document.createElement('div');
    section.className = 'section';

    const heading = document.createElement('h2');
    heading.className = 'section-title';
    heading.textContent = title;
    section.appendChild(heading);

    const row = document.createElement('div');
    row.className = 'scroll-row';
    section.appendChild(row);
    container.appendChild(section);

    async function loadMovies() {
      const url = `${BASE_URL}${apiPath}?api_key=${TMDB_API_KEY}&page=${page}`;
      const res = await fetch(url);
      const data = await res.json();

      data.results.slice(0, 15).forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';

        const img = document.createElement('img');
        img.src = movie.poster_path
          ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
          : 'https://via.placeholder.com/140x210?text=No+Image';

        const label = document.createElement('p');
        const year = movie.release_date?.slice(0, 4) || 'N/A';
        label.textContent = `${movie.title} (${year})`;

        card.appendChild(img);
        card.appendChild(label);
        row.insertBefore(card, row.lastChild);
      });

      page++;
    }

    const showMore = document.createElement('div');
    showMore.className = 'show-more-card';
    showMore.innerHTML = '➡️';
    showMore.onclick = loadMovies;

    row.appendChild(showMore);
    loadMovies(); // Load initial batch
  }

  // Navigation buttons
  document.querySelectorAll('nav button').forEach(btn => {
    btn.onclick = () => {
      const page = btn.dataset.page;
      if (page === 'home') {
        window.location.href = 'https://inspecting.github.io/bilm.github.io/home/';
      } else if (page === 'movies') {
        window.location.href = 'https://inspecting.github.io/bilm.github.io/movies/';
      }
    };
  });
});
