// ===================== APP STATE =====================
let currentUnit = 'celsius';
let currentWeatherData = null;
let isDarkMode = false;

// ===================== DOM ELEMENTS =====================
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const themeToggle = document.getElementById('themeToggle');
const unitBtns = document.querySelectorAll('.unit-btn');
const recentChips = document.getElementById('recentChips');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const currentWeather = document.getElementById('currentWeather');
const forecastSection = document.getElementById('forecastSection');

// Weather display elements
const cityName = document.getElementById('cityName');
const country = document.getElementById('country');
const weatherIcon = document.getElementById('weatherIcon');
const weatherDescription = document.getElementById('weatherDescription');
const temperature = document.getElementById('temperature');
const tempUnit = document.getElementById('tempUnit');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const forecastContainer = document.getElementById('forecastContainer');

// ===================== WEATHER ICON MAPPING =====================
const weatherIcons = {
    '01d': '☀️',  // clear sky day
    '01n': '🌙',  // clear sky night
    '02d': '⛅',  // few clouds day
    '02n': '☁️',  // few clouds night
    '03d': '☁️',  // scattered clouds
    '03n': '☁️',
    '04d': '☁️',  // broken clouds
    '04n': '☁️',
    '09d': '🌧️',  // shower rain
    '09n': '🌧️',
    '10d': '🌦️',  // rain
    '10n': '🌧️',
    '11d': '⛈️',  // thunderstorm
    '11n': '⛈️',
    '13d': '❄️',  // snow
    '13n': '❄️',
    '50d': '🌫️',  // mist
    '50n': '🌫️'
};

// ===================== INITIALIZATION =====================
document.addEventListener('DOMContentLoaded', () => {
    // Check system theme preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        isDarkMode = true;
        document.body.classList.add('dark-mode');
    }
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        isDarkMode = true;
        document.body.classList.add('dark-mode');
    }
    
    // Load recent searches
    loadRecentSearches();
    
    // Load default city (New Delhi)
    getWeatherByCity('New Delhi');
});

// ===================== EVENT LISTENERS =====================
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
        cityInput.value = '';
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherByCity(city);
            cityInput.value = '';
        }
    }
});

locationBtn.addEventListener('click', () => {
    getWeatherByLocation();
});

themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

unitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const unit = btn.dataset.unit;
        if (unit !== currentUnit) {
            currentUnit = unit;
            unitBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update temperature display
            if (currentWeatherData) {
                updateTemperatureDisplay();
            }
        }
    });
});

// ===================== API FUNCTIONS =====================
async function getWeatherByCity(city) {
    showLoading();
    hideError();
    
    try {
        const response = await fetch(`/api/weather/city/${encodeURIComponent(city)}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch weather data');
        }
        
        currentWeatherData = data;
        displayWeather(data);
        saveToRecentSearches(city);
        
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

async function getWeatherByLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }
    
    showLoading();
    hideError();
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
                const response = await fetch(`/api/weather/coordinates?lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch weather data');
                }
                
                currentWeatherData = data;
                displayWeather(data);
                saveToRecentSearches(data.city);
                
            } catch (error) {
                showError(error.message);
            } finally {
                hideLoading();
            }
        },
        (error) => {
            hideLoading();
            showError('Unable to get your location. Please allow location access or search manually.');
        }
    );
}

// ===================== DISPLAY FUNCTIONS =====================
function displayWeather(data) {
    // Update city info
    cityName.textContent = data.city;
    country.textContent = data.country;
    
    // Update weather icon and description
    const icon = weatherIcons[data.icon] || '🌤️';
    weatherIcon.textContent = icon;
    weatherDescription.textContent = data.description;
    
    // Update temperature
    currentWeatherData = data;
    updateTemperatureDisplay();
    
    // Update weather details
    humidity.textContent = `${data.humidity}%`;
    windSpeed.textContent = `${data.wind_speed} km/h`;
    sunrise.textContent = data.sunrise;
    sunset.textContent = data.sunset;
    
    // Update forecast
    displayForecast(data.forecast);
    
    // Update background based on weather
    updateBackground(data.main, data.icon);
    
    // Show weather sections
    currentWeather.classList.add('show');
    forecastSection.classList.add('show');
}

