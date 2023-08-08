/* eslint-disable quotes */
async function getPhotographers() {
  const response = await fetch("../../data/photographers.json");
  const { photographers } = await response.json();
  console.log(photographers);
  return {
    photographers,
  };
}

function photographerTemplate(photographer) {
  const { name, portrait } = photographer;

  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    const h2 = document.createElement("h2");
    h2.textContent = name;
    article.appendChild(img);
    article.appendChild(h2);
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
  console.log(photographers);
}

init();
