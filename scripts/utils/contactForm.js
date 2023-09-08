const modal = document.getElementById('contact_modal');
function targetPhotographer(photographers) {
  const photographerOfThePage = photographers.find(
    (photographer) => photographer.id.toString()
      === new URLSearchParams(window.location.search).get('id'),
  );
  return photographerOfThePage;
}
async function getPhotographer() {
  const response = await fetch('../../data/photographers.json');
  const { photographers } = await response.json();
  return targetPhotographer(photographers);
}

function closeModal() {
  modal.style.visibility = 'hidden';
  document.body.classList.remove('backgroundBlur');
}
function submitForm(e) {
  e.preventDefault();
  const inputsForm = e.target.querySelectorAll('input, textarea');
  inputsForm.forEach((input) => {
    const inputValue = input.value;
    const inputName = input.id;
    console.log(`${inputName} = ${inputValue}`);
  });
  closeModal();
  document.querySelector('form').reset();
}
function displayModal(name, prenomInput) {
  const modalTitle = document.getElementById('contact-modal-title');
  const closeModalBtn = document.getElementById('close-contact-modal');
  modal.style.visibility = 'visible';
  document.body.classList.add('backgroundBlur');
  modalTitle.innerHTML = `Contactez-moi<br/>${name}`;
  prenomInput.focus();
  closeModalBtn.addEventListener('click', () => {
    closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}
async function init() {
  const photographerOfThePage = await getPhotographer();
  const { name } = photographerOfThePage;
  const prenomInput = document.getElementById('prenom');
  const nomInput = document.getElementById('nom');
  const email = document.getElementById('email');
  const textArea = document.getElementById('text-area');
  const displayModalBtn = document.getElementById('open-contact-modal');
  displayModalBtn.addEventListener('click', () => {
    displayModal(name, prenomInput);
  });
  document.querySelector('form').addEventListener('submit', (e) => {
    if (prenomInput.value && nomInput.value && email.value && textArea.value) {
      submitForm(e);
    } else {
      e.preventDefault();
      alert('Le formulaire doit être rempli completement');
    }
  });
}

init();
