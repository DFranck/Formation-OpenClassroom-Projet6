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
      //   console.log(data.photographers);
      const photographersInfo = data.photographers.map((photographers) => {
        // eslint-disable-next-line object-curly-newline, operator-linebreak
        const { city, country, id, name, portrait, price, tagline } =
          photographers;
        const photographerPic = `./assets/photographers/${portrait}`;
        // console.log(photographers);
        return {
          photographerPic,
          city,
          country,
          name,
          id,
          portrait,
          price,
          tagline,
        };
      });
      photographersInfo.forEach((photographer) => {
        displayPhotographers.innerHTML += `
          <article class="photographer_card">
            <img src="${photographer.photographerPic}" alt="Portrait de ${photographer.name}"/>
            <h2>${photographer.name}</h2>
            <h4>${photographer.city}, ${photographer.country}</h4>
            <p>${photographer.tagline}</p>
            <aside>${photographer.price}€/jour</aside>
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
