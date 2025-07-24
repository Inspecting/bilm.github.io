const apiKey = "3ade810499876bb5672f40e54960e6a2";
const query = new URLSearchParams(location.search).get("query");
const resultsDiv = document.getElementById("results");

if (query) {
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      resultsDiv.innerHTML = "";
      if (!data.results.length) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
      }
      data.results.forEach(movie => {
        const btn = document.createElement("button");
        btn.className = "search-btn";
        btn.textContent = `${movie.title} (${(movie.release_date || "").slice(0, 4)})`;
        btn.onclick = () => {
          window.location.href = `/bilm.github.io/movies/viewer.html?id=${movie.id}`;
        };
        resultsDiv.appendChild(btn);
      });
    })
    .catch(() => {
      resultsDiv.innerHTML = "<p>Failed to load results.</p>";
    });
} else {
  resultsDiv.innerHTML = "<p>No query provided.</p>";
}
