// weather.js
const API_KEY = "your_openweather_api_key"; // Replace with your actual API key

async function fetchWeatherData(location) {
  try {
    // First get coordinates for the location
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      location
    )}&limit=1&appid=${API_KEY}`;

    const geoResponse = await fetch(geoUrl);
    if (!geoResponse.ok) {
      throw new Error(`HTTP error: ${geoResponse.status}`);
    }

    const geoData = await geoResponse.json();
    if (!geoData.length) {
      throw new Error("Location not found");
    }

    const { lat, lon } = geoData[0];

    // Then get weather data using coordinates
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error(`HTTP error: ${weatherResponse.status}`);
    }

    return await weatherResponse.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

function updateWeatherUI(weatherData) {
  if (!weatherData) {
    document.getElementById("weather-description").textContent =
      "Weather data unavailable";
    return;
  }

  const temperature = document.getElementById("temperature");
  const weatherDescription = document.getElementById("weather-description");
  const weatherIcon = document.getElementById("weather-icon");

  // Update temperature
  temperature.textContent = `Temperature: ${Math.round(
    weatherData.main.temp
  )}°C`;

  // Update weather description
  weatherDescription.textContent = weatherData.weather[0].description;

  // Update weather icon
  const iconCode = weatherData.weather[0].icon;
  weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${weatherData.weather[0].description}">`;
}
