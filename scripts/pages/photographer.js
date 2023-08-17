/* eslint-disable linebreak-style */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
// ************************
// *** Variables Globales ***
// ************************
const sortMenu = document.getElementById("sort-menu");
const popularitySortBtn = document.getElementById("popularity-sort-btn");
const dateSortBtn = document.getElementById("date-sort-btn");
const titleSortBtn = document.getElementById("title-sort-btn");
const activeSortBtn = document.getElementById("active-sort-btn");
let activeSort = popularitySortBtn.value;

// ************************
// *** FETCH et ISOLATION des DATA START***
// ************************
async function getAllData() {
  const response = await fetch("../../data/photographers.json");
  const { media, photographers } = await response.json();
  return { media, photographers };
}
async function getDataOfThePage() {
  const { media, photographers } = await getAllData();
  const photographerOfThePage = photographers.find(
    (photographer) =>
      photographer.id.toString() ===
      new URLSearchParams(window.location.search).get("id")
  );
  const mediasOfThePage = media.filter(
    (data) => data.photographerId === photographerOfThePage.id
  );
  return { photographerOfThePage, mediasOfThePage };
}
// ************************
// *** FETCH et ISOLATION des DATA END***
// ************************

// ************************
// *** DISPLAY START ***
// ************************
function displayPhotographerHeader(city, country, name, portrait, tagline) {
  const photographerinfo = document.querySelector(".photographer-infos");
  const photographerPortrait = document.querySelector(".photographer-portrait");
  photographerinfo.innerHTML = "";
  photographerPortrait.innerHTML = "";
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
function displayPhotographerDetailsFooter(price, mediasOfThePage) {
  let totalLikes = 0;
  mediasOfThePage.forEach((media) => {
    const { likes } = media;
    totalLikes += likes;
  });
  document.getElementById("details-footer-container").innerHTML = `
  <p>${totalLikes} <i class="fa-solid fa-heart"></i></p>
  <p>${price}€ / jour</p>
  `;
}
function displayPhotographerOfThePage(photographerOfThePage, mediasOfThePage) {
  const { city, country, id, name, portrait, price, tagline } =
    photographerOfThePage;
  displayPhotographerHeader(city, country, name, portrait, tagline);
  displayPhotographerDetailsFooter(price, mediasOfThePage);
}
function displayMediaOfThePage(mediasOfThePage) {
  mediasOfThePage.forEach((galleryMedia) => {
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
}
async function displayDataOfThePage(photographerOfThePage, mediasOfThePage) {
  displayPhotographerOfThePage(photographerOfThePage, mediasOfThePage);
  displayMediaOfThePage(mediasOfThePage);
  handleLikes(photographerOfThePage, mediasOfThePage);
}

// ************************
// *** DISPLAY END ***
// ************************

// ************************
// *** SORT START ***
// ************************
async function sortGallery(selectedSort) {
  const { photographerOfThePage, mediasOfThePage } = await getDataOfThePage();
  const gallery = document.querySelector(".gallery");
  if (selectedSort === popularitySortBtn.value) {
    mediasOfThePage.sort((a, b) => b.likes - a.likes);
    sortMenu.setAttribute("aria-activedescendant", `popularity-sort-btn`);
    popularitySortBtn.setAttribute("aria-selected", "true");
  } else if (selectedSort === dateSortBtn.value) {
    mediasOfThePage.sort((a, b) => new Date(b.date) - new Date(a.date));
    sortMenu.setAttribute("aria-activedescendant", `date-sort-btn`);
    dateSortBtn.setAttribute("aria-selected", "true");
  } else if (selectedSort === titleSortBtn.value) {
    mediasOfThePage.sort((a, b) => a.title.localeCompare(b.title));
    sortMenu.setAttribute("aria-activedescendant", `title-sort-btn`);
    titleSortBtn.setAttribute("aria-selected", "true");
  }
  gallery.innerHTML = "";
  displayDataOfThePage(photographerOfThePage, mediasOfThePage);
}
function toggleMenu() {
  sortMenu.style.visibility = "visible";
  activeSortBtn.setAttribute("aria-expanded", "true");
}
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
activeSortBtn.addEventListener("click", () => {
  toggleMenu();
});
// ************************
// *** SORT END ***
// ************************
// ************************
// *** HANDLE LIKES START ***
// ************************
function handleLikes(photographerOfThePage, mediasOfThePage) {
  const likes = document.querySelectorAll(".like-btn");
  const gallery = document.querySelector(".gallery");
  const asideContainer = document.getElementById("details-footer-container");
  likes.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const whatMedia = mediasOfThePage.find(
        (media) => media.id === Number(e.currentTarget.id)
      );
      e.stopPropagation();
      whatMedia.likes += 1;
      gallery.innerHTML = "";
      asideContainer.innerHTML = "";
      document.querySelector(".photographer-infos").innerHTML = "";
      document.querySelector(".photographer-portrait").innerHTML = "";
      displayDataOfThePage(photographerOfThePage, mediasOfThePage);
    });
  });
}
// ************************
// *** HANDLE LIKES END ***
// ************************
// ************************
// *** LIGHTBOX START ***
// ************************
function lightboxModalNav(currentIndex, mediasOfThePage) {
  const closeLightbox = document.getElementById("lightbox-modal-close");
  const previousMediaBtn = document.getElementById("lightbox-modal-previous");
  const nextMediaBtn = document.getElementById("lightbox-modal-next");
  const lightboxModal = document.getElementById("lightbox-modal");

  previousMediaBtn.addEventListener("click", () => {
    currentIndex -= 1;
    const newCurrentIndex = currentIndex;
    if (newCurrentIndex >= 0 && newCurrentIndex < mediasOfThePage.length) {
      lightboxModalDisplay(newCurrentIndex, mediasOfThePage);
    }
  });
  nextMediaBtn.addEventListener("click", () => {
    currentIndex += 1;
    const newCurrentIndex = currentIndex;
    if (newCurrentIndex >= 0 && newCurrentIndex < mediasOfThePage.length) {
      lightboxModalDisplay(newCurrentIndex, mediasOfThePage);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (lightboxModal.style.display === "flex") {
      switch (e.key) {
        case "ArrowRight":
          if (!(currentIndex === mediasOfThePage.length - 1)) {
            currentIndex += 1;
            const newCurrentIndex = currentIndex;
            if (
              newCurrentIndex >= 0 &&
              newCurrentIndex < mediasOfThePage.length
            ) {
              lightboxModalDisplay(newCurrentIndex, mediasOfThePage);
            }
          }
          break;
        case "ArrowLeft":
          if (!(currentIndex === 0)) {
            currentIndex -= 1;
            const newCurrentIndex = currentIndex;
            if (
              newCurrentIndex >= 0 &&
              newCurrentIndex < mediasOfThePage.length
            ) {
              lightboxModalDisplay(newCurrentIndex, mediasOfThePage);
            }
          }
          break;
        case "Escape":
          lightboxModalClose();
          break;
        default:
          break;
      }
    }
  });
}
function lightboxModalDisplay(currentIndex, mediasOfThePage) {
  let CurrentMediaTitle = "";
  let CurrentMediaContent = "";
  let lightboxModalMediaUrl = "";
  const closeLightbox = document.getElementById("lightbox-modal-close");
  const previousMediaBtn = document.getElementById("lightbox-modal-previous");
  const nextMediaBtn = document.getElementById("lightbox-modal-next");
  const modalTitle = document.getElementById("modal-title");
  const modalMedia = document.getElementById("modal-media");
  modalMedia.removeChild(modalMedia.lastChild);
  const media = mediasOfThePage[currentIndex];
  CurrentMediaContent = document.createElement(media.image ? "img" : "video");
  CurrentMediaTitle = media.title;
  if (!media.image) {
    CurrentMediaContent.controls = true;
    document.addEventListener("keydown", function playPauseVideo(event) {
      if (event.code === "Space") {
        if (CurrentMediaContent.paused) {
          CurrentMediaContent.play();
        } else {
          CurrentMediaContent.pause();
        }
        event.preventDefault();
      }
    });
  }
  lightboxModalMediaUrl = media.image
    ? `../assets/gallery/${media.photographerId}/${media.image}`
    : `../assets/gallery/${media.photographerId}/${media.video}`;
  CurrentMediaContent.src = lightboxModalMediaUrl;
  CurrentMediaContent.setAttribute("alt", `image  de ${media.title}`);
  CurrentMediaContent.classList.add("current-media");
  if (currentIndex === 0) {
    previousMediaBtn.style.visibility = "hidden";
  } else if (currentIndex === mediasOfThePage.length - 1) {
    nextMediaBtn.style.visibility = "hidden";
  } else {
    previousMediaBtn.style.visibility = "visible";
    nextMediaBtn.style.visibility = "visible";
  }
  modalMedia.appendChild(CurrentMediaContent);
  modalTitle.textContent = CurrentMediaTitle;
}
function lightboxModalClose() {
  const lightboxModal = document.getElementById("lightbox-modal");
  const asideContainer = document.getElementById("details-footer-container");
  const modalMedia = document.getElementById("modal-media");
  lightboxModal.style.display = "none";
  asideContainer.style.visibility = "visible";
}
function lightboxModalOpen(mediaId, mediasOfThePage) {
  const lightboxModal = document.getElementById("lightbox-modal");
  const asideContainer = document.getElementById("details-footer-container");
  lightboxModal.style.display = "flex";
  asideContainer.style.visibility = "hidden";
  const currentIndex = mediasOfThePage.findIndex(
    (media) => media.id === mediaId
  );
  lightboxModalDisplay(currentIndex, mediasOfThePage);
  lightboxModalNav(currentIndex, mediasOfThePage);
}
function lightboxModalToggle(mediasOfThePage) {
  const cards = document.querySelectorAll(".card");
  let mediaId = "";
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      mediaId = Number(e.currentTarget.id);
      lightboxModalOpen(mediaId, mediasOfThePage);
    });
  });
  const closeLightbox = document.getElementById("lightbox-modal-close");
  closeLightbox.addEventListener("click", () => {
    lightboxModalClose();
  });
}
// ************************
// *** LIGHTBOX END ***
// ************************
// ************************
// *** INIT START ***
// ************************
async function initialisation() {
  const { photographerOfThePage, mediasOfThePage } = await getDataOfThePage();
  await displayDataOfThePage(photographerOfThePage, mediasOfThePage);
  lightboxModalToggle(mediasOfThePage);
  activeSortBtn.innerHTML = `${activeSort} <i class="fa-solid fa-chevron-down"></i>`;
}
initialisation();
// ************************
// *** INIT END ***
// ************************
