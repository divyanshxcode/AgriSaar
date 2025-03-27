// Constants and configurations
const CONFIG = {
    API_ENDPOINTS: {
        WEATHER: '/api/weather',
        MARKET: '/api/market-prices',
        ADVISORY: '/api/crop-advisory'
    },
    REFRESH_INTERVAL: 300000, // 5 minutes
    ANIMATION_DURATION: 300
};

// Main application JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the dashboard
  initializeDashboard();

  // Event listeners
  document
    .getElementById("update-dashboard")
    .addEventListener("click", updateDashboard);
  document
    .getElementById("download-prices")
    .addEventListener("click", downloadPrices);
  document
    .getElementById("download-advisory")
    .addEventListener("click", downloadAdvisory);
  document
    .getElementById("offline-mode")
    .addEventListener("click", toggleOfflineMode);

  // Load initial data
  loadWeatherForecast();
  loadMarketPrices();
  loadCropAdvisory();
});

// Initialize the dashboard with default values
function initializeDashboard() {
  // Create forecast items
  const forecastContainer = document.querySelector(".forecast-container");
  const days = ["Today", "Tomorrow", "Wed", "Thu", "Fri"];
  const weatherIcons = [
    "sunny",
    "partly-cloudy",
    "rainy",
    "partly-cloudy",
    "sunny",
  ];
  const temperatures = ["32°C", "30°C", "28°C", "31°C", "33°C"];

  days.forEach((day, index) => {
    const forecastItem = document.createElement("div");
    forecastItem.className = "forecast-item";
    forecastItem.innerHTML = `
            <p>${day}</p>
            <img src="images/weather-icons/${weatherIcons[index]}.svg" alt="Weather">
            <p>${temperatures[index]}</p>
        `;
    forecastContainer.appendChild(forecastItem);
  });

  // Create advisory items
  const advisoryContent = document.getElementById("advisory-content");
  const advisories = [
    {
      title: "Irrigation",
      content:
        "Based on current soil moisture and weather forecast, irrigate your crop with 25mm water in the next 2 days.",
    },
    {
      title: "Pest Control",
      content:
        "Monitor for aphid infestation as conditions are favorable. Consider neem-based organic pesticide application if detected.",
    },
    {
      title: "Fertilizer Application",
      content:
        "Apply 10kg/acre of NPK (10-26-26) fertilizer within the next week for optimal growth at current stage.",
    },
  ];

  advisories.forEach((advisory) => {
    const advisoryItem = document.createElement("div");
    advisoryItem.className = "advisory-item";
    advisoryItem.innerHTML = `
            <h4>${advisory.title}</h4>
            <p>${advisory.content}</p>
        `;
    advisoryContent.appendChild(advisoryItem);
  });

  // Add initial market prices
  const priceTableBody = document.getElementById("price-table-body");
  const initialPrices = [
    { mandi: "Local APMC", price: 2200, distance: "5 km" },
    { mandi: "District Market", price: 2350, distance: "15 km" },
    { mandi: "Regional Hub", price: 2400, distance: "30 km" },
  ];

  initialPrices.forEach((price) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${price.mandi}</td>
            <td>₹${price.price}</td>
            <td>${price.distance}</td>
        `;
    priceTableBody.appendChild(row);
  });
}

// Update dashboard based on user input
function updateDashboard() {
  const region = document.getElementById("region").value;
  const crop = document.getElementById("crop").value;
  const season = document.querySelector('input[name="season"]:checked')?.value;
  const farmSize = document.getElementById("farm-size").value;

  if (!region || !crop || !season || !farmSize) {
    alert("Please fill in all the required fields");
    return;
  }

  // Show loading state
  showLoadingState();

  // Fetch data from backend
  fetchDashboardData(region, crop, season, farmSize)
    .then((data) => {
      updateWeatherSection(data.weather);
      updateMarketPrices(data.prices);
      updateCropAdvisory(data.advisory);
      hideLoadingState();
    })
    .catch((error) => {
      console.error("Error updating dashboard:", error);
      hideLoadingState();
      alert("Failed to update dashboard. Please try again.");
    });
}

// Simulate fetching data from backend
function fetchDashboardData(region, crop, season, farmSize) {
  // This would be an actual API call in production
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        weather: {
          current: {
            temperature: "29°C",
            description: "Mostly Sunny",
            icon: "sunny",
          },
          forecast: [
            { day: "Today", temp: "29°C", icon: "sunny" },
            { day: "Tomorrow", temp: "31°C", icon: "partly-cloudy" },
            { day: "Wed", temp: "33°C", icon: "sunny" },
            { day: "Thu", temp: "30°C", icon: "rainy" },
            { day: "Fri", temp: "28°C", icon: "rainy" },
          ],
          alerts: [
            {
              type: "warning",
              message:
                "Heavy rainfall expected in your region on Thursday and Friday. Consider harvesting mature crops before Thursday.",
            },
          ],
        },
        prices: [
          { mandi: "Pune APMC", price: 2450, distance: "12 km" },
          { mandi: "Khed Market", price: 2380, distance: "8 km" },
          { mandi: "Baramati Mandi", price: 2520, distance: "35 km" },
          { mandi: "Solapur APMC", price: 2490, distance: "65 km" },
        ],
        advisory: {
          cropStage: "Flowering",
          progress: 65,
          items: [
            {
              title: "Water Management",
              content:
                "Maintain adequate soil moisture during flowering stage. Irrigate with 30mm water every 7-10 days depending on soil type.",
            },
            {
              title: "Nutrient Management",
              content:
                "Apply foliar spray of 2% potassium nitrate to improve flowering and fruit set.",
            },
            {
              title: "Pest Alert",
              content:
                "High risk of bollworm infestation in your area. Scout fields every 2-3 days and apply recommended pesticides if threshold levels are reached.",
            },
            {
              title: "Market Intelligence",
              content:
                "Prices expected to rise by 8-10% in the next 3 weeks based on current trends. Consider delayed selling if storage is available.",
            },
          ],
        },
      });
    }, 1500);
  });
}

// Update weather section with new data
function updateWeatherSection(weatherData) {
  // Update current weather
  document.querySelector(".temperature").textContent =
    weatherData.current.temperature;
  document.querySelector(".weather-description").textContent =
    weatherData.current.description;
  document.getElementById(
    "weather-icon"
  ).src = `images/weather-icons/${weatherData.current.icon}.svg`;

  // Update forecast
  const forecastContainer = document.querySelector(".forecast-container");
  forecastContainer.innerHTML = "";

  weatherData.forecast.forEach((day) => {
    const forecastItem = document.createElement("div");
    forecastItem.className = "forecast-item";
    forecastItem.innerHTML = `
            <p>${day.day}</p>
            <img src="images/weather-icons/${day.icon}.svg" alt="Weather">
            <p>${day.temp}</p>
        `;
    forecastContainer.appendChild(forecastItem);
  });

  // Update weather alerts
  const weatherAlert = document.getElementById("weather-alert");
  if (weatherData.alerts && weatherData.alerts.length > 0) {
    const alert = weatherData.alerts[0];
    weatherAlert.innerHTML = `<p><strong>Alert:</strong> ${alert.message}</p>`;
    weatherAlert.style.display = "block";

    if (alert.type === "warning") {
      weatherAlert.style.backgroundColor = "rgba(255, 193, 7, 0.2)";
      weatherAlert.style.borderLeftColor = "var(--warning-color)";
    } else if (alert.type === "danger") {
      weatherAlert.style.backgroundColor = "rgba(244, 67, 54, 0.2)";
      weatherAlert.style.borderLeftColor = "var(--danger-color)";
    }
  } else {
    weatherAlert.style.display = "none";
  }
}

// Update market prices with new data
function updateMarketPrices(pricesData) {
  const priceTableBody = document.getElementById("price-table-body");
  priceTableBody.innerHTML = "";

  pricesData.forEach((price) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${price.mandi}</td>
            <td>₹${price.price}</td>
            <td>${price.distance}</td>
        `;
    priceTableBody.appendChild(row);
  });
}

