
// search related dom constants
const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("#input");
const searchBox = searchWrapper.querySelector(".search-box");
const weatherBox = document.querySelector(".weather-wrapper");

// current conditions and icon dictionary
const condition = {
    0 : {cond: "Clear sky", icon:"fa-solid fa-circle"},
    1 : {cond: "Mainly clear", icon:"fa-solid fa-sun"},
    2 : {cond: "Partly cloudy", icon:"fa-solid fa-cloud-sun"},
    3 : {cond: "Overcast", icon: "fa-solid fa-cloud"},
    45: {cond: "Fog", icon:"fa-solid fa-smog"},
    48: {cond: "Depositing rime fog", icon:"fa-solid fa-smog" },
    51: {cond: "Light drizzle", icon:"fa-solid fa-droplet"},
    53: {cond: "Drizzle", icon:"fa-solid fa-droplet"},
    55: {cond: "Dense drizzle", icon:"fa-solid fa-droplet"},
    53: {cond: "Drizzle", icon:"fa-solid fa-droplet"},
    56: {cond: "Light freezing drizzle", icon:"fa-solid fa-droplet"},
    57: {cond: "Dense freezing drizzle", icon:"fa-solid fa-droplet"},
    61: {cond: "Light rain", icon:"fa-solid fa-cloud-rain"},
    63: {cond: "Rain", icon:"fa-solid fa-cloud-rain"},
    65: {cond: "Heavy rain", icon:"fa-solid fa-cloud-rain"},
    66: {cond: "Freezing rain", icon:"fa-solid fa-icicles"},
    67: {cond: "Heavy freezing rain", icon:"fa-solid fa-icicles"},
    71: {cond: "Light snow", icon:"fa-solid fa-snowflake"},
    73: {cond: "Snow", icon:"fa-solid fa-snowflake"},
    75: {cond: "Heavy snow", icon:"fa-solid fa-snowflake"},
    77: {cond: "Snow grains", icon:"fa-solid fa-snowflake"},
    80: {cond: "Light rain showers", icon:"fa-solid fa-cloud-showers-heavy"},
    81: {cond: "Rain showers", icon:"fa-solid fa-cloud-showers-heavy"},
    82: {cond: "Heavy rain showers", icon:"fa-solid fa-cloud-showers-heavy"},
    85: {cond: "Snow showers", icon:"fa-solid fa-snowflake"},
    86: {cond: "Heavy snow showers", icon:"fa-solid fa-snowflake"},
    95: {cond: "Thunderstorm", icon:"fa-solid fa-cloud-bolt"},
    96: {cond: "Thunderstorm with light hail", icon:"fa-solid fa-cloud-bolt"},
    96: {cond: "Thunderstorm with heavy hail", icon:"fa-solid fa-cloud-bolt"},
};

// search for location
async function searchLocations(input) {
    const locationUrl = ("https://geocoding-api.open-meteo.com/v1/search?");
    if (input.length>1){
        let res = await fetch(`${locationUrl}name=${input}`);
        let data = await res.json();
        outputHTML (data.results);
    }else {
        searchWrapper.classList.remove("active");
        searchBox.innerHTML=("");
    };
};

// show search sugguestions and send selection to get weather function
outputHTML = data => {
    searchWrapper.classList.add("active");
    tab = [];
    const html = data.map(match =>`<li>${match.name} (${match.admin1} | ${match.country_code})</li>`
    ).join("");
    searchBox.innerHTML = html;
    var items = searchBox.querySelectorAll("li");
    // on click send to get weather
    for (var i=0; i< items.length; i++){
        tab.push(items[i].innerHTML)
    };
    // get index of selected element
    for (var i=0; i<items.length; i++){
        items[i].onclick = function(){
            index=tab.indexOf(this.innerHTML);
            // get weather
            getWeather((data[index].name), (data[index].latitude), (data[index].longitude));
        };
    };
};

//get weather and display
async function getWeather (name,lat,lon){
    const weatherUrl=("https://api.open-meteo.com/v1/forecast?")
    let tempUnit = ('temperature_unit=fahrenheit');
    let windUnit = ('windspeed_unit=mph');
    let curWeather = ('current_weather=true');
    inputBox.value = ("");
    searchBox.innerHTML= ("");
    searchWrapper.classList.remove("active");

    let res = await fetch(`${weatherUrl}&${curWeather}&${tempUnit}&${windUnit}&latitude=${lat}&longitude=${lon}`);
    let data = await res.json();
    let iconIndex = (data.current_weather.weathercode);

    // display weather info
    weatherBox.innerHTML = (`<h2>Weather in ${name}</h2><br>
    <h3>Temperature: ${data.current_weather.temperature} &deg;F</h3><br>
    <h3><i class="${condition[iconIndex].icon}"></i> ${condition[iconIndex].cond}</h3><br>
    <h3>Wind Speed: ${data.current_weather.windspeed} mph`);
};

inputBox.addEventListener("input", () => searchLocations(inputBox.value));
