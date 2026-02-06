const apiKey = "4223a3b65958fb2aedd108f6834352b4";
const resultBox = document.getElementById("weatherResult");
const darkBtn = document.getElementById("dark");

/* ---------------- WEATHER BY CITY ---------------- */
async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();

  if (!city) {
    resultBox.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  fetchWeatherByCity(city);
}

async function fetchWeatherByCity(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    resultBox.innerHTML = `<p>${error.message}</p>`;
  }
}

/* ---------------- WEATHER BY LOCATION ---------------- */
function getLocationWeather() {
  if (!navigator.geolocation) {
    resultBox.innerHTML = "<p>Geolocation not supported.</p>";
    return;
  }

  resultBox.innerHTML = "<p>📍 Detecting your location...</p>";

  navigator.geolocation.getCurrentPosition(
    async position => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) throw new Error("Unable to fetch location weather");

        const data = await response.json();
        displayWeather(data);
      } catch (error) {
        resultBox.innerHTML = `<p>${error.message}</p>`;
      }
    },
    () => {
      resultBox.innerHTML =
        "<p>❌ Location access denied. Please search city manually.</p>";
    }
  );
}

/* ---------------- DISPLAY WEATHER ---------------- */
function displayWeather(data) {
  resultBox.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>🌡 Temperature: ${data.main.temp}°C</p>
    <p>🌥 Weather: ${data.weather[0].description}</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>🌬 Wind: ${data.wind.speed} m/s</p>
  `;
}

/* ---------------- DARK MODE ---------------- */
darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

/* ---------------- AUTO LOAD LOCATION WEATHER ---------------- */
window.addEventListener("load", getLocationWeather);
