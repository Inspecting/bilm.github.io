const TMDB_API_KEY = "3ade810499876bb5672f40e54960e6a2";

function loadRandomMovie() {
  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`)
    .then(res => res.json())
    .then(data => {
      const movies = data.results;
      const random = movies[Math.floor(Math.random() * movies.length)];
      window.location.href = `viewer.html?id=${random.id}`;
    });
}

function searchMovies() {
  const query = prompt("Enter movie title:");
  if (!query) return;
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (data.results.length === 0) return alert("No results.");
      const first = data.results[0];
      window.location.href = `viewer.html?id=${first.id}`;
    });
}

function getMovieIdFromURL() {
  const url = new URL(window.location.href);
  return url.searchParams.get("id");
}

function loadMovieDetails(id) {
  const container = document.getElementById("movieDetails");
  fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`)
    .then(res => res.json())
    .then(data => {
      container.innerHTML = `
        <h1>${data.title} (${data.release_date?.slice(0,4) || "?"})</h1>
        <p style="margin-bottom:16px;">${data.overview || "No description available."}</p>
        <button class="search-btn" onclick="openEmbed('${id}')">▶ Watch</button>
      `;
    });
}

function openEmbed(id) {
  const overlay = document.getElementById("overlay");
  const iframe = document.getElementById("videoFrame");
  iframe.src = `https://vidsrc.to/embed/movie/${id}`;
  overlay.style.display = "flex";
}

function closeEmbed() {
  const overlay = document.getElementById("overlay");
  const iframe = document.getElementById("videoFrame");
  iframe.src = "";
  overlay.style.display = "none";
}

// Setup viewer.html logic
if (window.location.pathname.includes("viewer.html")) {
  const id = getMovieIdFromURL();
  if (id) loadMovieDetails(id);
  document.getElementById("closeOverlay").onclick = closeEmbed;
}
