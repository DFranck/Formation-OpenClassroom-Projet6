/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
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

const displayModalBtn = document.getElementById("open-contact-modal");
displayModalBtn.addEventListener("click", () => {
  async function displayModal() {
    const photographerOfThePage = await getPhotographer();
    const modal = document.getElementById("contact_modal");
    modal.style.visibility = "visible";
    document.body.classList.add("backgroundBlur");
    const { name, id } = photographerOfThePage;
    const modalTitle = document.getElementById("contact-modal-title");
    modalTitle.innerHTML = `Contactez-moi<br/>${name}`;
    const prenomInput = document.getElementById("prenom");
    prenomInput.focus();

    return id;
    // document.addEventListener('keydown'(e)=>{
    //   if (e.key==="Tab")
    // })
  }
  displayModal();
});
const closeModalBtn = document.getElementById("close-contact-modal");
function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.visibility = "hidden";
  document.body.classList.remove("backgroundBlur");
}
closeModalBtn.addEventListener("click", () => {
  closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

function submitForm(e) {
  const inputsForm = e.target.querySelectorAll("input, textarea");
  inputsForm.forEach((input) => {
    const inputValue = input.value;
    const inputName = input.id;
    console.log(`${inputName} = ${inputValue}`);
    closeModal();
  });
}
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  submitForm(e);
});
