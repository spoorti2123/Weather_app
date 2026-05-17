
const appId = '71f6779186cc32448b4c412eea65b982';
const units = 'metric';
let searchMethod;

const weatherEmojis = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Smoke': '💨',
    'Haze': '🌫️',
    'Dust': '🌪️',
    'Fog': '🌫️',
    'Sand': '🌪️',
    'Ash': '🌋',
    'Squall': '💨',
    'Tornado': '🌪️'
};

const backgroundGradients = {
    'Clear': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'Clouds': 'linear-gradient(135deg, #667eea 0%, #748aa6 100%)',
    'Rain': 'linear-gradient(135deg, #667eea 0%, #4c63a6 100%)',
    'Drizzle': 'linear-gradient(135deg, #667eea 0%, #4c63a6 100%)',
    'Thunderstorm': 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    'Snow': 'linear-gradient(135deg, #b3ddf5 0%, #e8f4f8 100%)',
    'Mist': 'linear-gradient(135deg, #9bb8d8 0%, #c9d9e3 100%)'
};

function getSearchMethod(searchTerm) {
    if (searchTerm.length === 5 && Number.parseInt(searchTerm) + '' === searchTerm)
        searchMethod = 'zip';
    else
        searchMethod = 'q';
}

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'flex';
    document.getElementById('weatherContent').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('weatherContent').style.display = 'block';
}

function searchWeather(searchTerm) {
    if (!searchTerm.trim()) {
        showError('Please enter a city name');
        return;
    }

    getSearchMethod(searchTerm);
    showLoading();
    document.getElementById('errorMessage').style.display = 'none';

    fetch(`https://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&APPID=${appId}&units=${units}`)
        .then((result) => {
            if (!result.ok) {
                throw new Error('City not found');
            }
            return result.json();
        })
        .then((res) => {
            init(res);
        })
        .catch((error) => {
            hideLoading();
            showError('Error: ' + error.message);
        });
}

function getWeatherIcon(weatherMain) {
    return weatherEmojis[weatherMain] || '🌤️';
}

function setBackgroundGradient(weatherMain) {
    const gradient = backgroundGradients[weatherMain] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    document.body.style.background = gradient;
}

function formatDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

function init(resultFromServer) {
    const weatherMain = resultFromServer.weather[0].main;
    const weatherDescription = resultFromServer.weather[0].description;

    // Update background
    setBackgroundGradient(weatherMain);

    // Update DOM elements
    document.getElementById('cityHeader').textContent = `${resultFromServer.name}, ${resultFromServer.sys.country}`;
    document.getElementById('dateTime').textContent = formatDate();
    document.getElementById('weatherIcon').textContent = getWeatherIcon(weatherMain);
    document.getElementById('temperature').textContent = Math.floor(resultFromServer.main.temp);
    document.getElementById('weatherDescriptionHeader').textContent = weatherDescription;
    document.getElementById('feelsLike').textContent = `Feels like ${Math.floor(resultFromServer.main.feels_like)}°C`;
    document.getElementById('humidity').textContent = `${resultFromServer.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${Math.floor(resultFromServer.wind.speed)} m/s`;
    document.getElementById('pressure').textContent = `${resultFromServer.main.pressure} hPa`;
    document.getElementById('visibility').textContent = `${(resultFromServer.visibility / 1000).toFixed(1)} km`;

    hideLoading();
}

// Event listeners
document.getElementById('searchBtn').addEventListener('click', () => {
    const searchTerm = document.getElementById('searchInput').value;
    searchWeather(searchTerm);
});

document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = document.getElementById('searchInput').value;
        searchWeather(searchTerm);
    }
});

// Default weather on load
window.addEventListener('load', () => {
    searchWeather('London');
});