function updateTemperatureDisplay() {
    if (!currentWeatherData) return;
    
    const tempValue = currentUnit === 'celsius' 
        ? currentWeatherData.temperature 
        : Math.round((currentWeatherData.temperature * 9/5) + 32);
    
    const feelsLikeValue = currentUnit === 'celsius'
        ? currentWeatherData.feels_like
        : Math.round((currentWeatherData.feels_like * 9/5) + 32);
    
    const unit = currentUnit === 'celsius' ? '°C' : '°F';
    
    temperature.textContent = tempValue;
    tempUnit.textContent = unit;
    feelsLike.innerHTML = `${feelsLikeValue}<span class=\"temp-unit-small\">${unit}</span>`;
    
    // Update all temp unit displays
    document.querySelectorAll('.temp-unit-small').forEach(el => {
        el.textContent = unit;
    });
}

function displayForecast(forecast) {
    forecastContainer.innerHTML = '';
    
    if (!forecast || forecast.length === 0) {
        forecastSection.style.display = 'none';
        return;
    }
    
    forecast.forEach(day => {
        const tempValue = currentUnit === 'celsius'
            ? day.temp
            : Math.round((day.temp * 9/5) + 32);
        
        const tempMin = currentUnit === 'celsius'
            ? day.temp_min
            : Math.round((day.temp_min * 9/5) + 32);
        
        const tempMax = currentUnit === 'celsius'
            ? day.temp_max
            : Math.round((day.temp_max * 9/5) + 32);
        
        const unit = currentUnit === 'celsius' ? '°C' : '°F';
        const icon = weatherIcons[day.icon] || '🌤️';
        
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <p class=\"forecast-date\">${day.date}</p>
            <div class=\"forecast-icon\">${icon}</div>
            <p class=\"forecast-temp\">${tempValue}${unit}</p>
            <p class=\"forecast-description\">${day.description}</p>
            <p class=\"forecast-temp-range\">H: ${tempMax}${unit} L: ${tempMin}${unit}</p>
        `;
        
        forecastContainer.appendChild(card);
    });
}

function updateBackground(weatherMain, iconCode) {
    // Remove all weather classes
    const weatherClasses = ['clear-day', 'clear-night', 'clouds', 'rain', 'drizzle', 'thunderstorm', 'snow', 'mist', 'fog', 'haze'];
    weatherClasses.forEach(cls => document.body.classList.remove(cls));
    
    // Determine background class
    let bgClass = 'clear-day';
    const isNight = iconCode.includes('n');
    
    switch(weatherMain.toLowerCase()) {
        case 'clear':
            bgClass = isNight ? 'clear-night' : 'clear-day';
            break;
        case 'clouds':
            bgClass = 'clouds';
            break;
        case 'rain':
            bgClass = 'rain';
            break;
        case 'drizzle':
            bgClass = 'drizzle';
            break;
        case 'thunderstorm':
            bgClass = 'thunderstorm';
            break;
        case 'snow':
            bgClass = 'snow';
            break;
        case 'mist':
        case 'fog':
        case 'haze':
        case 'smoke':
        case 'dust':
        case 'sand':
            bgClass = 'mist';
            break;
    }
    
    document.body.classList.add(bgClass);
}

// ===================== RECENT SEARCHES =====================
function saveToRecentSearches(city) {
    let recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    
    // Remove city if it already exists
    recent = recent.filter(c => c.toLowerCase() !== city.toLowerCase());
    
    // Add to beginning
    recent.unshift(city);
    
    // Keep only last 5
    recent = recent.slice(0, 5);
    
    localStorage.setItem('recentSearches', JSON.stringify(recent));
    loadRecentSearches();
}

function loadRecentSearches() {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    recentChips.innerHTML = '';
    
    recent.forEach(city => {
        const chip = document.createElement('button');
        chip.className = 'recent-chip';
        chip.textContent = city;
        chip.addEventListener('click', () => getWeatherByCity(city));
        recentChips.appendChild(chip);
    });
}

// ===================== UI HELPER FUNCTIONS =====================
function showLoading() {
    loading.classList.add('show');
    currentWeather.classList.remove('show');
    forecastSection.classList.remove('show');
}

function hideLoading() {
    loading.classList.remove('show');
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.add('show');
    currentWeather.classList.remove('show');
    forecastSection.classList.remove('show');
}

function hideError() {
    errorMessage.classList.remove('show');
}

// ===================== SYSTEM THEME DETECTION =====================
// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            isDarkMode = e.matches;
            document.body.classList.toggle('dark-mode', e.matches);
        }
    });
}
