const API_KEY = "3ade810499876bb5672f40e54960e6a2";

async function fetchRandomMovies() {
  const movieResults = document.getElementById("movieResults");
  movieResults.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${Math.floor(Math.random() * 10) + 1}`);
    const data = await res.json();

    movieResults.innerHTML = "";

    data.results.slice(0, 6).forEach(movie => {
      const div = document.createElement("div");
      div.style.margin = "12px";
      div.style.padding = "12px";
      div.style.background = "#1e1e1e";
      div.style.borderRadius = "12px";
      div.style.cursor = "pointer";
      div.style.boxShadow = "0 0 8px #0005";
      div.innerHTML = `
        <h3 style="color:#c084fc">${movie.title}</h3>
        <p style="font-size: 14px; color: #aaa">${movie.release_date}</p>
      `;
      div.onclick = () => {
        window.location.href = `/bilm.github.io/movies/viewer.html?id=${movie.id}`;
      };
      movieResults.appendChild(div);
    });
  } catch (err) {
    movieResults.innerHTML = "<p style='color:red'>Failed to load movies.</p>";
  }
}

document.addEventListener("DOMContentLoaded", fetchRandomMovies);
