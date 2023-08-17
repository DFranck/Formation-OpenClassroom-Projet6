/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable quotes */

// ************************
// *** Variables mise a jour dans plusieurs fonctions ***
// ************************

const sortMenu = document.getElementById("sort-menu");
const popularitySortBtn = document.getElementById("popularity-sort-btn");
const dateSortBtn = document.getElementById("date-sort-btn");
const titleSortBtn = document.getElementById("title-sort-btn");
const activeSortBtn = document.getElementById("active-sort-btn");
const previousMediaBtn = document.getElementById("lightbox-modal-previous");
const nextMediaBtn = document.getElementById("lightbox-modal-next");
const modalMedia = document.getElementById("modal-media");
let currentIndex = "";
let activeSort = popularitySortBtn.value;

// ************************
// *** Fonctions de récupération de données (Fetch) ***
// ************************

/**
 * Récupère les données du photographe.
 */
async function getPhotographer() {
  const response = await fetch("../../data/photographers.json");
  if (!response.ok) {
    throw new Error(`Failed to fetch photographer: ${response.statusText}`);
  }
  const { photographers } = await response.json();
  return targetPhotographer(photographers);
}

/**
 * Récupère la galerie du photographe.
 */
async function getPhotographerGallery(photographerOfThePage) {
  const response = await fetch("../../data/photographers.json");
  const { media } = await response.json();
  return targetPhotographerMedia(media, photographerOfThePage);
}
// ***************************
// *** Fonctions de traitement des données (Tri, ciblage) ***
// ***************************

/**
 * Détermine quel photographe doit être ciblé pour l'affichage.
 */
function targetPhotographer(photographers) {
  const photographerOfThePage = photographers.find(
    (photographer) =>
      photographer.id.toString() ===
      new URLSearchParams(window.location.search).get("id")
  );
  return photographerOfThePage;
}
/**
 * Détermine les médias liés au photographe ciblé.
 */
function targetPhotographerMedia(media, photographerOfThePage) {
  const mediaOfThePage = media.filter(
    (medias) => medias.photographerId === photographerOfThePage.id
  );
  return mediaOfThePage;
}

// *******************************
// *** Fonctions d'affichage    ***
// *******************************

/**
 * Affiche les détails du photographe dans l'en-tête.
 */
function displayPhotographerHeader(name, city, country, tagline, portrait) {
  const photographerinfo = document.querySelector(".photographer-infos");
  const photographerPortrait = document.querySelector(".photographer-portrait");
  const h2 = document.createElement("h2");
  h2.textContent = name;
  const h3 = document.createElement("h3");
  h3.textContent = `${city}, ${country}`;
  const p = document.createElement("p");
  p.textContent = tagline;
  const img = document.createElement("img");
  img.src = `../assets/photographers/${portrait}`;
  img.setAttribute("alt", `Photo de ${name}`);
  photographerinfo.appendChild(h2);
  photographerinfo.appendChild(h3);
  photographerinfo.appendChild(p);
  photographerPortrait.appendChild(img);
}
/**
 * Affiche la galerie du photographe.
 */
function displayPhotographerGallery(mediaOfThePage) {
  mediaOfThePage.forEach((galleryMedia) => {
    const gallery = document.querySelector(".gallery");
    const { title, likes, image, video, photographerId, id } = galleryMedia;
    const miniatureUrl = galleryMedia.image
      ? `../assets/gallery/${photographerId}/${image}`
      : `../assets/gallery/${photographerId}/${video}`;
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.className = "card";
    const figure = document.createElement("figure");
    const figcaption = document.createElement("figcaption");
    figcaption.className = "article-info";
    const miniature = document.createElement(
      galleryMedia.image ? "img" : "video"
    );
    miniature.src = miniatureUrl;
    miniature.setAttribute("alt", `${title}`);
    button.setAttribute("id", id);
    miniature.setAttribute("role", "lightbox-modal-toggle");
    const h3 = document.createElement("h3");
    h3.textContent = title;
    const likeBtn = document.createElement("button");
    likeBtn.innerHTML = `${likes} <i class="fa-solid fa-heart"></i>`;
    likeBtn.className = "like-btn";
    likeBtn.setAttribute("id", `${id}`);
    likeBtn.setAttribute("aria-label", "likes");
    figure.appendChild(miniature);
    figure.appendChild(figcaption);
    figcaption.appendChild(h3);
    li.appendChild(likeBtn);
    gallery.appendChild(li);
    button.appendChild(figure);
    li.appendChild(button);
  });
  const likes = document.querySelectorAll(".like-btn");
  likes.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleLikes(e.currentTarget.id, mediaOfThePage);
    });
  });
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      const mediaId = Number(e.currentTarget.id);
      lightboxModalToggle(mediaOfThePage, mediaId);
    });
  });
  cards.forEach((card) => {
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.keyCode === 13) {
        const mediaId = Number(e.currentTarget.id);
        lightboxModalToggle(mediaOfThePage, mediaId);
      }
    });
  });
}
/**
 * Affiche les informations supplémentaires du photographe dans la section à côté.
 */
