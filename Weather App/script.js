
// search related dom constants
const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("#input");
const searchBox = searchWrapper.querySelector(".search-box");
const weatherBox = document.querySelector(".weather-wrapper")

// search for location
async function searchLocations(input) {
    const locationUrl = "https://geocoding-api.open-meteo.com/v1/search?"
    if (input.length>1){
        let res = await fetch(`${locationUrl}name=${input}`)
        let data = await res.json();
        outputHTML (data.results)
    }else {
        searchWrapper.classList.remove("active")
        searchBox.innerHTML=("")
    }
}

// show search sugguestions and send selection to get weather function
outputHTML = data => {
    searchWrapper.classList.add("active");
    tab = [];
    const html = data.map(match =>`<li>${match.name} (LAT: ${match.latitude} | LON: ${match.longitude})</li>`
    ).join("");
    searchBox.innerHTML = html;
    var items = searchBox.querySelectorAll("li");
    // on click send to get weather
    for (var i=0; i< items.length; i++){
        tab.push(items[i].innerHTML)
    }
    // get index of selected element
    for (var i=0; i<items.length; i++){
        items[i].onclick = function(){
            index=tab.indexOf(this.innerHTML);
            // get weather
            getWeather((data[index].name), (data[index].latitude), (data[index].longitude))
        }
    }
}

//get weather and display
async function getWeather (name,lat,lon){
    const weatherUrl="https://api.open-meteo.com/v1/forecast?"
    let tempUnit = 'temperature_unit=fahrenheit'
    let windUnit = 'windspeed_unit=mph'
    let curWeather = 'current_weather=true'
    inputBox.value = ("")
    searchBox.innerHTML= ("")
    searchWrapper.classList.remove("active")

    let res = await fetch(`${weatherUrl}&${curWeather}&${tempUnit}&${windUnit}&latitude=${lat}&longitude=${lon}`)
    let data = await res.json();
    
    weatherBox.innerHTML = `<h2>Weather in ${name}</h2><br>
    <h3>Temperature: ${data.current_weather.temperature} &deg;F</h3><br>
    <h3>Wind Speed: ${data.current_weather.windspeed} mph`

    console.log(`Temp: ${data.current_weather.temperature}`)
    console.log(`Wind Speed: ${data.current_weather.windspeed}`)
}

inputBox.addEventListener("input", () => searchLocations(inputBox.value));
