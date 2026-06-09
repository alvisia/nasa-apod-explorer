// Axios is loaded through the CDN script tag in index.html

// DOM Elements
const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const favoritesBtn = document.getElementById("favorites-btn");
const exploreBtn = document.getElementById("explore-btn");
const backToExploreBtn = document.getElementById("back-to-explore-btn");
const cardsContainer = document.querySelector(".cards-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");
const emptyMessage = document.getElementById("empty-message-container");
const errorContainer = document.getElementById("error-container");
const dateSearchContainer = document.querySelector(".search-date-container");
const datePicker = document.getElementById("input-date");
const searchDateBtn = document.getElementById("search-date");
const siteFooter = document.querySelector(".site-footer");

// NASA API Config
const count = 10;
const API_KEY = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=${count}`;

// App State
let resultsArray = [];
let favorites = {};

// Date Search Setup
const currentDate = new Date().toISOString().split("T")[0];
datePicker.setAttribute("max", currentDate);

// Fetch APOD data for a selected date
async function searchByDate() {
  const selectedDate = datePicker.value;

  if (selectedDate === "") {
    return;
  }

  startLoading();

  try {
    const dateApiUrl = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${selectedDate}`;
    const dateResponse = await axios.get(dateApiUrl);
    const dateArray = [dateResponse.data];

    resultsArray = dateArray;
    renderPage("results");
  } catch (error) {
    showErrorState();
  } finally {
    stopLoading();
  }
}

// Reset scroll position and hide loader after content renders
function showContent() {
  window.scrollTo({ top: 0, behavior: "instant" });
  loader.classList.add("hidden");
}

// Build and append a single APOD card based on media type and page context
function createCard(result, page) {
  const card = document.createElement("div");
  card.classList.add("card");

  const link = document.createElement("a");
  let media;

  if (result.media_type === "video") {
    media = document.createElement("div");
    media.classList.add("card-video-top");

    const playIcon = document.createElement("i");
    playIcon.classList.add("fa-solid", "fa-play");

    link.href = result.url;
    link.ariaLabel = `View video for ${result.title}`;
    link.title = `View video: ${result.title}`;
    link.target = "_blank";

    media.appendChild(playIcon);
    link.appendChild(media);
    card.appendChild(link);
  } else if (result.media_type === "image") {
    media = document.createElement("img");
    media.src = result.url;
    media.alt = result.title;
    media.loading = "lazy";
    media.classList.add("card-img-top");

    link.href = result.hdurl ? result.hdurl : result.url;
    link.ariaLabel = `View full image for ${result.title}`;
    link.title = `View full image: ${result.title}`;
    link.target = "_blank";

    link.appendChild(media);
    card.appendChild(link);
  } else {
    media = document.createElement("div");
    media.classList.add("unavailable-media");

    const unavailableTitle = document.createElement("h2");
    unavailableTitle.classList.add("unavailable-media-title");
    unavailableTitle.textContent = "Media Unavailable";

    const unavailableText = document.createElement("p");
    unavailableText.classList.add("unavailable-media-text");
    unavailableText.textContent = "This APOD media type is not supported.";

    media.append(unavailableTitle, unavailableText);
    card.appendChild(media);
  }

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = result.title;

  const addFavoriteBtn = document.createElement("button");
  addFavoriteBtn.classList.add("clickable", "add-favorites-btn");

  if (page === "results") {
    addFavoriteBtn.textContent = "Add to Favorites";
    addFavoriteBtn.onclick = () => {
      saveFavorite(result.url);
    };
  } else {
    addFavoriteBtn.textContent = "Remove from Favorites";
    addFavoriteBtn.onclick = () => {
      removeFavorite(result.url);
    };
  }

  const cardText = document.createElement("p");
  cardText.classList.add("card-text");
  cardText.textContent = result.explanation;

  const footer = document.createElement("small");
  footer.classList.add("card-meta");

  const date = document.createElement("strong");
  date.textContent = result.date;

  const copyrightResult =
    result.copyright === undefined ? "" : ` • ${result.copyright}`;
  const copyright = document.createElement("span");
  copyright.textContent = ` ${copyrightResult}`;

  footer.append(date, copyright);
  cardBody.append(cardTitle, addFavoriteBtn, cardText, footer);
  card.appendChild(cardBody);
  cardsContainer.appendChild(card);
}

// Choose the correct data source and render each card
function renderCards(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);

  currentArray.forEach((result) => {
    createCard(result, page);
  });
}

// Update visible page sections, clear old cards, and render the selected view
function renderPage(page) {
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
  }

  if (page === "results") {
    resultsNav.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
    emptyMessage.classList.add("hidden");
    dateSearchContainer.classList.remove("hidden");
    siteFooter.classList.remove("hidden");
  }
  if (page === "favorites") {
    if (Object.values(favorites).length === 0) {
      emptyMessage.classList.remove("hidden");
      siteFooter.classList.add("hidden");
    } else {
      emptyMessage.classList.add("hidden");
      siteFooter.classList.remove("hidden");
    }
    errorContainer.classList.add("hidden");
    favoritesNav.classList.remove("hidden");
    resultsNav.classList.add("hidden");
    dateSearchContainer.classList.add("hidden");
  }

  cardsContainer.textContent = "";
  renderCards(page);
  showContent();
}

// Loading and error states
function startLoading() {
  errorContainer.classList.add("hidden");
  cardsContainer.classList.remove("hidden");
  emptyMessage.classList.add("hidden");
  resultsNav.classList.remove("hidden");
  favoritesNav.classList.add("hidden");
  loader.classList.remove("hidden");

  favoritesBtn.disabled = true;
  exploreBtn.disabled = true;
  backToExploreBtn.disabled = true;
  searchDateBtn.disabled = true;
}

function stopLoading() {
  loader.classList.add("hidden");

  favoritesBtn.disabled = false;
  exploreBtn.disabled = false;
  backToExploreBtn.disabled = false;
  searchDateBtn.disabled = false;
}

function showErrorState() {
  errorContainer.classList.remove("hidden");
  cardsContainer.classList.add("hidden");
  siteFooter.classList.add("hidden");
}

// Fetch random APOD results
async function getNasaPictures() {
  startLoading();

  try {
    const response = await axios.get(apiUrl);
    resultsArray = response.data;
    renderPage("results");
  } catch (error) {
    showErrorState();
  } finally {
    stopLoading();
  }
}

// Favorites
function saveFavorite(itemUrl) {
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;

      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);

      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}

function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];

    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    renderPage("favorites");
  }
}

// Event Listeners
favoritesBtn.addEventListener("click", () => {
  renderPage("favorites");
});

exploreBtn.addEventListener("click", getNasaPictures);

backToExploreBtn.addEventListener("click", getNasaPictures);

searchDateBtn.addEventListener("click", searchByDate);

// Initial Load
getNasaPictures();
