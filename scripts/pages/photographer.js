/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable quotes */
const sortMenu = document.getElementById("sort-menu");
const popularitySortBtn = document.getElementById("popularity-sort-btn");
const dateSortBtn = document.getElementById("date-sort-btn");
const titleSortBtn = document.getElementById("title-sort-btn");
const activeSortBtn = document.getElementById("active-sort-btn");
const lightboxModal = document.getElementById("lightbox-modal");

let activeSort = popularitySortBtn.value;

function targetPhotographer(photographers) {
  const photographerOfThePage = photographers.find(
    (photographer) =>
      photographer.id.toString() ===
      new URLSearchParams(window.location.search).get("id")
  );
  return photographerOfThePage;
}
async function getPhotographer() {
  const response = await fetch("../../data/photographers.json");
  const { photographers } = await response.json();
  return targetPhotographer(photographers);
}

function targetPhotographerMedia(media, photographerOfThePage) {
  const mediaOfThePage = media.filter(
    (medias) => medias.photographerId === photographerOfThePage.id
  );
  return mediaOfThePage;
}

async function getPhotographerGallery(photographerOfThePage) {
  const response = await fetch("../../data/photographers.json");
  const { media } = await response.json();
  return targetPhotographerMedia(media, photographerOfThePage);
}

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
  img.src = `assets/photographers/${portrait}`;
  img.setAttribute("alt", `Photo de ${name}`);
  photographerinfo.appendChild(h2);
  photographerinfo.appendChild(h3);
  photographerinfo.appendChild(p);
  photographerPortrait.appendChild(img);
}
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

function lightboxModalDisplay(mediaOfThePage, currentIndex) {
  const previousMediaBtn = document.getElementById("lightbox-modal-previous");
  const nextMediaBtn = document.getElementById("lightbox-modal-next");
  if (currentIndex === 0) {
    previousMediaBtn.style.visibility = "hidden";
  } else if (currentIndex === mediaOfThePage.length - 1) {
    nextMediaBtn.style.visibility = "hidden";
  } else {
    previousMediaBtn.style.visibility = "visible";
    nextMediaBtn.style.visibility = "visible";
  }
  const media = mediaOfThePage[currentIndex];
  const LightboxModalTitle = document.createElement("h5");
  const lightboxModalMedia = document.createElement(
    media.image ? "img" : "video"
  );
  if (!media.image) {
    lightboxModalMedia.controls = true;
  }
  const lightboxModalMediaUrl = media.image
    ? `assets/gallery/${media.photographerId}/${media.image}`
    : `assets/gallery/${media.photographerId}/${media.video}`;
  LightboxModalTitle.textContent = media.title;
  lightboxModalMedia.src = lightboxModalMediaUrl;
  document.getElementById("modal-media").appendChild(lightboxModalMedia);
  document.getElementById("modal-title").appendChild(LightboxModalTitle);
}

function lightboxModalToggle(mediaOfThePage, mediaId) {
  const asideContainer = document.getElementById("aside-container");
  const closeLightbox = document.getElementById("lightbox-modal-close");
  let currentIndex = mediaOfThePage.findIndex((media) => media.id === mediaId);
  const previousMediaBtn = document.getElementById("lightbox-modal-previous");
  const nextMediaBtn = document.getElementById("lightbox-modal-next");
  lightboxModal.style.display = "flex";
  asideContainer.style.visibility = "hidden";
  lightboxModalDisplay(mediaOfThePage, currentIndex);
  closeLightbox.addEventListener("click", (e) => {
    lightboxModal.style.display = "none";
    asideContainer.style.visibility = "visible";
    e.stopPropagation();
  });
  previousMediaBtn.addEventListener("click", () => {
    document.getElementById("modal-media").innerHTML = "";
    document.getElementById("modal-title").innerHTML = "";
    currentIndex -= 1;
    const newCurrentIndex = currentIndex;
    if (newCurrentIndex >= 0 && newCurrentIndex < mediaOfThePage.length) {
      lightboxModalDisplay(mediaOfThePage, newCurrentIndex);
    }
  });
  nextMediaBtn.addEventListener("click", () => {
    document.getElementById("modal-media").innerHTML = "";
    document.getElementById("modal-title").innerHTML = "";
    currentIndex += 1;
    const newCurrentIndex = currentIndex;
    if (newCurrentIndex >= 0 && newCurrentIndex < mediaOfThePage.length) {
      lightboxModalDisplay(mediaOfThePage, newCurrentIndex);
    }
  });
}

function displayPhotographerGallery(mediaOfThePage) {
  mediaOfThePage.forEach((galleryMedia) => {
    const gallery = document.querySelector(".gallery");
    const { title, likes, image, video, photographerId, id } = galleryMedia;
    const miniatureUrl = galleryMedia.image
      ? `assets/gallery/${photographerId}/${image}`
      : `assets/gallery/${photographerId}/${video}`;
    const article = document.createElement("article");
    const articleInfo = document.createElement("div");
    articleInfo.className = "article-info";
    const miniature = document.createElement(
      galleryMedia.image ? "img" : "video"
    );
    miniature.src = miniatureUrl;
    miniature.setAttribute("alt", `${title}`);
    miniature.setAttribute("id", id);
    miniature.setAttribute("role", "lightbox-modal-toggle");
    const h3 = document.createElement("h3");
    h3.textContent = title;
    const p = document.createElement("p");
    p.innerHTML = `${likes} <i class="fa-solid fa-heart likes-icon" id="${id}"></i>`;
    p.setAttribute("aria-label", "likes");
    article.appendChild(miniature);
    article.appendChild(articleInfo);
    articleInfo.appendChild(h3);
    articleInfo.appendChild(p);
    gallery.appendChild(article);
  });
  const likesIcons = document.querySelectorAll(".likes-icon");
  likesIcons.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      e.stopPropagation();
      handleLikes(e.target.id, mediaOfThePage);
    });
  });
  const articles = document.querySelectorAll("article");
  articles.forEach((article) => {
    article.addEventListener("click", (e) => {
      const mediaId = Number(e.target.id);
      document.getElementById("modal-media").innerHTML = "";
      document.getElementById("modal-title").innerHTML = "";
      lightboxModalToggle(mediaOfThePage, mediaId);
    });
  });
}

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

async function init() {
  const photographerOfThePage = await getPhotographer();
  const mediaOfThePage = await getPhotographerGallery(photographerOfThePage);
  displayPhotographer(photographerOfThePage, mediaOfThePage);
  activeSortBtn.innerHTML = `${activeSort} <i class="fa-solid fa-chevron-down"></i>`;
  sortGallery(activeSort);
}

init();

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
