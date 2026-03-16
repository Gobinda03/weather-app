document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("city-input");
  const getWeatherBtn = document.getElementById("get-weather-btn");
  const weatherInfo = document.getElementById("weather-info");
  const cityNameDisplay = document.getElementById("city-name");
  const temperatureDisplay = document.getElementById("temperature");
  const descriptionDisplay = document.getElementById("description");
  const humidityDisplay = document.getElementById("humidity");
  const windspeedDisplay = document.getElementById("wind-speed");
  const errorMessage = document.getElementById("error-message");
  const weatherIcon = document.getElementById('weather-icon');
  const container = document.querySelector(".container");

  const API_KEY = "5f56d525d1619d0a2cd2eac4ce55588e"; //env variables

  // Get Weather Button
  getWeatherBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();
    if (!city) return;

    // it may throw an error
    // server/database is always in another continent

    try {
      const weatherData = await fetchWeatherData(city);
      displayWeatherData(weatherData);
    } catch (error) {
      showError();
    }
  });
  // Get weather pressing the enter key
  cityInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
      getWeatherBtn.click()
    }
  })


  // Fetch the weather data from API
  async function fetchWeatherData(city) {
    //gets the data
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    const response = await fetch(url);
    console.log(typeof response);
    console.log("RESPONSE", response);

    if (!response.ok) {
      throw new Error(" City Not found");
    }
    const data = await response.json();
    return data;
  }


  // Display the weather information
  function displayWeatherData(data) {
    console.log(data);
    const { name, main, weather } = data;
    const icon = weather[0].icon;
    cityNameDisplay.textContent = name;
    temperatureDisplay.textContent = `Temperature : ${main.temp} ℃`;
    descriptionDisplay.textContent = `Weather : ${weather[0].description}`;
    humidityDisplay.textContent = `Humidity : ${main.humidity}%`;
    windspeedDisplay.textContent = `Wind Speed : ${data.wind.speed} m/s`;

    //unlock the display
    weatherInfo.classList.remove("hidden");
    errorMessage.classList.add("hidden");

    // weather icon
    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    weatherIcon.classList.remove("hidden");


    // Dynamic Background
    const weatherMain = weather[0].main;
    if(weatherMain === 'Clear'){
      container.style.background = "linear-gradient(to right,#56ccf2,#2f80ed)"
    }else if(weatherMain === "Clouds"){
      container.style.background = "linear-gradient(to right,#757f9a,#d7dde8)";
    }else if(weatherMain === "Rain"){
      container.style.background = "linear-gradient(to right,#4b79a1,#283e51)";
    }else{
      container.style.background = "linear-gradient(to right,#3a7bd5,#3a6073)";
    }
  }

  // Show error msg if location not found
  function showError() {
    weatherInfo.classList.add("hidden");
    errorMessage.classList.remove("hidden");
  }

  // Get user's current location
  navigator.geolocation.getCurrentPosition(async (position) => {
    try {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      const response = await fetch(url);

      if(!response.ok) throw new Error("Weather Fetch Failed.")
      const data = await response.json();
      cityInput.value = data.name;

      displayWeatherData(data);
    } catch (error) {
      showError();
    }
  },
  (error) => {
    console.log("Location Permision Denied.");
  }
  );
});