// Update crop advisory with new data
function updateCropAdvisory(advisoryData) {
  // Update crop stage
  document.getElementById("crop-stage-value").textContent =
    advisoryData.cropStage;
  document.querySelector(".progress").style.width = `${advisoryData.progress}%`;

  // Update advisory items
  const advisoryContent = document.getElementById("advisory-content");
  advisoryContent.innerHTML = "";

  advisoryData.items.forEach((item) => {
    const advisoryItem = document.createElement("div");
    advisoryItem.className = "advisory-item";
    advisoryItem.innerHTML = `
            <h4>${item.title}</h4>
            <p>${item.content}</p>
        `;
    advisoryContent.appendChild(advisoryItem);
  });
}

// Show loading state while fetching data
function showLoadingState() {
  const loadingOverlay = document.createElement("div");
  loadingOverlay.className = "loading-overlay";
  loadingOverlay.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Updating your dashboard...</p>
    `;
  document.body.appendChild(loadingOverlay);

  // Add CSS for loading overlay
  const style = document.createElement("style");
  style.textContent = `
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.8);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(76, 175, 80, 0.2);
            border-top: 5px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
  document.head.appendChild(style);
}

// Hide loading state
function hideLoadingState() {
  const loadingOverlay = document.querySelector(".loading-overlay");
  if (loadingOverlay) {
    loadingOverlay.remove();
  }
}

