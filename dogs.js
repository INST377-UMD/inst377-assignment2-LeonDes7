fetch('https://dogapi.dog/api/v2/breeds')
  .then(res => res.json())
  .then(data => {
    const breedsContainer = document.getElementById('breedsContainer');
    data.data.forEach(breed => {
      const button = document.createElement('button');
      button.className = 'button-89';
      button.innerText = breed.attributes.name;

      button.addEventListener('click', () => showBreedInfo(breed));
      breedsContainer.appendChild(button);
    });
  });

function showBreedInfo(breed) {
  const infoBox = document.getElementById('breedInfo');
  infoBox.style.display = 'block';
  infoBox.innerHTML = `
    <h4>${breed.attributes.name}</h4>
    <p><strong>Description:</strong> ${breed.attributes.description || 'N/A'}</p>
    <p><strong>Lifespan:</strong> ${breed.attributes.life.min} - ${breed.attributes.life.max} years</p>
  `;
}

// Load dog images for carousel
fetch('https://dog.ceo/api/breeds/image/random/10')
  .then(res => res.json())
  .then(data => {
    const carousel = document.getElementById('dogCarousel');
    data.message.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.style.width = '200px';
      img.style.borderRadius = '10px';
      img.onerror = () => img.style.display = 'none'; 
      carousel.appendChild(img);
    });
  });

if (window.annyang) {
  const commands = {
    'hello': () => alert('Hello World'),
    'change the color to *color': color => document.body.style.backgroundColor = color,
    'navigate to *page': page => {
      const path = page.toLowerCase();
      if (path === 'home') location.href = 'index.html';
      else if (path === 'stocks') location.href = 'stocks.html';
      else if (path === 'dogs') location.href = 'dogs.html';
    },
    'load dog breed *breed': function (spokenBreed) {
      fetch('https://dogapi.dog/api/v2/breeds')
        .then(res => res.json())
        .then(data => {
          const match = data.data.find(b =>
            b.attributes.name.toLowerCase() === spokenBreed.toLowerCase()
          );
          if (match) {
            showBreedInfo(match);
          } else {
            alert(`Breed "${spokenBreed}" not found.`);
          }
        });
    }
  };

  annyang.addCommands(commands);
}