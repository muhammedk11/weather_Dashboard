const API_KEY = "63720b5ef05ff5cf6e9a390e4b4d1a9b";

// Get weather
async function getWeather(city) {
    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("City not found");
    }

    const data = await response.json();

    return data;
}
//Get Forecast
async function getForecast(city) {

    const url =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Forecast not found");
    }

    const data = await response.json();

    return data;
}
 //new Function
function showForecast(data) {

    const forecast =
        document.getElementById("forecast");

    forecast.innerHTML = "";

    const days = [];

    data.list.forEach(function (item) {

        const date = item.dt_txt.split(" ")[0];

        if (!days.includes(date)&& days.length<5) {
            days.push(date);

            const card =
                document.createElement("div");

            card.classList.add("forecast-card");

            card.innerHTML = `
                <h3>${date}</h3>
                <h2>${Math.round(item.main.temp)}°C</h2>
                <p>${item.weather[0].description}</p>
            `;

            forecast.appendChild(card);
        }

    });
}

// Search weather
async function searchWeather() {

    const city = document.getElementById("cityInput").value.trim();

    if (city === "") {
        return;
    }

    const weatherCard =
        document.getElementById("weatherCard");

    weatherCard.innerHTML = "Loading...";

    try {

        const data = await getWeather(city);
const forecastData = await getForecast(city);

showForecast(forecastData);

        weatherCard.innerHTML = `
            <h2>${data.name}</h2>
            <p>${data.weather[0].description}</p>
            <h1>${Math.round(data.main.temp)}°C</h1>
            <p>Feels Like: ${Math.round(data.main.feels_like)}°C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind: ${data.wind.speed} m/s</p>

            <button id="favoriteBtn">
                ${isFavorite(data.name) ? "⭐ Remove Favorite" : "⭐ Add Favorite"}
            </button>`;

        document.getElementById("favoriteBtn")
            .addEventListener("click", function () {
                toggleFavorite(data.name);
                searchWeather();
            });

    } catch (error) {
        weatherCard.innerHTML = error.message;
    }
}
// Check favorite
function isFavorite(city) {

    const favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    return favorites.includes(city);
}

// Add / Remove favorite
function toggleFavorite(city) {

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(city)) {

        favorites = favorites.filter(function (item) {
            return item !== city;
        });
    } else {
       favorites.push(city);
    }
    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    showFavorites();
}

// Show favorites
function showFavorites() {
    const favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    const list =
        document.getElementById("favoritesList");

    list.innerHTML = "";

    favorites.forEach(function (city) {
        const button = document.createElement("button");
        button.textContent = city;
        button.addEventListener("click", function () {
        document.getElementById("cityInput").value = city;
        searchWeather();
        });
        list.appendChild(button);

    });
}

// Search button
document.getElementById("searchBtn")
    .addEventListener("click", searchWeather);

// Debounce
let timer;

document.getElementById("cityInput")
    .addEventListener("input", function () {
       clearTimeout(timer);
       timer = setTimeout(function () {
        searchWeather();
        }, 500);

    });

// Dark mode
document.getElementById("themeBtn")
    .addEventListener("click", function () {

        document.body.classList.toggle("dark");
    });

// Load saved favorites
showFavorites();