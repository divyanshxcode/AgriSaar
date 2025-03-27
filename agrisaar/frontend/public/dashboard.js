// dashboard.js - Main dashboard functionality

// Initialize the dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Load farm data from localStorage or set defaults
  loadFarmData();

  // Initialize weather data
  initializeWeather();

  // Initialize market prices
  initializeMarketPrices();

  // Set up event listeners
  setupEventListeners();
});

// ================== DATA LOADING FUNCTIONS ==================

function loadFarmData() {
  // Try to load saved data from localStorage
  const savedData = JSON.parse(localStorage.getItem("farmData")) || {};

  // Update the display with saved data or defaults
  document.getElementById("region").textContent = savedData.region || "Pune";
  document.getElementById("crop").textContent = savedData.crop || "Wheat";
  document.getElementById("season").textContent = savedData.season || "Kharif";
  document.getElementById("size").textContent = savedData.size || "2.5";
}

function initializeWeather() {
  // Check if weather data exists in localStorage
  const savedWeather = JSON.parse(localStorage.getItem("weatherData"));

  if (savedWeather) {
    updateWeatherDisplay(savedWeather);
  } else {
    // Fetch fresh weather data
    fetchWeatherData();
  }
}

function initializeMarketPrices() {
  // Check if market data exists in localStorage
  const savedPrices = JSON.parse(localStorage.getItem("marketPrices"));

  if (savedPrices) {
    updateMarketPricesTable(savedPrices);
  } else {
    // Fetch fresh market data
    fetchMarketPrices();
  }
}

// ================== DATA FETCHING FUNCTIONS ==================

function fetchWeatherData() {
  // Show loading state
  document.getElementById("weather-description").textContent =
    "Fetching weather...";

  // Simulate API call with timeout
  setTimeout(() => {
    // Generate mock weather data
    const weatherData = {
      temperature: `${Math.round(25 + Math.random() * 10)}°C`,
      description: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"][
        Math.floor(Math.random() * 4)
      ],
      icon: "⛅",
    };

    // Save to localStorage
    localStorage.setItem("weatherData", JSON.stringify(weatherData));

    // Update display
    updateWeatherDisplay(weatherData);
  }, 1500);
}

function fetchMarketPrices() {
  // Generate mock market data
  const marketData = [
    {
      mandi: "Pune",
      price: Math.round(2000 + Math.random() * 500),
      distance: "30 km",
    },
    {
      mandi: "Nashik",
      price: Math.round(2200 + Math.random() * 600),
      distance: "50 km",
    },
    {
      mandi: "Mumbai",
      price: Math.round(2500 + Math.random() * 700),
      distance: "120 km",
    },
  ];

  // Save to localStorage
  localStorage.setItem("marketPrices", JSON.stringify(marketData));

  // Update display
  updateMarketPricesTable(marketData);
}

// ================== DISPLAY UPDATE FUNCTIONS ==================

function updateWeatherDisplay(weather) {
  const weatherIcon = document.getElementById("weather-icon");
  const tempElement = document.getElementById("temperature");
  const descElement = document.getElementById("weather-description");

  weatherIcon.textContent = weather.icon;
  tempElement.textContent = `Temperature: ${weather.temperature}`;
  descElement.textContent = weather.description;

  // Set appropriate emoji based on weather
  switch (weather.description) {
    case "Sunny":
      weatherIcon.textContent = "☀️";
      break;
    case "Partly Cloudy":
      weatherIcon.textContent = "⛅";
      break;
    case "Cloudy":
      weatherIcon.textContent = "☁️";
      break;
    case "Rainy":
      weatherIcon.textContent = "🌧️";
      break;
  }
}

function updateMarketPricesTable(prices) {
  const tableBody = document.querySelector("table tbody");
  tableBody.innerHTML = ""; // Clear existing rows

  prices.forEach((price) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${price.mandi}</td>
            <td>₹${price.price.toLocaleString()}</td>
            <td>${price.distance}</td>
        `;
    tableBody.appendChild(row);
  });
}

// ================== UTILITY FUNCTIONS ==================

function setupEventListeners() {
  // Back button functionality
  document.querySelector(".back-btn").addEventListener("click", goBack);

  // Refresh weather button (would need to be added to HTML)
  // document.getElementById('refresh-weather').addEventListener('click', fetchWeatherData);
}

function goBack() {
  window.history.back();
}

// ================== OFFLINE FUNCTIONALITY ==================

// Check if browser supports service workers
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful");
      })
      .catch((err) => {
        console.log("ServiceWorker registration failed: ", err);
      });
  });
}

// ================== PERIODIC UPDATES ==================

// Update weather every hour
setInterval(fetchWeatherData, 3600000);

// Update market prices every 4 hours
setInterval(fetchMarketPrices, 14400000);
