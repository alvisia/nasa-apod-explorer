// No need to import axios - using axios cdn in html script tag

const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const favoritesBtn = document.getElementById("favorites-btn");
const exploreBtn = document.getElementById("explore-btn");
const backToExploreBtn = document.getElementById("back-to-explore-btn");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");
const emptyMessage = document.getElementById("empty-message-container");
const errorContainer = document.getElementById("error-container");
const datePicker = document.getElementById("input-date");
const searchDateBtn = document.getElementById("search-date");

// NASA API
const count = 10;
const API_KEY = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=${count}`;

let resultsArray = [];
let favorites = {};

// Date Config
const currentDate = new Date().toISOString().split("T")[0];
datePicker.setAttribute("max", currentDate);

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
    updateDom("results");
  } catch (error) {
    showErrorState();
  } finally {
    stopLoading();
  }
}

function showContent() {
  window.scrollTo({ top: 0, behavior: "instant" });
  loader.classList.add("hidden");
}

function createDOMNodes(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);
  currentArray.forEach((result) => {
    // Card Container
    const card = document.createElement("div");
    card.classList.add("card");

    // Card Image or Video
    const link = document.createElement("a");
    let media;

    if (result.media_type === "video") {
      media = document.createElement("div");
      media.classList.add("card-video-top");

      const playIcon = document.createElement("i");
      playIcon.classList.add("fa-solid", "fa-play");

      link.href = result.url;
      link.title = "View Video";
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

      if (result.hdurl) {
        link.href = result.hdurl;
      } else {
        link.href = result.url;
      }
      link.title = "View Full Image";
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

    // Card Body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // Card Title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    // Add to Favorites
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
    // Card Text
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = result.explanation;
    // Footer Container
    const footer = document.createElement("small");
    footer.classList.add("card-meta");
    // Date
    const date = document.createElement("strong");
    date.textContent = result.date;
    // Copyright
    const copyrightResult =
      result.copyright === undefined ? "" : ` • ${result.copyright}`;
    const copyright = document.createElement("span");
    copyright.textContent = ` ${copyrightResult}`;
    // Append
    footer.append(date, copyright);
    cardBody.append(cardTitle, addFavoriteBtn, cardText, footer);
    card.appendChild(cardBody);
    imagesContainer.appendChild(card);
  });
}

function updateDom(page) {
  // Get favorites from localStorage
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
  }
  if (page === "results") {
    resultsNav.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
    emptyMessage.classList.add("hidden");
  }
  if (page === "favorites") {
    if (Object.values(favorites).length === 0) {
      emptyMessage.classList.remove("hidden");
    } else {
      emptyMessage.classList.add("hidden");
    }
    errorContainer.classList.add("hidden");
    favoritesNav.classList.remove("hidden");
    resultsNav.classList.add("hidden");
  }
  imagesContainer.textContent = "";
  createDOMNodes(page);
  showContent();
}

function startLoading() {
  errorContainer.classList.add("hidden");
  imagesContainer.classList.remove("hidden");
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
  imagesContainer.classList.add("hidden");
}

// Get 10 images from NASA API
async function getNasaPictures() {
  startLoading();
  try {
    const response = await axios.get(apiUrl);
    resultsArray = response.data;
    updateDom("results");
  } catch (error) {
    showErrorState();
  } finally {
    stopLoading();
  }
}

// Add result to favorites
function saveFavorite(itemUrl) {
  // Loop through results array to select Favorite
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      // Show Save Confirmation for 2 Seconds
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      // Set Favorites in localStorage
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}

// Remove Item from favorites
function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    // Set Favorites in localStorage
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    updateDom("favorites");
  }
}

// Event Listeners
favoritesBtn.addEventListener("click", () => {
  updateDom("favorites");
});

exploreBtn.addEventListener("click", getNasaPictures);

backToExploreBtn.addEventListener("click", getNasaPictures);

searchDateBtn.addEventListener("click", searchByDate);

// On Load
getNasaPictures();
