import "./styles/general.css";
import "./styles/main.css";

if (process.env.NODE_ENV !== "production") {
  console.log("Looks like we are in development mode!");
}

async function getWeather(location) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?key=TQGRUT88P686GUMQ8C5DYJX2H`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function weatherData(data) {
  const weather = {
    location: data.resolvedAddress,
    currentTemp: data.currentConditions.temp,
    conditions: data.currentConditions.conditions,
    humidity: data.currentConditions.humidity,
    dateEpoch: data.currentConditions.datetimeEpoch,
  };
  return weather;
}


async function getWeatherGif(weather) {
  const url = `https://api.giphy.com/v1/gifs/translate?api_key=WC3z5gmx15SbYwGIn5m2hg8kCcyzsycr&s=${weather}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.data.images.original.url;
}

async function showWeatherGif(location) {
  try {
    const weather = await getWeather(location);
    const weatherCondition = weather.currentConditions.conditions;
    const gifUrl = await getWeatherGif(weatherCondition);

    const oldGif = document.querySelector("#weather-gif");
    if (oldGif) oldGif.remove();

    const img = document.createElement("img");
    img.id = "weather-gif";
    img.src = gifUrl;
    img.alt = weatherCondition + " GIF";
    document.body.appendChild(img);
  } catch (error) {
    console.error("Error fetching weather or GIF:", error);
  }
}

const container = document.getElementById("container");
const form = document.createElement("form");
const locationInput = document.createElement("input");
locationInput.type = "text";
locationInput.classList.add('location');
locationInput.placeholder = "Enter your location";
const submitBtn = document.createElement("input");
submitBtn.type = "submit";
submitBtn.classList.add("submit")
const result = document.createElement("div");
result.classList.add("result");
const loadingDiv = document.createElement("div");
loadingDiv.innerText = "Loading...";
loadingDiv.style.display = "none";
loadingDiv.classList.add("loading")

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  loadingDiv.style.display = "block";
  result.textContent = '';
  try {
  const data = await getWeather(locationInput.value);
  const processed = weatherData(data);
const formattedDate = new Date(processed.dateEpoch * 1000).toLocaleString(
  "en-US",
  {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
);

  loadingDiv.style.display = "none";

  result.innerHTML = `
   <h2>${processed.location}</h2>
    <p><strong>Temperature:</strong> ${processed.currentTemp}°C</p>
    <p><strong>Conditions:</strong> ${processed.conditions}</p>
    <p><strong>Humidity:</strong> ${processed.humidity}%</p>
    <p><strong>Date:</strong> ${formattedDate}</p>
  `;

 const gifUrl = await getWeatherGif(processed.conditions);
 const img = document.createElement("img");
 img.classList.add('image')
 img.src = gifUrl;
 img.alt = processed.conditions + " GIF";
 result.appendChild(img);
  } catch (error){
    loadingDiv.style.display = "none";
    result.textContent = "Error fetching weather data.";
    console.error(error);
  }
});
container.appendChild(form);
form.append(locationInput, submitBtn);
container.appendChild(result);
container.appendChild(loadingDiv);