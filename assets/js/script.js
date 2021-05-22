let citySearchField = document.querySelector("#cityField");
let citySearchButton = document.querySelector("#citySearchButton");
let locationName = document.querySelector("#locationName");
let locationsCurrentTemp = document.querySelector("#locationCurrentTemp");
let locationsCurrentWind = document.querySelector("#locationCurrentWind");
let locationsCurrentHumidity = document.querySelector("#locationCurrentHumidity");
let locationsCurrentUVIndex = document.querySelector("#locationCurrentIndex");
let currentLocationIcon = document.querySelector("#currentLocationIcon");
let dailyForecastSections = document.querySelectorAll(".upcomingDay");
let pastSearchArea = document.querySelector("#pastSearchArea");
let currentLocation;
let currentLocationLon;
let currentLocationLat;
let citySearchCity;
let DateTime = luxon.DateTime;
let indexText;
let iconLink;
let todaysDate;
let tomorrow;

// Gets the city name and the longitude and latitude of the searched city to be used later
function citySearchButtonHandler () {
    citySearchCity = citySearchField.value;
    citySearchField.value = '';
    fetch('http://api.openweathermap.org/data/2.5/weather?q=' + citySearchCity + '&appid=3290fa4ab7af532d7cd9308947e66b17&units=imperial')
        .then(function (response) {
        return response.json();
    })
        .then(function (data) {
        currentLocation = data.name;
        currentLocationLat = data.coord.lat;
        currentLocationLon = data.coord.lon;
        iconLink = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
        displayCurrentLocation();
        addCityToRecentSearch(currentLocation, currentLocationLat, currentLocationLon);
    });
}

// Displays the weather information for the current searched location
function displayCurrentLocation () {
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + currentLocationLat + '&lon=' + currentLocationLon + '&appid=3290fa4ab7af532d7cd9308947e66b17&units=imperial&exclude=minutely,hourly,alerts')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        todaysDate = data.current.dt;
        todaysDate = DateTime.fromSeconds(todaysDate);
        todaysDate = todaysDate.toLocaleString(DateTime.DATE_SHORT);
        locationName.innerHTML = currentLocation + ' ' + todaysDate;
        let newIcon = document.createElement("img");
        newIcon.setAttribute("src", iconLink)
        locationName.appendChild(newIcon);
        locationsCurrentTemp.innerHTML = "Temp: " + data.current.temp;
        locationsCurrentWind.innerHTML = "Wind: " + data.current.wind_speed + ' MPH';
        locationsCurrentHumidity.innerHTML = "Humidity: " + data.current.humidity + ' %';
        if(locationsCurrentUVIndex.hasChildNodes()){
            locationsCurrentUVIndex.removeChild(locationsCurrentUVIndex.firstChild);
        }
        locationsCurrentUVIndex.innerHTML = "UV Index: ";
        indexText = document.createElement("SPAN");
        indexText.setAttribute("id", "indexText");
        let currentIndex = Number(data.current.uvi);
        indexText.innerHTML = currentIndex;
        checkIndex(currentIndex);
        locationsCurrentUVIndex.appendChild(indexText);
        fillFiveDayForecast(data);
    });
}

// Fills the 5-Day Forecast area with data
function fillFiveDayForecast (data) {
    let j = 0;
    for (let i = 1; i < 6; i++) {
        let forecastDay = data.daily[i].dt;
        forecastDay = DateTime.fromSeconds(forecastDay);
        forecastDay = forecastDay.toLocaleString(DateTime.DATE_SHORT);
        dailyForecastSections[j].children[0].innerHTML = forecastDay;
        iconLink = "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png";
        dailyForecastSections[j].children[1].src = iconLink;
        dailyForecastSections[j].children[2].innerHTML = "Temp: " + data.daily[i].temp.day + ' ' + '<span>&#176;</span>' + 'F';
        dailyForecastSections[j].children[3].innerHTML = "Wind: " + data.daily[i].wind_speed + " MPH";
        dailyForecastSections[j].children[4].innerHTML = "Humidity: " +data.daily[i].humidity + " %";
        j++;
    }
}

// When a city is searched it is then added to the recent search data
function addCityToRecentSearch (cityName, cityLat, cityLon) {
    if (localStorage.getItem('PreviousCities') === null){
        let citiesArray = [];
        let citiesObject = {};
        let item = {
            "City": cityName,
            "Lon": cityLon,
            "Lat": cityLat
        }
        citiesObject.items = citiesArray;
        citiesObject.items.unshift(item);
        localStorage.setItem('PreviousCities', JSON.stringify(citiesObject));
    }else{
        citiesObject = JSON.parse(localStorage.getItem("PreviousCities"));
        for (let i = 0; i < citiesObject.items.length; i++){
            if (citiesObject.items[i].City === cityName) {
                citiesObject.items.splice(i,1);
            }
        }
        if(citiesObject.items.length > 7) {
            citiesObject.items.pop();
        }
        let item = {
            "City": cityName,
            "Lon": cityLon,
            "Lat": cityLat
        }
        citiesObject.items.unshift(item);
        localStorage.setItem('PreviousCities', JSON.stringify(citiesObject));
    }
    createButtons();
}

// Creates the buttons on the page for the Recent Searches Area
function createButtons () {
    while (pastSearchArea.firstChild){
        pastSearchArea.removeChild(pastSearchArea.firstChild);
    }
    if(localStorage.getItem("PreviousCities")!== null) {
        let recentCitiesList = JSON.parse(localStorage.getItem("PreviousCities"));
        for (let i = 0; i < recentCitiesList.items.length; i++){
            let newButton = document.createElement("BUTTON");
            newButton.innerHTML = recentCitiesList.items[i].City;
            newButton.setAttribute("type", "button");
            newButton.setAttribute("class", "btn btn-primary recentBtn");
            pastSearchArea.appendChild(newButton);
        }
    }
}


// Handles when a button is clicked in the Previous Search Area
function handlePastSearchAreaClick (event) {
    event.preventDefault();
    let newLocation = event.target;
    if (newLocation.nodeName !== "BUTTON"){
        return;
    }
    newLocation = newLocation.innerHTML;
    let recentCitiesList = JSON.parse(localStorage.getItem("PreviousCities"));
    for (let i = 0; i < recentCitiesList.items.length; i++){
        if (recentCitiesList.items[i].City === newLocation) {
            currentLocation = recentCitiesList.items[i].City;
            currentLocationLat = recentCitiesList.items[i].Lat;
            currentLocationLon = recentCitiesList.items[i].Lon;
            displayCurrentLocation();
        }
}
}

//Checks the UV Index and sets the color background of it
function checkIndex (uvIndex) {
    if(uvIndex < 3) {
        indexText.style.backgroundColor = "green";
    } else if (3 <= uvIndex && uvIndex < 6) {
        indexText.style.backgroundColor = "yellow";
    } else if (6 <= uvIndex && uvIndex < 8) {
        indexText.style.backgroundColor = "orange";
    } else if (8 <= uvIndex && uvIndex < 11) {
        indexText.style.backgroundColor = "red";
    } else if (11 <= uvIndex) {
        indexText.style.backgroundColor = "violet";
    } 
    indexText.style.color = "white";
}

createButtons();
pastSearchArea.addEventListener("click", handlePastSearchAreaClick);
citySearchButton.addEventListener("click", citySearchButtonHandler);