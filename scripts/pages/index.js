/* eslint-disable no-undef */
/* eslint-disable object-curly-newline */
/* eslint-disable quotes */
async function getPhotographers() {
  const response = await fetch("../../data/photographers.json");
  const { photographers } = await response.json();
  return {
    photographers,
  };
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
