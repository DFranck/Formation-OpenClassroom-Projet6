
// ************************
// *** Variables Globales ***
// ************************
const sortMenu = document.getElementById("sort-menu");
const popularitySortBtn = document.getElementById("popularity-sort-btn");
const dateSortBtn = document.getElementById("date-sort-btn");
const titleSortBtn = document.getElementById("title-sort-btn");
const activeSortBtn = document.getElementById("active-sort-btn");

// ************************
// *** FETCH et ISOLATION des DATA***
// ************************

async function getDataOfThePage() {
  const response = await fetch("../../data/photographers.json");
  const { media, photographers } = await response.json();
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
// *** SORT ***
// ************************
async function sortGallery(
  selectedSort,
  photographerOfThePage,
  mediasOfThePage
) {
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
  displayMediaOfThePage(selectedSort, photographerOfThePage, mediasOfThePage);
}
// ************************
// *** DISPLAY ***
// ************************
/*
DISPLAY GALLERY
*/
function displayPhotographerHeader(city, country, name, portrait, tagline) {
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
  const { city, country, name, portrait, price, tagline } =
    photographerOfThePage;
  displayPhotographerHeader(city, country, name, portrait, tagline);
  displayPhotographerDetailsFooter(price, mediasOfThePage);
}
function displayMediaOfThePage(
  activeSort,
  photographerOfThePage,
  mediasOfThePage
) {
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
  handleLikes(photographerOfThePage, mediasOfThePage);
  toggleSortMenu(activeSort, photographerOfThePage, mediasOfThePage);
  lightboxModalToggle(mediasOfThePage);
}
/*
DISPLAY LIGHTBOX
*/
function lightboxModalDisplay(currentIndex, mediasOfThePage) {
  let currentMediaTitle = "";
  let currentMediaContent = "";
  let lightboxModalMediaUrl = "";
  const previousMediaBtn = document.getElementById("lightbox-modal-previous");
  const nextMediaBtn = document.getElementById("lightbox-modal-next");
  const modalTitle = document.getElementById("modal-title");
  const modalMedia = document.getElementById("modal-media");
  modalMedia.removeChild(modalMedia.lastChild);
  const media = mediasOfThePage[currentIndex];
  const {title, image, video,photographerId} = media
  currentMediaContent = document.createElement(image ? "img" : "video");
  currentMediaTitle = title;
  if (!image) {
    currentMediaContent.controls = true;
    document.addEventListener("keydown", function playPauseVideo(event) {
      if (event.code === "Space") {
        if (currentMediaContent.paused) {
          currentMediaContent.play();
        } else {
          currentMediaContent.pause();
        }
        event.preventDefault();
      }
    });
  }
  lightboxModalMediaUrl = image
    ? `../assets/gallery/${photographerId}/${image}`
    : `../assets/gallery/${photographerId}/${video}`;
  currentMediaContent.src = lightboxModalMediaUrl;
  currentMediaContent.setAttribute("alt", `image  de ${title}`);
  currentMediaContent.classList.add("current-media");
  if (currentIndex === 0) {
    previousMediaBtn.style.visibility = "hidden";
  } else if (currentIndex === mediasOfThePage.length - 1) {
    nextMediaBtn.style.visibility = "hidden";
  } else {
    previousMediaBtn.style.visibility = "visible";
    nextMediaBtn.style.visibility = "visible";
  }
  modalMedia.appendChild(currentMediaContent);
  modalTitle.textContent = currentMediaTitle;
}
// ************************
// *** INTERACTIONS ***
// ************************
/*
GESTION DU SORT
*/
function toggleSortMenu(activeSort, photographerOfThePage, mediasOfThePage) {
  const sortMenuBtn = [popularitySortBtn, dateSortBtn, titleSortBtn];
  function sortMenuOpen() {
    sortMenu.style.visibility = "visible";
    activeSortBtn.setAttribute("aria-expanded", "true");
  }
  function sortMenuClose() {
    sortMenu.style.visibility = "hidden";
    activeSortBtn.setAttribute("aria-expanded", "false");
    activeSortBtn.innerHTML = `${activeSort} <i class="fa-solid fa-chevron-down"></i>`;
    sortGallery(activeSort, photographerOfThePage, mediasOfThePage);
  }
  activeSortBtn.addEventListener("click", () => sortMenuOpen());
  sortMenuBtn.forEach((btn) => {
    btn.setAttribute("aria-selected", "false");
    btn.addEventListener("click", () => {
      activeSort = btn.value;
      sortMenuClose();
    });
  });
}
/*
GESTION DES LIKES
*/
function handleLikes(photographerOfThePage, mediasOfThePage) {
  const likesBtn = document.querySelectorAll(".like-btn");
  const { price } = photographerOfThePage;
  let whichMedia;
  likesBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (!btn.hasAttribute("data-clicked")) {
        whichMedia = mediasOfThePage.find(
          (media) => media.id === Number(`${e.currentTarget.id}`)
        );
        whichMedia.likes += 1;
        btn.innerHTML = `${whichMedia.likes} <i class="fa-solid fa-heart"></i>`;
        e.stopPropagation();
        displayPhotographerDetailsFooter(price, mediasOfThePage);
        btn.setAttribute("data-clicked", "true");
      }
    });
  });
}
/*
GESTION DE LA LIGHTBOX
*/
function lightboxModalToggle(mediasOfThePage) {
  const cards = document.querySelectorAll(".card");
  const closeLightbox = document.getElementById("lightbox-modal-close");
  const lightboxModal = document.getElementById("lightbox-modal");
  const asideContainer = document.getElementById("details-footer-container");
  const previousMediaBtn = document.getElementById("lightbox-modal-previous");
  const nextMediaBtn = document.getElementById("lightbox-modal-next");
  let mediaId = "";
  function lightboxModalOpen() {
    lightboxModal.style.visibility = "visible";
    asideContainer.style.visibility = "hidden";
    const currentIndex = mediasOfThePage.findIndex(
      (media) => media.id === mediaId
    );
    lightboxModalDisplay(currentIndex, mediasOfThePage);
    lightboxModalNav(currentIndex, mediasOfThePage);
  }
  function lightboxModalClose() {
    lightboxModal.style.visibility = "hidden";
    asideContainer.style.visibility = "visible";
    previousMediaBtn.style.visibility = "hidden";
    nextMediaBtn.style.visibility = "hidden";
  }
  closeLightbox.addEventListener("click", () => {
    lightboxModalClose();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") lightboxModalClose();
  });
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      mediaId = Number(e.currentTarget.id);
      lightboxModalOpen(mediaId, mediasOfThePage);
    });
  });
}

function lightboxModalNav(currentIndex, mediasOfThePage) {
  const previousMediaBtn = document.getElementById("lightbox-modal-previous");
  const nextMediaBtn = document.getElementById("lightbox-modal-next");
  const lightboxModal = document.getElementById("lightbox-modal");
  /*
CLICK NAVIGATION
*/
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
  /*
KEYBOARD NAVIGATION
*/
  document.addEventListener("keydown", (e) => {
    if (lightboxModal.style.visibility === "visible") {
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
        default:
          break;
      }
    }
  });
}

// ************************
// *** INIT START ***
// ************************
async function initialisation() {
  const { photographerOfThePage, mediasOfThePage } = await getDataOfThePage();
  displayPhotographerOfThePage(photographerOfThePage, mediasOfThePage);
  const activeSort = popularitySortBtn.value;
  activeSortBtn.innerHTML = `${activeSort} <i class="fa-solid fa-chevron-down"></i>`;
  await sortGallery(activeSort, photographerOfThePage, mediasOfThePage);
}
initialisation();
