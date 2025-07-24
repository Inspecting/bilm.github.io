// script.js
const API_KEY = "3ade810499876bb5672f40e54960e6a2";

function navigate(path) {
  window.location.href = path;
}

window.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("introOverlay");
  const header = document.querySelector("header");
  const main = document.querySelector("main");

  setTimeout(() => {
    intro.style.opacity = '0';
    setTimeout(() => {
      intro.remove();
      header.classList.add("visible");
      main.classList.add("visible");
    }, 500);
  }, 500);

  const overlay = document.getElementById("overlay");
  const videoFrame = document.getElementById("videoFrame");
  const closeOverlay = document.getElementById("closeOverlay");

  closeOverlay.onclick = () => {
    videoFrame.src = "";
    overlay.style.display = "none";
  };

  // Movie search
  document.getElementById("searchMovie").onclick = async () => {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return alert("Enter a movie name");

    const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    const movie = data.results?.[0];
    if (!movie) return alert("No movie found");

    window.location.href = `/bilm.github.io/movies/${movie.id}`;
  };

  // TV search
  document.getElementById("searchTV").onclick = async () => {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return alert("Enter a TV show name");

    const res = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    const show = data.results?.[0];
    if (!show) return alert("No TV show found");

    window.location.href = `/bilm.github.io/tv-shows/${show.id}`;
  };
});
