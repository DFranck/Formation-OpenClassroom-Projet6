/* eslint-disable quotes */
function getPhotographer() {
  const displayPhotographers = document.querySelector(
    // eslint-disable-next-line comma-dangle
    ".photographer_section"
  );
  // prettier me remet les double guillment a chaques save
  fetch("../data/photographers.json")
    .then((res) => res.json())
    .then((data) => {
      const photographersInfo = data.photographers.map((photographers) => {
        const photographerName = photographers.name;
        const photographerPic = `./assets/photographers/${photographers.portrait}`;
        const photographerCity = photographers.city;
        const photographerCountry = photographers.country;
        const photographerTagline = photographers.tagline;
        const photographerPrice = photographers.price;
        const photographerId = photographers.id;
        // console.log(photographers);
        return {
          photographerPic,
          photographerName,
          photographerCity,
          photographerCountry,
          photographerTagline,
          photographerPrice,
          photographerId,
        };
      });
      photographersInfo.forEach((photographer) => {
        displayPhotographers.innerHTML += `
          <article class="photographer_card">
            <img src="${photographer.photographerPic}" alt="Portrait de ${photographer.photographerName}"/>
            <h2>${photographer.photographerName}</h2>
            <h4>${photographer.photographerCity}, ${photographer.photographerCountry}</h4>
            <p>${photographer.photographerTagline}</p>
            <aside>${photographer.photographerPrice}€/jour</aside>
          </article>
        `;
      });
    });
}

getPhotographer();
// async function getPhotographers() {
// Ceci est un exemple de données pour avoir un
// affichage de photographes de test dès le démarrage du projet,
//   // mais il sera à remplacer avec une requête sur le fichier JSON en utilisant "fetch".
//   let photographers = [
//     {
//       name: "Ma data test",
//       id: 1,
//       city: "Paris",
//       country: "France",
//       tagline: "Ceci est ma data test",
//       price: 400,
//       portrait: "account.png",
//     },
//     {
//       name: "Autre data test",
//       id: 2,
//       city: "Londres",
//       country: "UK",
//       tagline: "Ceci est ma data test 2",
//       price: 500,
//       portrait: "account.png",
//     },
//   ];
//   // et bien retourner le tableau photographers seulement une fois récupéré
//   return {
//     photographers: [...photographers, ...photographers, ...photographers],
//   };
// }

// async function displayData(photographers) {
//   const photographersSection = document.querySelector(".photographer_section");

//   photographers.forEach((photographer) => {
//     const photographerModel = photographerTemplate(photographer);
//     const userCardDOM = photographerModel.getUserCardDOM();
//     photographersSection.appendChild(userCardDOM);
//   });
// }

// async function init() {
//   // Récupère les datas des photographes
//   const { photographers } = await getPhotographers();
//   displayData(photographers);
// }

// init();
