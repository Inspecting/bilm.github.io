// app.js
(() => {
  // TMDB API key (replace with your own key if needed)
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
  let currentPage = "home"; // home, movies, tv, settings
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
    document.body.className = ""; // clear existing theme classes
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

  // Home Page - Search UI is already in index.html, we just toggle visibility
  function showHome() {
    clearMain();
    main.appendChild(searchContainer);
    searchContainer.style.display = "block";
  }

  // Search helpers
  async function fetchTMDB(path) {
    const res = await fetch(`https://api.themoviedb.org/3${path}&api_key=${TMDB_API_KEY}`);
    if (!res.ok) throw new Error("API error");
    return res.json();
  }

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

  // Render results
  function renderMovieResults(results, query) {
    clearMain();
    const title = createTitle(`Results for movies: "${query}"`);
    main.appendChild(title);

    const list = createList(results, movie => {
      const item = document.createElement("div");
      item.className = "list-item";

      const txt = document.createElement("div");
      txt.className = "title";
      txt.textContent = `${movie.title} (${movie.release_date ? movie.release_date.slice(0,4) : "?"})`;
      item.appendChild(txt);

      const btns = document.createElement("div");
      btns.className = "actions";

      const favBtn = createButton(favoritesObj.movies.find(f => f.id === movie.id) ? "★ Remove" : "☆ Favorite", () => {
        toggleFavorite("movie", movie);
        favBtn.textContent = favoritesObj.movies.find(f => f.id === movie.id) ? "★ Remove" : "☆ Favorite";
      });
      btns.appendChild(favBtn);

      const watchBtn = createButton("▶ Watch", () => {
        playVideo(`https://vidsrc.to/embed/movie/${movie.id}`);
        addToHistory("movie", movie);
      });
      btns.appendChild(watchBtn);

      item.appendChild(btns);
      return item;
    });

    main.appendChild(list);
  }

  function renderTVResults(results, query) {
    clearMain();
    const title = createTitle(`Results for TV shows: "${query}"`);
    main.appendChild(title);

    const list = createList(results, show => {
      const item = document.createElement("div");
      item.className = "list-item";

      const txt = document.createElement("div");
      txt.className = "title";
      txt.textContent = `${show.name} (${show.first_air_date ? show.first_air_date.slice(0,4) : "?"})`;
      item.appendChild(txt);

      const btns = document.createElement("div");
      btns.className = "actions";

      const favBtn = createButton(favoritesObj.tvshows.find(f => f.id === show.id) ? "★ Remove" : "☆ Favorite", () => {
        toggleFavorite("tvshow", show);
        favBtn.textContent = favoritesObj.tvshows.find(f => f.id === show.id) ? "★ Remove" : "☆ Favorite";
      });
      btns.appendChild(favBtn);

      const seasonsBtn = createButton("📺 Seasons", () => {
        showSeasons(show.id, show.name);
        addToHistory("tvshow", show);
      });
      btns.appendChild(seasonsBtn);

      item.appendChild(btns);
      return item;
    });

    main.appendChild(list);
  }

  // Show seasons for a TV show
  async function showSeasons(tvId, tvName) {
    clearMain();
    const title = createTitle(`${tvName} - Seasons`);
    main.appendChild(title);

    try {
      const data = await fetchTMDB(`/tv/${tvId}?`);
      if (!data.seasons) throw new Error();
      const list = createList(data.seasons, season => {
        const item = document.createElement("div");
        item.className = "list-item";

        const txt = document.createElement("div");
        txt.className = "title";
        txt.textContent = `Season ${season.season_number}`;
        item.appendChild(txt);

        const epsBtn = createButton("▶ Episodes", () => {
          showEpisodes(tvId, tvName, season.season_number);
        });
        item.appendChild(epsBtn);

        return item;
      });
      main.appendChild(list);
    } catch {
      alert("Failed to load seasons");
      showHome();
    }
  }

  // Show episodes for a season
  async function showEpisodes(tvId, tvName, seasonNumber) {
    clearMain();
    const title = createTitle(`${tvName} - Season ${seasonNumber} Episodes`);
    main.appendChild(title);

    try {
      const data = await fetchTMDB(`/tv/${tvId}/season/${seasonNumber}?`);
      if (!data.episodes) throw new Error();
      const list = createList(data.episodes, ep => {
        const item = document.createElement("div");
        item.className = "list-item";

        const txt = document.createElement("div");
        txt.className = "title";
        txt.textContent = `${ep.episode_number}. ${ep.name}`;
        item.appendChild(txt);

        const watchBtn = createButton("▶ Watch", () => {
          playVideo(`https://vidsrc.to/embed/tv/${tvId}/${seasonNumber}-${ep.episode_number}`);
          addToHistory("tvshow", {
            id: tvId,
            name: tvName,
            season: seasonNumber,
            episode: ep.episode_number,
            episodeName: ep.name
          });
        });
        item.appendChild(watchBtn);

        return item;
      });
      main.appendChild(list);
    } catch {
      alert("Failed to load episodes");
      showHome();
    }
  }

  // Play video in overlay
  function playVideo(url) {
    videoFrame.src = url;
    overlay.style.display = "flex";
  }
  closeOverlayBtn.onclick = () => {
    videoFrame.src = "";
    overlay.style.display = "none";
  };

  // Favorites toggle
  function toggleFavorite(type, item) {
    if (type === "movie") {
      const idx = favoritesObj.movies.findIndex(f => f.id === item.id);
      if (idx >= 0) favoritesObj.movies.splice(idx, 1);
      else favoritesObj.movies.unshift({ id: item.id, title: item.title });
    } else if (type === "tvshow") {
      const idx = favoritesObj.tvshows.findIndex(f => f.id === item.id);
      if (idx >= 0) favoritesObj.tvshows.splice(idx, 1);
      else favoritesObj.tvshows.unshift({ id: item.id, name: item.name });
    }
    saveFavorites();
  }

  // History add
  function addToHistory(type, item) {
    const title = type === "movie" ? item.title : item.name || (item.episodeName ? `${item.name} S${item.season}E${item.episode}` : "");
    const url = type === "movie" ? `https://vidsrc.to/embed/movie/${item.id}` :
      type === "tvshow" && item.season && item.episode ?
      `https://vidsrc.to/embed/tv/${item.id}/${item.season}-${item.episode}` :
      type === "tvshow" ? `https://www.themoviedb.org/tv/${item.id}` : "";

    // Remove existing entry with same URL
    historyList = historyList.filter(h => h.url !== url);
    historyList.unshift({ title, url, type });
    if (historyList.length > 20) historyList.pop();
    saveHistory();
  }

  // Show Settings page with Favorites, History, Theme switcher
  function showSettings() {
    clearMain();

    const title = createTitle("Settings");
    main.appendChild(title);

    // Favorites list
    const favTitle = createTitle("Favorites", "h3");
    main.appendChild(favTitle);

    const favList = createList(
      [...favoritesObj.movies.map(m => ({...m, type:"movie"})),
       ...favoritesObj.tvshows.map(t => ({...t, type:"tvshow"}))
      ],
      item => {
        const el = document.createElement("div");
        el.className = "list-item";

        const txt = document.createElement("div");
        txt.className = "title";
        txt.textContent = item.type === "movie" ? item.title : item.name;
        el.appendChild(txt);

        const watchBtn = createButton("▶ Watch", () => {
          if (item.type === "movie") playVideo(`https://vidsrc.to/embed/movie/${item.id}`);
          else playVideo(`https://www.themoviedb.org/tv/${item.id}`);
        });
        el.appendChild(watchBtn);

        const removeBtn = createButton("✕ Remove", () => {
          if (item.type === "movie") {
            favoritesObj.movies = favoritesObj.movies.filter(f => f.id !== item.id);
          } else {
            favoritesObj.tvshows = favoritesObj.tvshows.filter(f => f.id !== item.id);
          }
          saveFavorites();
          showSettings();
        });
        el.appendChild(removeBtn);

        return el;
      }
    );
    main.appendChild(favList);

    // History list
    const histTitle = createTitle("History", "h3");
    main.appendChild(histTitle);

    const histList = createList(historyList, item => {
      const el = document.createElement("div");
      el.className = "list-item";

      const txt = document.createElement("div");
      txt.className = "title";
      txt.textContent = item.title;
      el.appendChild(txt);

      const watchBtn = createButton("▶ Watch", () => {
        playVideo(item.url);
      });
      el.appendChild(watchBtn);

      return el;
    });
    main.appendChild(histList);

    // Theme switcher
    const themeTitle = createTitle("UI Color Theme", "h3");
    main.appendChild(themeTitle);

    const themes = ["purple", "blue", "teal", "red"];
    const themeContainer = document.createElement("div");
    themeContainer.style.display = "flex";
    themeContainer.style.gap = "12px";

    themes.forEach(t => {
      const btn = createButton(t.charAt(0).toUpperCase() + t.slice(1), () => {
        setTheme(t);
      });
      if (t === theme) btn.style.fontWeight = "700";
      themeContainer.appendChild(btn);
    });
    main.appendChild(themeContainer);
  }

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
