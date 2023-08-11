/* eslint-disable linebreak-style */
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
  img.setAttribute("alt", name);
  photographerinfo.appendChild(h2);
  photographerinfo.appendChild(h3);
  photographerinfo.appendChild(p);
  photographerPortrait.appendChild(img);
}
function displayPhotographerGallery(mediaOfThePage) {
  mediaOfThePage.forEach((galleryMedia) => {
    const { title, likes, image, video, photographerId } = galleryMedia;
    const miniatureUrl = galleryMedia.image
      ? `assets/gallery/${photographerId}/${image}`
      : `assets/gallery/${photographerId}/${video}`;
    const gallery = document.querySelector(".gallery");
    const article = document.createElement("article");
    const articleInfo = document.createElement("div");
    articleInfo.className = "article-info";
    const miniature = document.createElement(
      galleryMedia.image ? "img" : "video"
    );
    miniature.src = miniatureUrl;
    miniature.setAttribute("alt", title);
    const h3 = document.createElement("h3");
    h3.textContent = title;
    const p = document.createElement("span");
    p.className = "likes-span";
    p.innerHTML = `${likes} <i class="fa-solid fa-heart"></i>`;

    article.appendChild(miniature);
    article.appendChild(articleInfo);
    articleInfo.appendChild(h3);
    articleInfo.appendChild(p);
    gallery.appendChild(article);
  });
}

function displayPhotographer(photographerOfThePage, mediaOfThePage) {
  if (!photographerOfThePage) {
    document.body.innerHTML = "<h1>Error 404: Photographer Not Found</h1>";
  }
  const { name, city, country, tagline, portrait } = photographerOfThePage;

  displayPhotographerHeader(name, city, country, tagline, portrait);
  displayPhotographerGallery(mediaOfThePage);
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
