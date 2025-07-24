const TMDB_KEY = "3ade810499876bb5672f40e54960e6a2";

async function getRandomMovie() {
  const page = Math.floor(Math.random() * 500) + 1;
  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&sort_by=popularity.desc&page=${page}`);
  const data = await res.json();
  const movies = data.results;

  if (!movies || !movies.length) return;

  const random = movies[Math.floor(Math.random() * movies.length)];

  const container = document.getElementById("movieResults");
  container.innerHTML = `
    <h2 style="margin-top:20px;">${random.title} (${(random.release_date || "????").slice(0, 4)})</h2>
    <p style="margin-bottom: 12px;">${random.overview}</p>
    <button class="search-btn" onclick="location.href='/bilm.github.io/movies/viewer.html?id=${random.id}'">▶ Watch</button>
  `;
}
