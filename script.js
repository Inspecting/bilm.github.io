const tmdbKey = "3ade810499876bb5672f40e54960e6a2";

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const introOverlay = document.getElementById("introOverlay");
  const header = document.querySelector("header");
  const main = document.querySelector("main");

  const navButtons = document.querySelectorAll("nav button");
  const searchInput = document.getElementById("searchInput");
  const searchMovieBtn = document.getElementById("searchMovie");
  const searchTVBtn = document.getElementById("searchTV");

  const searchContainer = document.getElementById("searchContainer");
  const resultContainer = document.getElementById("resultContainer");
  const resultTitle = document.getElementById("resultTitle");
  const resultsList = document.getElementById("resultsList");

  const embedContainer = document.getElementById("embedContainer");
  const embedPlayer = document.getElementById("embedPlayer");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const closeEmbedBtn = document.getElementById("closeEmbedBtn");

  const fullscreenOverlay = document.getElementById("fullscreenOverlay");
  const fullscreenPlayer = document.getElementById("fullscreenPlayer");
  const closeFullscreenBtn = document.getElementById("closeFullscreenBtn");

  // Show intro then fade out
  setTimeout(() => {
    introOverlay.style.opacity = "0";
    setTimeout(() => {
      introOverlay.style.display = "none";
      header.classList.add("visible");
      main.classList.add("visible");
    }, 500);
  }, 500);

  // Navigation logic
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page;
      if (page === "home") {
        showHome();
      } else if (page === "movies") {
        showMovies();
      } else if (page === "tv") {
        showTVShows();
      } else if (page === "settings") {
        showSettings();
      }
    });
  });

  // Start on home
  showHome();

  // Home page: show search UI
  function showHome() {
    clearResults();
    searchContainer.style.display = "block";
    resultContainer.classList.add("hidden");
  }

  // Movies page: show random movie picks
  async function showMovies() {
    clearResults();
    searchContainer.style.display = "none";
    resultContainer.classList.remove("hidden");
    resultTitle.textContent = "🎬 Random Movies";

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&sort_by=popularity.desc&language=en-US&page=1`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      const movies = data.results.slice(0, 10);
      displayResults(movies, "movie");
    } catch (e) {
      alert("Failed to load movies");
    }
  }

  // TV Shows page: show random TV picks
  async function showTVShows() {
    clearResults();
    searchContainer.style.display = "none";
    resultContainer.classList.remove("hidden");
    resultTitle.textContent = "📺 Random TV Shows";

    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${tmdbKey}&sort_by=popularity.desc&language=en-US&page=1`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      const shows = data.results.slice(0, 10);
      displayResults(shows, "tv");
    } catch (e) {
      alert("Failed to load TV shows");
    }
  }

  // Settings page placeholder
  function showSettings() {
    clearResults();
    searchContainer.style.display = "none";
    resultContainer.classList.remove("hidden");
    resultTitle.textContent = "⚙ Settings";
    resultsList.innerHTML = "<p>Settings coming soon!</p>";
  }

  // Clear results
  function clearResults() {
    resultsList.innerHTML = "";
    hideEmbed();
  }

  // Display results list with clickable items
  function displayResults(items, type) {
    items.forEach((item) => {
      const div = document.createElement("div");
      div.className = "list-item";
      div.textContent = type === "movie" ? item.title : item.name;
      div.title = type === "movie" ? item.title : item.name;
      div.style.cursor = "pointer";

      div.addEventListener("click", () => {
        const id = item.id;
        const embedUrl = type === "movie"
          ? `https://vidsrc.to/embed/movie/${id}`
          : `https://vidsrc.to/embed/tv/${id}`;

        showEmbed(embedUrl);
      });
      resultsList.appendChild(div);
    });
  }

  // Show embedded video in small player
  function showEmbed(url) {
    embedPlayer.src = url;
    embedContainer.classList.remove("hidden");
  }

  // Hide embed player
  function hideEmbed() {
    embedPlayer.src = "";
    embedContainer.classList.add("hidden");
  }

  // Fullscreen player logic
  fullscreenBtn.addEventListener("click", () => {
    fullscreenPlayer.src = embedPlayer.src;
    fullscreenOverlay.classList.remove("hidden");
  });
  closeEmbedBtn.addEventListener("click", () => {
    hideEmbed();
  });
  closeFullscreenBtn.addEventListener("click", () => {
    fullscreenPlayer.src = "";
    fullscreenOverlay.classList.add("hidden");
  });

  // Search buttons logic
  searchMovieBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return alert("Please enter a movie name.");
    searchTMDB(query, "movie");
  });
  searchTVBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return alert("Please enter a TV show name.");
    searchTMDB(query, "tv");
  });

  // Search TMDB API
  async function searchTMDB(query, type) {
    clearResults();
    searchContainer.style.display = "none";
    resultContainer.classList.remove("hidden");
    resultTitle.textContent = `Search results for "${query}"`;

    const url = `https://api.themoviedb.org/3/search/${type}?api_key=${tmdbKey}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      const results = data.results;
      if (!results.length) {
        resultsList.innerHTML = `<p>No results found for "${query}".</p>`;
        return;
      }
      displayResults(results, type);
    } catch (e) {
      alert("Failed to fetch search results.");
      showHome();
    }
  }
});
