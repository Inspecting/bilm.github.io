// app.js
(() => {
  // YOUR TMDB API key:
  const TMDB_API_KEY = "3ade810499876bb5672f40e54960e6a2";

  // Cached DOM elements
  const navButtons = document.querySelectorAll("nav button");
  const header = document.querySelector("header");
  const main = document.querySelector("main");
  const searchContainer = document.getElementById("searchContainer");
  const searchInput = document.getElementById("searchInput");
  const searchMovieBtn = document.getElementById("searchMovie");
  const searchTVBtn = document.getElementById("searchTV");
  const overlay = document.getElementById("overlay");
  const closeOverlayBtn = document.getElementById("closeOverlay");
  const videoFrame = document.getElementById("videoFrame");

  // LocalStorage keys
  const STORAGE_KEYS = {
    history: "bilm_history",
    favorites: "bilm_favorites",
    theme: "bilm_theme"
  };

  // State variables
  let currentPage = "home";
  let historyList = JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || "[]");
  let favoritesObj = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '{"movies":[], "tvshows":[]}');
  let theme = localStorage.getItem(STORAGE_KEYS.theme) || "purple";

  // Utilities
  function saveHistory() {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(historyList));
  }
  function saveFavorites() {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favoritesObj));
  }
  function saveTheme() {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }
  function clearMain() {
    main.innerHTML = "";
  }
  function setTheme(t) {
    theme = t;
    document.body.className = "";
    document.body.classList.add(`theme-${t}`);
    saveTheme();
  }

  // Create elements helpers
  function createButton(text, onClick, classes = []) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.classList.add(...classes);
    btn.onclick = onClick;
    return btn;
  }
  function createTitle(text, tag = "h2") {
    const el = document.createElement(tag);
    el.textContent = text;
    el.style.marginBottom = "16px";
    return el;
  }
  function createList(items, renderItem) {
    const container = document.createElement("div");
    container.className = "list";
    items.forEach(item => {
      const el = renderItem(item);
      container.appendChild(el);
    });
    return container;
  }

  // Navigation handlers
  function goToPage(page) {
    currentPage = page;
    switch (page) {
      case "home":
        showHome();
        break;
      case "movies":
        showRandomMovies();
        break;
      case "tv":
        showRandomTVShows();
        break;
      case "settings":
        showSettings();
        break;
    }
  }
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      goToPage(btn.dataset.page);
    });
  });

  // Home Page - Search UI
  function showHome() {
    clearMain();
    main.appendChild(searchContainer);
    searchContainer.style.display = "block";
  }

  // Fetch TMDB API helper
  async function fetchTMDB(path) {
    const res = await fetch(`https://api.themoviedb.org/3${path}&api_key=${TMDB_API_KEY}`);
    if (!res.ok) throw new Error("API error");
    return res.json();
  }

  // Searches
  async function searchMovies(query) {
    if (!query) return alert("Enter a search term");
    clearMain();
    try {
      const data = await fetchTMDB(`/search/movie?query=${encodeURIComponent(query)}`);
      if (data.results.length === 0) {
        alert("No movie results found");
        return showHome();
      }
      renderMovieResults(data.results, query);
    } catch {
      alert("Failed to fetch movie results");
      showHome();
    }
  }
  async function searchTVShows(query) {
    if (!query) return alert("Enter a search term");
    clearMain();
    try {
      const data = await fetchTMDB(`/search/tv?query=${encodeURIComponent(query)}`);
      if (data.results.length === 0) {
        alert("No TV show results found");
        return showHome();
      }
      renderTVResults(data.results, query);
    } catch {
      alert("Failed to fetch TV show results");
      showHome();
    }
  }

  // Render movie and TV lists & handlers... (rest is same as before, omitted here for brevity)

  // ... include all the functions from previous app.js code snippet

  // Initialize
  function init() {
    setTheme(theme);
    showHome();

    // Search buttons functionality
    searchMovieBtn.onclick = () => {
      searchMovies(searchInput.value.trim());
    };
    searchTVBtn.onclick = () => {
      searchTVShows(searchInput.value.trim());
    };
  }

  init();
})();
