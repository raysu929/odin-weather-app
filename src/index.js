import "./styles/general.css";
import "./styles/main.css";

if (process.env.NODE_ENV !== "production") {
  console.log("Looks like we are in development mode!");
}

async function getWeather(location) {
  const url =
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?key=TQGRUT88P686GUMQ8C5DYJX2H`;
  const response = await fetch(url);
  const data = await response.json();
return data;
}

 function weatherData(data){
  const weather = {
    location: data.resolvedAddress,
    currentTemp: data.currentConditions.temp,
    conditions: data.currentConditions.conditions,
    humidity: data.currentConditions.humidity,
    date: data.currentConditions.datetime,
  };
  return weather;
}

async function main() {
  const data = await getWeather('South Africa');
  const weather = weatherData(data);
  console.log(weather);
}

main()

const container = document.getElementById("container");
const form = document.createElement("form");
const locationInput = document.createElement("input");
locationInput.type = "text";
locationInput.placeholder = "Enter your location";
const submitBtn = document.createElement("input");
submitBtn.type = "submit";

submitBtn.addEventListener("click", async (e) => {
e.preventDefault();
  const data = await getWeather(locationInput.value);
  console.log(data);
})
container.appendChild(form);
form.append(locationInput, submitBtn);