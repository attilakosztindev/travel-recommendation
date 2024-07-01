document.addEventListener("DOMContentLoaded", function() {
  const links = document.querySelectorAll('nav ul li a');
  const root = document.getElementById('root');

  function loadPage(page) {
    fetch(`pages/${page}.html`)
      .then(response => response.text())
      .then(data => {
        root.innerHTML = data;
        updateTitle(page);
      })
      .catch(error => {
        root.innerHTML = `<p>Error loading page: ${error}</p>`;
        document.title = "Error";
      });
  }

  function updateTitle(page) {
    let title;
    switch (page) {
      case 'Home':
        title = "Home - Maui Travels";
        break;
      case 'AboutUs':
        title = "About Us - Maui Travels";
        break;
      case 'ContactUs':
        title = "Contact - Maui Travels";
        break;
      default:
        title = "Maui Travels";
    }
    document.title = title;
  }

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      loadPage(page);
      window.history.pushState({page: page}, '', `#${page}`);
    });
  });

  window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page) {
      loadPage(event.state.page);
    } else {
      loadPage('Home');
    }
  });

  const initialPage = window.location.hash.substring(1) || 'Home';
  loadPage(initialPage);
});

let recommendations = {};

async function fetchRecommendations() {
  try {
    const response = await fetch('travel_recommendation_api.json');
    recommendations = await response.json();
  } catch (error) {
    console.error('Error fetching recommendations:', error);
  }
}

function search() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
  resultsDiv.style.display = 'none';

  let results = [];

  if (input.includes('beach')) {
    results = recommendations.beaches;
  } else if (input.includes('temple')) {
    results = recommendations.temples;
  } else {
    recommendations.countries.forEach(country => {
      if (country.name.toLowerCase().includes(input)) {
        results.push(...country.cities);
      }
    });
  }

  if (results.length > 0) {
    results.forEach(item => {
      const resultItem = document.createElement('div');
      resultItem.classList.add('result-item');
      resultItem.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <button>Visit</button>
      `;
      resultsDiv.appendChild(resultItem);
    });
    resultsDiv.style.display = 'block';
  } else {
    resultsDiv.innerHTML = '<p>No results found</p>';
    resultsDiv.style.display = 'block';
  }
}

function clearInput() {
  document.getElementById('searchInput').value = '';
  document.getElementById('results').style.display = 'none';
}

window.onload = fetchRecommendations;