function displayPhotographerAside(price, mediaOfThePage) {
  const asideContainer = document.getElementById("aside-container");
  const sumLikes = mediaOfThePage.reduce((sum, media) => sum + media.likes, 0);
  const photographerOfThePageTotalLikes = document.createElement("h3");
  photographerOfThePageTotalLikes.innerHTML = `${sumLikes} <i class="fa-solid fa-heart"></i>`;
  const photographerOfThePagePrice = document.createElement("h3");
  photographerOfThePagePrice.textContent = `${price}€ / jour`;
  asideContainer.appendChild(photographerOfThePageTotalLikes);
  asideContainer.appendChild(photographerOfThePagePrice);
}
/**
 * Affiche toutes les informations et la galerie du photographe.
 */
function displayPhotographer(photographerOfThePage, mediaOfThePage) {
  if (!photographerOfThePage) {
    document.body.innerHTML = "<h1>Error 404: Photographer Not Found</h1>";
  }
  const { name, city, country, tagline, portrait, price } =
    photographerOfThePage;

  displayPhotographerHeader(name, city, country, tagline, portrait);
  displayPhotographerGallery(mediaOfThePage);
  displayPhotographerAside(price, mediaOfThePage);
}

// *******************************
// *** Gestion des Likes ***
// *******************************
async function handleLikes(id, mediaOfThePage) {
  const gallery = document.querySelector(".gallery");
  const asideContainer = document.getElementById("aside-container");
  const { price } = await getPhotographer();
  const whatMedia = mediaOfThePage.find((media) => media.id === Number(id));
  whatMedia.likes += 1;
  gallery.innerHTML = "";
  asideContainer.innerHTML = "";
  displayPhotographerGallery(mediaOfThePage);
  displayPhotographerAside(price, mediaOfThePage);
}
// *******************************
// *** Gestion du tri de la galerie ***
// *******************************
async function sortGallery(selectedSort) {
  const photographerOfThePage = await getPhotographer();
  const mediaOfThePage = await getPhotographerGallery(photographerOfThePage);
  const gallery = document.querySelector(".gallery");
  if (selectedSort === popularitySortBtn.value) {
    mediaOfThePage.sort((a, b) => b.likes - a.likes);
    sortMenu.setAttribute("aria-activedescendant", `popularity-sort-btn`);
    popularitySortBtn.setAttribute("aria-selected", "true");
  } else if (selectedSort === dateSortBtn.value) {
    mediaOfThePage.sort((a, b) => new Date(b.date) - new Date(a.date));
    sortMenu.setAttribute("aria-activedescendant", `date-sort-btn`);
    dateSortBtn.setAttribute("aria-selected", "true");
  } else if (selectedSort === titleSortBtn.value) {
    mediaOfThePage.sort((a, b) => a.title.localeCompare(b.title));
    sortMenu.setAttribute("aria-activedescendant", `title-sort-btn`);
    titleSortBtn.setAttribute("aria-selected", "true");
  }
  gallery.innerHTML = "";
  displayPhotographerGallery(mediaOfThePage);
}

function toggleMenu() {
  sortMenu.style.visibility = "visible";
  activeSortBtn.setAttribute("aria-expanded", "true");
  const sortMenuBtn = [popularitySortBtn, dateSortBtn, titleSortBtn];
  sortMenuBtn.forEach((btn) => {
    btn.setAttribute("aria-selected", "false");
    btn.addEventListener("click", () => {
      activeSort = btn.value;
      sortMenu.style.visibility = "hidden";
      activeSortBtn.setAttribute("aria-expanded", "false");
      activeSortBtn.innerHTML = `${activeSort} <i class="fa-solid fa-chevron-down"></i>`;
      sortGallery(activeSort);
    });
  });
}