// Download market prices as PDF or CSV
function downloadPrices() {
  // In a real application, this would generate a PDF or CSV file
  alert("Downloading market prices for offline viewing...");

  // Simulate download
  setTimeout(() => {
    const a = document.createElement("a");
    a.href =
      "data:text/plain;charset=utf-8,Mandi,Price,Distance\nPune APMC,₹2450,12 km\nKhed Market,₹2380,8 km\nBaramati Mandi,₹2520,35 km\nSolapur APMC,₹2490,65 km";
    a.download = "market_prices.csv";
    a.click();
  }, 1000);
}

// Download crop advisory as PDF
function downloadAdvisory() {
  // In a real application, this would generate a PDF file
  alert("Saving crop advisory for offline access...");

  // Simulate download
  setTimeout(() => {
    const a = document.createElement("a");
    a.href =
      "data:text/plain;charset=utf-8,Crop Advisory Report\n\nCrop: Cotton\nStage: Flowering\n\n1. Water Management: Maintain adequate soil moisture during flowering stage. Irrigate with 30mm water every 7-10 days depending on soil type.\n\n2. Nutrient Management: Apply foliar spray of 2% potassium nitrate to improve flowering and fruit set.\n\n3. Pest Alert: High risk of bollworm infestation in your area. Scout fields every 2-3 days and apply recommended pesticides if threshold levels are reached.\n\n4. Market Intelligence: Prices expected to rise by 8-10% in the next 3 weeks based on current trends. Consider delayed selling if storage is available.";
    a.download = "crop_advisory.txt";
    a.click();
  }, 1000);
}

// Toggle offline mode
function toggleOfflineMode(e) {
  e.preventDefault();

  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    // Toggle offline mode in a real app
    alert(
      "Offline mode enabled. Dashboard data will be available without internet connection."
    );
    e.target.textContent = "Disable Offline Mode";
  } else {
    alert(
      "Service Worker is not supported or not activated. Offline mode cannot be enabled."
    );
  }
}

// Change language
function changeLanguage(lang) {
  const buttons = document.querySelectorAll(".language-selector button");
  buttons.forEach((button) => button.classList.remove("active"));

  const selectedButton = document.querySelector(
    `.language-selector button[onclick="changeLanguage('${lang}')"]`
  );
  if (selectedButton) {
    selectedButton.classList.add("active");
  }

  // In a real application, this would load translations from a JSON file
  if (lang === "hi") {
    // Hindi translations
    document.querySelector(".app-title").textContent = "किसान मित्र";
    document.querySelector(".app-subtitle").textContent =
      "आपका व्यक्तिगत कृषि सहायक";
    document.querySelector(".user-input-section h2").textContent =
      "अपने खेत का विवरण दर्ज करें";
    // ... and so on for all text elements
  } else {
    // English (default)
    document.querySelector(".app-title").textContent = "Kisan Mitra";
    document.querySelector(".app-subtitle").textContent =
      "Your Personalized Farming Assistant";
    document.querySelector(".user-input-section h2").textContent =
      "Enter Your Farm Details";
    // ... reset all text elements to English
  }
}

// Load weather forecast from API
function loadWeatherForecast() {
  // In a real application, this would fetch data from a weather API
  console.log("Loading weather forecast...");
}

// Load market prices from API
function loadMarketPrices() {
  // In a real application, this would fetch data from a market price API
  console.log("Loading market prices...");
}

// Load crop advisory from API
function loadCropAdvisory() {
  // In a real application, this would fetch data from an advisory API
  console.log("Loading crop advisory...");
}

// Event handling using modern practices
document.addEventListener('DOMContentLoaded', () => {
    initializeApplication();
    setupEventListeners();
    loadInitialData();
});

const initializeApplication = () => {
    // Initialize components
    initializeDashboard();
    initializeTheme();
    setupServiceWorker();
};

const setupEventListeners = () => {
    // Event delegation for better performance
    document.addEventListener('click', handleGlobalClick);
    
    // Form submission handling
    const farmForm = document.querySelector('.farm-details-form');
    if (farmForm) {
        farmForm.addEventListener('submit', handleFormSubmission);
    }
};

// Modern async/await pattern for data fetching
const loadInitialData = async () => {
    try {
        const [weather, prices, advisory] = await Promise.all([
            fetchWeatherData(),
            fetchMarketPrices(),
            fetchCropAdvisory()
        ]);
        
        updateDashboard({ weather, prices, advisory });
    } catch (error) {
        handleError(error);
    }
};

// Error handling utility
const handleError = (error) => {
    console.error('Application error:', error);
    showUserFriendlyError(error);
};
