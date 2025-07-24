// Your movies page JS here
// You can put the TMDB API key here
const tmdbKey = "3ade810499876bb5672f40e54960e6a2";

document.addEventListener("DOMContentLoaded", () => {
  const btnHome = document.getElementById("btnHome");
  const btnMovies = document.getElementById("btnMovies");
  const btnTV = document.getElementById("btnTV");
  const btnSettings = document.getElementById("btnSettings");
  const movieList = document.getElementById("movieList");
  const overlay = document.getElementById("overlay");
  const closeOverlay = document.getElementById("closeOverlay");
  const videoFrame = document.getElementById("videoFrame");

  btnHome.onclick = () => {
    window.location.href = "../"; // Go to root home page
  };
  btnTV.onclick = () => {
    window.location.href = "../tv-shows/"; // To be created later
  };
  btnSettings.onclick = () => {
    window.location.href = "../settings/"; // To be created later
  };

  closeOverlay.onclick = () => {
    videoFrame.src = "";
    overlay.style.display = "none";
  };

  // Example function: fetch random popular movies and show list
  async function fetchRandomMovies() {
    movieList.innerHTML = "<p>Loading movies...</p>";
    try {
      let response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbKey}&language=en-US&page=1`);
      let data = await response.json();
      displayMovies(data.results);
    } catch (err) {
      movieList.innerHTML = "<p>Failed to load movies.</p>";
      console.error(err);
    }
  }

  function displayMovies(movies) {
    movieList.innerHTML = "";
    movies.forEach((movie) => {
      let div = document.createElement("div");
      div.className = "movie-item";
      div.textContent = `${movie.title} (${(movie.release_date || "????").slice(0,4)})`;
      div.style.cursor = "pointer";
      div.style.padding = "10px";
      div.style.borderBottom = "1px solid #444";
      div.onclick = () => {
        // Show embedded video player when clicked
        // For demonstration, using vidsrc.to embed
        const embedUrl = `https://vidsrc.to/embed/movie/${movie.id}`;
        videoFrame.src = embedUrl;
        overlay.style.display = "flex";
      };
      movieList.appendChild(div);
    });
  }

  fetchRandomMovies();
});
