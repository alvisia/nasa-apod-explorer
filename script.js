// No need to import axios - using axios cdn in html script tag

const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");
const emptyMessage = document.getElementById("empty-message-container");

// NASA API
const count = 10;
const API_KEY = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=${count}`;

let resultsArray = [];
let favorites = {};

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

      link.appendChild(media);
      media.appendChild(playIcon);
    } else if (result.media_type === "image") {
      media = document.createElement("img");
      media.src = result.url;
      media.alt = "NASA Picture of the Day";
      media.loading = "lazy";
      media.classList.add("card-img-top");

      link.href = result.hdurl;
      link.title = "View Full Image";

      link.appendChild(media);
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
    link.target = "_blank";
    card.appendChild(link);

    // Card Body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // Card Title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    // Add to Favorites
    const favoriteBtn = document.createElement("p");
    favoriteBtn.classList.add("clickable", "favorites-btn");
    if (page === "results") {
      favoriteBtn.textContent = "Add to Favorites";
      favoriteBtn.onclick = () => {
        saveFavorite(result.url);
      };
    } else {
      favoriteBtn.textContent = "Remove from Favorites";
      favoriteBtn.onclick = () => {
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
    cardBody.append(cardTitle, favoriteBtn, cardText, footer);
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

    favoritesNav.classList.remove("hidden");
    resultsNav.classList.add("hidden");
  }
  imagesContainer.textContent = "";
  createDOMNodes(page);
  showContent();
}

// Get 10 images from NASA API
async function getNasaPictures() {
  // Show Loader
  loader.classList.remove("hidden");
  try {
    const response = await axios.get(apiUrl);
    resultsArray = response.data;
    updateDom("results");
  } catch (error) {
    console.error(error);
    alert(error);
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

// On Load
getNasaPictures();
