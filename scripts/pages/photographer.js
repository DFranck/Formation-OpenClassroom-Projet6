/* eslint-disable linebreak-style */
/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable quotes */
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

function displayPhotographerHeader(name, city, country, tagline, portrait) {
  const photographerinfo = document.querySelector(".photographer-infos");
  const photographerPortrait = document.querySelector(".photographer-portrait");
  const h2 = document.createElement("h2");
  h2.textContent = name;
  const h3 = document.createElement("h3");
  h3.textContent = `${city}, ${country}`;
  const p = document.createElement("p");
  p.textContent = tagline;
  photographerinfo.appendChild(h2);
  photographerinfo.appendChild(h3);
  photographerinfo.appendChild(p);
  const img = `assets/photographers/${portrait}`;
  photographerPortrait.style.backgroundImage = `url(${img})`;
}
function displayPhotographerGallery(portrait) {
  const response = fetch(`../../assets/gallery/${portrait}`);
  return response.json();
}

function displayPhotographer(photographerOfThePage) {
  if (!photographerOfThePage) {
    document.body.innerHTML = "<h1>Error 404: Photographer Not Found</h1>";
  }
  const { name, city, country, tagline, portrait } = photographerOfThePage;
  displayPhotographerHeader(name, city, country, tagline, portrait);
  displayPhotographerGallery(portrait);
}

async function init() {
  const photographerOfThePage = await getPhotographer();
  displayPhotographer(photographerOfThePage);
}

init();
