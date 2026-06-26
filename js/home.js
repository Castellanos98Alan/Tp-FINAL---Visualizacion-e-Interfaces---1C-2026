const newsTrack = document.getElementById("newsTrack");
const prevNews = document.getElementById("prevNews");
const nextNews = document.getElementById("nextNews");

let currentIndex = 0;

function getVisibleNewsCount() {
  const width = window.innerWidth;

  if (width <= 700) {
    return 1;
  }

  if (width <= 1100) {
    return 2;
  }

  return 3;
}

function updateCarousel() {
  const newsItems = document.querySelectorAll(".news-item");
  const visibleNews = getVisibleNewsCount();
  const maxIndex = Math.max(newsItems.length - visibleNews, 0);

  if (currentIndex > maxIndex) {
    currentIndex = maxIndex;
  }

  const itemWidth = 100 / visibleNews;
  const move = currentIndex * itemWidth;

  newsTrack.style.transform = `translateX(-${move}%)`;
}

nextNews.addEventListener("click", () => {
  const newsItems = document.querySelectorAll(".news-item");
  const visibleNews = getVisibleNewsCount();
  const maxIndex = Math.max(newsItems.length - visibleNews, 0);

  if (currentIndex < maxIndex) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }

  updateCarousel();
});

prevNews.addEventListener("click", () => {
  const newsItems = document.querySelectorAll(".news-item");
  const visibleNews = getVisibleNewsCount();
  const maxIndex = Math.max(newsItems.length - visibleNews, 0);

  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = maxIndex;
  }

  updateCarousel();
});

window.addEventListener("resize", updateCarousel);

updateCarousel();