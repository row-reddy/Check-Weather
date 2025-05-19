const apiKey = "007b1f053a302965276d25296aaab376";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherIcon = document.getElementById("weather-icon");
const cityNameEl = document.getElementById("city-name");
const temperatureEl = document.getElementById("temperature");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("wind-speed");

// Create message element for user feedback
const messageEl = document.createElement("p");
messageEl.style.color = "#ffcccb";
messageEl.style.marginTop = "20px";
messageEl.style.fontWeight = "600";
document.querySelector(".card").appendChild(messageEl);

function showMessage(msg, isError = false) {
  messageEl.innerText = msg;
  messageEl.style.color = isError ? "#ff4d4d" : "#4caf50";
}

function clearMessage() {
  messageEl.innerText = "";
}

function setLoading(isLoading) {
  if (isLoading) {
    searchBtn.disabled = true;
    searchBtn.innerHTML = `<img src="loading-spinner.svg" alt="Loading" style="width:24px; height:24px;">`;
    showMessage("Loading...");
  } else {
    searchBtn.disabled = false;
    searchBtn.innerHTML = `<img src="search.png" alt="Search icon" />`;
    clearMessage();
  }
}

function getWeatherIcon(condition) {
  condition = condition.toLowerCase();

  if (condition.includes("cloud")) return "cloud.png";
  if (condition.includes("rain") || condition.includes("drizzle")) return "rain.png";
  if (condition.includes("clear")) return "sun.png";
  if (condition.includes("snow")) return "snow.png";
  if (condition.includes("thunderstorm")) return "thunder.png";
  if (condition.includes("mist") || condition.includes("fog")) return "fog.png";
  return "default.png";
}

function updateWeatherUI(data) {
  cityNameEl.innerText = data.name;
  temperatureEl.innerText = `${Math.round(data.main.temp)}°C`;
  humidityEl.innerText = `${data.main.humidity}%`;
  windSpeedEl.innerText = `${data.wind.speed} km/h`;
  weatherIcon.src = getWeatherIcon(data.weather[0].main);
  weatherIcon.alt = data.weather[0].description;
}

async function fetchWeather(city) {
  setLoading(true);

  try {
    const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
    const data = await response.json();

    if (data.cod === "404") {
      showMessage("City not found! Please enter a valid city name.", true);
      setLoading(false);
      return;
    }

    updateWeatherUI(data);
    showMessage("Weather data loaded successfully.");
  } catch (error) {
    console.error("Error fetching weather data:", error);
    showMessage("Failed to fetch weather data. Please try again later.", true);
  } finally {
    setLoading(false);
  }
}

function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) {
    showMessage("Please enter a city name.", true);
    return;
  }
  clearMessage();
  fetchWeather(city);
}

searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});