activeSortBtn.addEventListener("click", () => {
  toggleMenu();
});

// *******************************
// *** Gestion de la Lightbox ***
// *******************************
function lightboxModalDisplay(mediaOfThePage, currentIndex) {
  let CurrentMediaTitle = "";
  let CurrentMediaContent = "";
  let lightboxModalMediaUrl = "";
  const closeLightbox = document.getElementById("lightbox-modal-close");

  if (currentIndex === 0) {
    previousMediaBtn.style.visibility = "hidden";
  } else if (currentIndex === mediaOfThePage.length - 1) {
    nextMediaBtn.style.visibility = "hidden";
  } else {
    previousMediaBtn.style.visibility = "visible";
    nextMediaBtn.style.visibility = "visible";
  }
  const media = mediaOfThePage[currentIndex];
  const modalTitle = document.getElementById("modal-title");
  CurrentMediaTitle = media.title;
  CurrentMediaContent = document.createElement(media.image ? "img" : "video");
  if (!media.image) CurrentMediaContent.controls = true;
  lightboxModalMediaUrl = media.image
    ? `../assets/gallery/${media.photographerId}/${media.image}`
    : `../assets/gallery/${media.photographerId}/${media.video}`;
  CurrentMediaContent.src = lightboxModalMediaUrl;
  CurrentMediaContent.setAttribute("alt", `image  de ${media.title}`);
  CurrentMediaContent.classList.add("current-media");
  modalMedia.appendChild(CurrentMediaContent);
  modalTitle.textContent = CurrentMediaTitle;
  closeLightbox.addEventListener("click", () => {
    handleCloseLightbox(currentIndex);
    console.log(currentIndex);
  });
}

function handleCloseLightbox() {
  const lightboxModal = document.getElementById("lightbox-modal");
  const asideContainer = document.getElementById("aside-container");
  const closeLightbox = document.getElementById("lightbox-modal-close");
  modalMedia.removeChild(modalMedia.lastChild);
  lightboxModal.style.display = "none";
  asideContainer.style.visibility = "visible";
  closeLightbox.removeEventListener("click", () => {});
}
function lightboxModalToggle(mediaOfThePage, mediaId) {
  const lightboxModal = document.getElementById("lightbox-modal");
  const asideContainer = document.getElementById("aside-container");
  const closeLightbox = document.getElementById("lightbox-modal-close");
  currentIndex = mediaOfThePage.findIndex((media) => media.id === mediaId);
  lightboxModal.style.display = "flex";
  asideContainer.style.visibility = "hidden";
  lightboxModalDisplay(mediaOfThePage, currentIndex);

  previousMediaBtn.addEventListener("click", () => {
    modalMedia.removeChild(modalMedia.lastChild);
    currentIndex -= 1;
    const newCurrentIndex = currentIndex;
    console.log(currentIndex, newCurrentIndex);
    if (newCurrentIndex >= 0 && newCurrentIndex < mediaOfThePage.length) {
      lightboxModalDisplay(mediaOfThePage, newCurrentIndex);
    }
  });
  nextMediaBtn.addEventListener("click", () => {
    modalMedia.removeChild(modalMedia.lastChild);
    currentIndex += 1;
    const newCurrentIndex = currentIndex;
    console.log(currentIndex, newCurrentIndex);
    if (newCurrentIndex >= 0 && newCurrentIndex < mediaOfThePage.length) {
      lightboxModalDisplay(mediaOfThePage, newCurrentIndex);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (lightboxModal.style.display === "flex") {
      switch (e.key) {
        case "ArrowRight":
          if (!(currentIndex === mediaOfThePage.length - 1)) {
            nextMediaBtn.click();
          }
          break;
        case "ArrowLeft":
          if (!(currentIndex === 0)) {
            previousMediaBtn.click();
          }
          break;
        case "Escape":
          closeLightbox.click();
          break;
        default:
          break;
      }
    }
  });
}
// *******************************
// *** Initialisation de l'app ***
// *******************************

async function init() {
  const photographerOfThePage = await getPhotographer();
  const mediaOfThePage = await getPhotographerGallery(photographerOfThePage);
  displayPhotographer(photographerOfThePage, mediaOfThePage);
  activeSortBtn.innerHTML = `${activeSort} <i class="fa-solid fa-chevron-down"></i>`;
}

init();
