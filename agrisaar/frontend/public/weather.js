// weather.js - Weather-related functionality

// Global weather object
const weather = {
  apiKey: "your_api_key_here", // This would be replaced with a real API key
  baseUrl: "https://api.openweathermap.org/data/2.5/weather", // Example API endpoint
  units: "metric",
};

// Function to get weather by location (mock version)
function getWeatherByLocation(lat, lon) {
  return new Promise((resolve) => {
    // Simulate API call with timeout
    setTimeout(() => {
      const mockWeather = {
        main: {
          temp: Math.round(25 + Math.random() * 10),
          humidity: Math.round(30 + Math.random() * 50),
        },
        weather: [
          {
            main: ["Sunny", "Clouds", "Rain", "Thunderstorm"][
              Math.floor(Math.random() * 4)
            ],
            description: [
              "Clear sky",
              "Partly cloudy",
              "Light rain",
              "Thunderstorm",
            ][Math.floor(Math.random() * 4)],
            icon: "01d", // Default icon code
          },
        ],
        wind: {
          speed: (Math.random() * 10).toFixed(1),
        },
        name: "Pune", // Default location name
      };

      resolve(mockWeather);
    }, 1000);
  });
}

// Function to update weather display with real data
async function updateWeatherWithRealData() {
  try {
    // For demo purposes, we'll use mock data
    const weatherData = await getWeatherByLocation();

    const weatherDisplay = {
      temperature: `${weatherData.main.temp}°C`,
      description: weatherData.weather[0].main,
      icon: getWeatherIcon(weatherData.weather[0].icon),
    };

    // Save to localStorage
    localStorage.setItem("weatherData", JSON.stringify(weatherDisplay));

    // Update the display
    document.getElementById("weather-icon").textContent = weatherDisplay.icon;
    document.getElementById(
      "temperature"
    ).textContent = `Temperature: ${weatherDisplay.temperature}`;
    document.getElementById("weather-description").textContent =
      weatherDisplay.description;
  } catch (error) {
    console.error("Error fetching weather:", error);
    document.getElementById("weather-description").textContent =
      "Weather data unavailable";
  }
}

// Helper function to convert weather icon codes to emoji
function getWeatherIcon(iconCode) {
  const iconMap = {
    "01d": "☀️", // clear sky (day)
    "01n": "🌙", // clear sky (night)
    "02d": "⛅", // few clouds (day)
    "02n": "⛅", // few clouds (night)
    "03d": "☁️", // scattered clouds
    "03n": "☁️", // scattered clouds
    "04d": "☁️", // broken clouds
    "04n": "☁️", // broken clouds
    "09d": "🌧️", // shower rain
    "09n": "🌧️", // shower rain
    "10d": "🌦️", // rain (day)
    "10n": "🌧️", // rain (night)
    "11d": "⚡", // thunderstorm
    "11n": "⚡", // thunderstorm
    "13d": "❄️", // snow
    "13n": "❄️", // snow
    "50d": "🌫️", // mist
    "50n": "🌫️", // mist
  };

  return iconMap[iconCode] || "⛅";
}

// Initialize weather with real data (commented out for demo)
// updateWeatherWithRealData();
