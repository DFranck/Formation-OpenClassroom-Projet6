/* eslint-disable object-curly-newline */
/* eslint-disable quotes */
async function getPhotographers() {
  const response = await fetch("../../data/photographers.json");
  const { photographers } = await response.json();
  return {
    photographers,
  };
}

function photographerTemplate(photographer) {
  const { name, portrait, tagline, price, city, country } = photographer;

  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    const h2 = document.createElement("h2");
    h2.textContent = name;
    const p = document.createElement("p");
    p.textContent = tagline;
    const h3 = document.createElement("h3");
    h3.textContent = `${city}, ${country}`;
    const h4 = document.createElement("h4");
    h4.textContent = `${price}/jour`;
    article.appendChild(img);
    article.appendChild(h2);
    article.appendChild(h3);
    article.appendChild(p);
    article.appendChild(h4);
    return article;
  }
  return { name, picture, getUserCardDOM };
}

function displayPhotographers(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  const { photographers } = await getPhotographers();
  displayPhotographers(photographers);
}

init();
