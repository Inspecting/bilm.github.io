document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("introOverlay");
  const header = document.querySelector("header");
  const main = document.querySelector("main");
  const overlay = document.getElementById("overlay");
  const videoFrame = document.getElementById("videoFrame");
  const closeOverlay = document.getElementById("closeOverlay");

  // Fade out intro after 0.5 seconds
  setTimeout(() => {
    intro.style.opacity = "0";

    const showUI = () => {
      intro.style.display = "none";
      header.classList.add("visible");
      main.classList.add("visible");
    };

    intro.addEventListener("transitionend", showUI, { once: true });

    // Fallback in case transitionend doesn't fire
    setTimeout(showUI, 1000);
  }, 500);

  closeOverlay.onclick = () => {
    videoFrame.src = '';
    overlay.style.display = 'none';
  };

  document.querySelectorAll('nav button').forEach(btn => {
    btn.onclick = () => {
      alert("Page not implemented yet: " + btn.dataset.page);
    };
  });

  document.getElementById("searchMovie").onclick = () => {
    alert("Movie search not connected yet.");
  };

  document.getElementById("searchTV").onclick = () => {
    alert("TV search not connected yet.");
  };
});
