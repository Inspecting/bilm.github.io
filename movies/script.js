const TMDB_API_KEY = '3ade810499876bb5672f40e54960e6a2';

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  const resultsContainer = document.getElementById('resultsContainer');
  const overlay = document.getElementById('overlay');
  const videoFrame = document.getElementById('videoFrame');
  const closeOverlay = document.getElementById('closeOverlay');

  header.style.opacity = '1';
  main.style.opacity = '1';

  // Navigation buttons
  document.querySelectorAll('nav button').forEach(btn => {
    btn.onclick = () => {
      const page = btn.dataset.page;
      if(page === 'home') {
        window.location.href = 'https://inspecting.github.io/bilm.github.io/home/';
      } else if(page === 'movies') {
        window.location.href = 'https://inspecting.github.io/bilm.github.io/movies/';
      }
    };
  });

  closeOverlay.onclick = () => {
    videoFrame.src = '';
    overlay.style.display = 'none';
  };

  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  if (searchQuery) {
    fetchMovies(searchQuery);
  } else {
    resultsContainer.innerHTML = '<p>Use the search on home page or add ?search=movie_name</p>';
  }

  async function fetchMovies(query) {
    resultsContainer.innerHTML = '<p>Loading...</p>';
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
      }
      displayMovies(data.results);
    } catch (err) {
      resultsContainer.innerHTML = '<p>Failed to fetch results.</p>';
    }
  }

  function displayMovies(movies) {
    resultsContainer.innerHTML = '';
    movies.forEach(movie => {
      const card = document.createElement('div');
      card.className = 'movie-card';

      const title = document.createElement('h3');
      title.textContent = `${movie.title} (${movie.release_date ? movie.release_date.slice(0,4) : '?'})`;

      const watchBtn = document.createElement('button');
      watchBtn.textContent = '▶ Watch Preview';
      watchBtn.onclick = () => {
        const embedUrl = `https://vidsrc.to/embed/movie/${movie.id}`;
        showVideoEmbed(embedUrl);
      };

      card.appendChild(title);
      card.appendChild(watchBtn);
      resultsContainer.appendChild(card);
    });
  }

  function showVideoEmbed(url) {
    videoFrame.src = url;
    overlay.style.display = 'flex';
  }
});
