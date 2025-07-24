const TMDB_API_KEY = '3ade810499876bb5672f40e54960e6a2';
const BASE_URL = 'https://inspecting.github.io/bilm.github.io';

const moviesPerLoad = 15;
const loadedCounts = {};
const movieSections = [
  { title: 'Trending', endpoint: 'trending/movie/week', page: 1, movies: [] },
  { title: 'Popular', endpoint: 'movie/popular', page: 1, movies: [] },
  { title: 'Now Playing', endpoint: 'movie/now_playing', page: 1, movies: [] },
  { title: 'Top Rated', endpoint: 'movie/top_rated', page: 1, movies: [] },
];

document.addEventListener('DOMContentLoaded', () => {
  // Navigation buttons
const genreMap = {};

document.addEventListener('DOMContentLoaded', async () => {
  setupNavButtons();
  await fetchGenres();
  await loadAllSections();
});

// Setup top nav buttons
function setupNavButtons() {
  document.querySelectorAll('nav button').forEach(btn => {
    btn.onclick = () => {
      const page = btn.dataset.page;
      if (page === 'home') {
      if(page === 'home') {
        window.location.href = `${BASE_URL}/home/`;
      } else if (page === 'movies') {
      } else if(page === 'movies') {
        window.location.href = `${BASE_URL}/movies/`;
      }
    };
  });
}

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
// Fetch genres once and map id => name
async function fetchGenres() {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`);
    const data = await res.json();
    if(data.genres && Array.isArray(data.genres)) {
      data.genres.forEach(g => {
        genreMap[g.id] = g.name;
      });
    }
  } catch (err) {
    console.error('Failed to fetch genres:', err);
  }
}

// Load all sections on page load
async function loadAllSections() {
  for (const section of movieSections) {
    await loadMovies(section);
    renderMovieSection(section);
    setupScrollArrows(section.title);
  }
}

// Load movies from TMDB for given section and page
async function loadMovies(section) {
  try {
    const url = `https://api.themoviedb.org/3/${section.endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=${section.page}`;
    const res = await fetch(url);
    const data = await res.json();
    if(data.results && Array.isArray(data.results)) {
      section.movies.push(...data.results);
    }
  } catch (err) {
    console.error(`Failed to load ${section.title} movies:`, err);
  }
}

// Render a movie section with horizontal scroll, show more button
function renderMovieSection(section) {
  const container = document.getElementById('movieSections');
  sections.forEach(section => {
    loadedCounts[section.title] = 0;
    renderMovieSection(section, container);

  // Remove old section if exists
  const oldSection = document.getElementById(`section-${section.title.replace(/\s/g, '')}`);
  if (oldSection) container.removeChild(oldSection);

  // Create section container
  const sectionDiv = document.createElement('div');
  sectionDiv.className = 'section';
  sectionDiv.id = `section-${section.title.replace(/\s/g, '')}`;

  // Section title
  const h2 = document.createElement('h2');
  h2.className = 'section-title';
  h2.textContent = section.title;
  sectionDiv.appendChild(h2);

  // Scroll wrapper
  const scrollWrapper = document.createElement('div');
  scrollWrapper.className = 'scroll-wrapper';

  // Left arrow
  const leftArrow = document.createElement('div');
  leftArrow.className = 'scroll-arrow scroll-left';
  leftArrow.innerHTML = '&#8592;'; // ←
  scrollWrapper.appendChild(leftArrow);

  // Scroll row container
  const scrollRow = document.createElement('div');
  scrollRow.className = 'scroll-row';
  scrollRow.id = `row-${section.title.replace(/\s/g, '')}`;

  // Add movie cards
  section.movies.forEach(movie => {
    const card = createMovieCard(movie);
    scrollRow.appendChild(card);
  });
});

async function renderMovieSection(section, container) {
  let sectionEl = document.getElementById(`section-${section.title.replace(/\s/g, '')}`);
  let rowEl;
  // Add show more button
  const showMoreBtn = document.createElement('div');
  showMoreBtn.className = 'show-more';
  showMoreBtn.textContent = '▶';
  showMoreBtn.title = 'Show More';
  showMoreBtn.onclick = async () => {
    section.page++;
    await loadMovies(section);
    // Append new movies (only new ones)
    const existingIds = new Set();
    scrollRow.querySelectorAll('.movie-card').forEach(c => {
      existingIds.add(c.dataset.id);
    });
    const newMovies = section.movies.filter(m => !existingIds.has(String(m.id)));
    newMovies.forEach(m => {
      const card = createMovieCard(m);
      scrollRow.insertBefore(card, showMoreBtn);
    });
  };
  scrollRow.appendChild(showMoreBtn);

  scrollWrapper.appendChild(scrollRow);

  // Right arrow
  const rightArrow = document.createElement('div');
  rightArrow.className = 'scroll-arrow scroll-right';
  rightArrow.innerHTML = '&#8594;'; // →
  scrollWrapper.appendChild(rightArrow);

  sectionDiv.appendChild(scrollWrapper);
  container.appendChild(sectionDiv);
}

  if (!sectionEl) {
    sectionEl = document.createElement('div');
    sectionEl.className = 'section';
    sectionEl.id = `section-${section.title.replace(/\s/g, '')}`;
// Create a single movie card element
function createMovieCard(movie) {
  const card = document.createElement('div');
  card.className = 'movie-card';
  card.dataset.id = movie.id;

    const titleEl = document.createElement('h2');
    titleEl.className = 'section-title';
    titleEl.textContent = section.title;
  // Poster image
  const img = document.createElement('img');
  img.src = movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : 'https://via.placeholder.com/140x210?text=No+Image';
  img.alt = movie.title;

    rowEl = document.createElement('div');
    rowEl.className = 'scroll-row';
    rowEl.id = `row-${section.title.replace(/\s/g, '')}`;
  // Info container
  const info = document.createElement('div');
  info.className = 'movie-info';

    sectionEl.appendChild(titleEl);
    sectionEl.appendChild(rowEl);
    container.appendChild(sectionEl);
  // Title
  const title = document.createElement('div');
  title.className = 'movie-title';
  title.textContent = movie.title;

  // Release date year
  const date = document.createElement('div');
  date.className = 'movie-date';
  date.textContent = movie.release_date ? `(${movie.release_date.slice(0,4)})` : '(?)';

  // Genres text
  const genres = document.createElement('div');
  genres.className = 'movie-genres';
  if(movie.genre_ids && movie.genre_ids.length > 0) {
    const names = movie.genre_ids.map(id => genreMap[id]).filter(Boolean);
    genres.textContent = names.join(', ');
  } else {
    rowEl = sectionEl.querySelector('.scroll-row');
    genres.textContent = 'Unknown Genre';
  }

  try {
    const alreadyLoaded = loadedCounts[section.title] || 0;
    const page = Math.floor(alreadyLoaded / moviesPerLoad) + 1;
  info.appendChild(title);
  info.appendChild(date);
  info.appendChild(genres);

    const url = section.endpoint.includes('?')
      ? `https://api.themoviedb.org/3${section.endpoint}&api_key=${TMDB_API_KEY}&page=${page}`
      : `https://api.themoviedb.org/3${section.endpoint}?api_key=${TMDB_API_KEY}&page=${page}`;
  card.appendChild(img);
  card.appendChild(info);

    const res = await fetch(url);
    const data = await res.json();
  // Click to open embed preview
  card.onclick = () => {
    const embedUrl = `https://vidsrc.to/embed/movie/${movie.id}`;
    openVideoOverlay(embedUrl);
  };

    // Remove old Show More button if present
    const oldShowMore = rowEl.querySelector('.show-more-card');
    if (oldShowMore) oldShowMore.remove();
  return card;
}

    const movies = data.results || [];
// Setup horizontal scroll arrow button handlers
function setupScrollArrows(sectionTitle) {
  const row = document.getElementById(`row-${sectionTitle.replace(/\s/g, '')}`);
  if (!row) return;

    movies.slice(0, moviesPerLoad).forEach(movie => {
      const card = document.createElement('div');
      card.className = 'movie-card';
  const wrapper = row.parentElement; // .scroll-wrapper

      const poster = document.createElement('img');
      poster.src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/140x210?text=No+Image';
  const btnLeft = wrapper.querySelector('.scroll-left');
  const btnRight = wrapper.querySelector('.scroll-right');

      const title = document.createElement('p');
      title.textContent = `${movie.title} (${movie.release_date?.slice(0,4) || 'N/A'})`;
  const cardWidth = 140; // movie card width in px
  const gap = 12; // gap between cards in px
  const scrollAmount = (cardWidth + gap) * 3; // scroll by 3 cards

      card.appendChild(poster);
      card.appendChild(title);
  btnLeft.onclick = () => {
    row.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };
  btnRight.onclick = () => {
    row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };
}

// Open overlay video player
function openVideoOverlay(url) {
  let overlay = document.getElementById('overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.95)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '3000';

    const iframe = document.createElement('iframe');
    iframe.id = 'videoFrame';
    iframe.allowFullscreen = true;
    iframe.allow = 'autoplay';
    iframe.style.width = '80vw';
    iframe.style.height = '80vh';
    iframe.style.border = 'none';
    overlay.appendChild(iframe);

      rowEl.appendChild(card);
    const closeBtn = document.createElement('button');
    closeBtn.id = 'closeOverlay';
    closeBtn.textContent = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.fontSize = '40px';
    closeBtn.style.color = 'white';
    closeBtn.style.background = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.userSelect = 'none';
    closeBtn.addEventListener('click', () => {
      iframe.src = '';
      overlay.style.display = 'none';
    });

    loadedCounts[section.title] = alreadyLoaded + moviesPerLoad;

    // Add show more arrow button if more movies remain
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
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
  }
  const iframe = document.getElementById('videoFrame');
  iframe.src = url;
  overlay.style.display = 'flex';
}
