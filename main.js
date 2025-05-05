if (window.annyang) {
    const commands = {
      'hello': () => alert('Hello World'),
  
      'change the color to *color': function(color) {
        document.body.style.backgroundColor = color;
      },
  
      'navigate to *page': function(page) {
        const target = page.toLowerCase();
        if (target === 'home') window.location.href = 'index.html';
        else if (target === 'stocks') window.location.href = 'stocks.html';
        else if (target === 'dogs') window.location.href = 'dogs.html';
      }
    };
  
    if (window.location.pathname.includes('stocks')) {
      commands['lookup *ticker'] = function(ticker) {
        if (typeof fetchStockData === 'function') {
          fetchStockData(ticker.toUpperCase());
        } else {
          alert('Stock lookup not available yet.');
        }
      };
    }
  
    if (window.location.pathname.includes('dogs')) {
      commands['load dog breed *breed'] = function(spokenBreed) {
        fetch('https://dogapi.dog/api/v2/breeds')
          .then(res => res.json())
          .then(data => {
            const match = data.data.find(b => b.attributes.name.toLowerCase() === spokenBreed.toLowerCase());
            if (match && typeof showBreedInfo === 'function') {
              showBreedInfo(match);
            } else {
              alert(`Breed "${spokenBreed}" not found.`);
            }
          });
      };
    }
  
    annyang.addCommands(commands);
  }