function photographerTemplate(photographer) {
  const {
    name, portrait, tagline, price, city, country, id,
  } = photographer;
  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.setAttribute('href', `/pages/photographer.html?id=${id}`);
    const img = document.createElement('img');
    img.setAttribute('src', picture);
    img.setAttribute('alt', `Photo de ${name}`);
    const h2 = document.createElement('h2');
    h2.textContent = name;
    const p = document.createElement('p');
    p.textContent = tagline;
    const h3 = document.createElement('h3');
    h3.textContent = `${city}, ${country}`;
    const h4 = document.createElement('h4');
    h4.textContent = `${price}/jour`;
    a.appendChild(img);
    a.appendChild(h2);
    a.appendChild(h3);
    a.appendChild(p);
    a.appendChild(h4);
    li.appendChild(a);

    return li;
  }
  return { getUserCardDOM };
}

export default photographerTemplate;
