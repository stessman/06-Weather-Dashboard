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
let todaysDate;
let tomorrow;


function citySearchButtonHandler () {
    citySearchCity = citySearchField.value;
    fetch('http://api.openweathermap.org/data/2.5/weather?q=' + citySearchCity + '&appid=3290fa4ab7af532d7cd9308947e66b17&units=imperial')
        .then(function (response) {
        return response.json();
    })
        .then(function (data) {
        currentLocation = data.name;
        currentLocationLat = data.coord.lat;
        currentLocationLon = data.coord.lon;
        locationName.innerHTML = data.name;
        //currentLocationIcon.setAttribute("class", data.weather[0].icon);
        displayCurrentLocation();
        addCityToRecentSearch(currentLocation, currentLocationLat, currentLocationLon);
    });
}

function displayCurrentLocation () {
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + currentLocationLat + '&lon=' + currentLocationLon + '&appid=3290fa4ab7af532d7cd9308947e66b17&units=imperial&exclude=minutely,hourly,alerts')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        todaysDate = data.current.dt;
        todaysDate = DateTime.fromSeconds(todaysDate);
        todaysDate = todaysDate.toLocaleString(DateTime.DATE_SHORT);
        locationName.innerHTML = locationName.innerHTML + ' ' + todaysDate;
        locationsCurrentTemp.innerHTML = "Temp: " + data.current.temp;
        locationsCurrentWind.innerHTML = "Wind: " + data.current.wind_speed + ' MPH';
        locationsCurrentHumidity.innerHTML = "Humidity: " + data.current.humidity + ' %';
        locationsCurrentUVIndex.innerHTML = "UV Index: " + data.current.uvi;
        fillFiveDayForecast(data);
    });
}

// Fills the 5-Day Forecast area with data
function fillFiveDayForecast (data) {
    let j = 0;
    for (let i = 0; i < 5; i++) {
        let forecastDay = data.daily[i].dt;
        forecastDay = DateTime.fromSeconds(forecastDay);
        forecastDay = forecastDay.toLocaleString(DateTime.DATE_SHORT);
        dailyForecastSections[j].children[0].innerHTML = forecastDay;
        //dailyForecastSections[j].children[1].innerHTML    NEED TO DO THIS IS FOR ICONS
        dailyForecastSections[j].children[2].innerHTML = data.daily[i].temp.day + ' ' + '<span>&#176;</span>' + 'F';
        dailyForecastSections[j].children[3].innerHTML = data.daily[i].wind_speed + " MPH";
        dailyForecastSections[j].children[4].innerHTML = data.daily[i].humidity + " %";
        j++;
    }
}

function addCityToRecentSearch (cityName, cityLat, cityLon) {
    console.log(currentLocation);
    //if (localStorage.getItem(""))
    //for keys in 
    if (localStorage.getItem('PreviousCities') === null){
        let citiesArray = [];
        let citiesObject = {};
        let item = {
            "City": cityName,
            "Lon": cityLat,
            "Lat": cityLon
        }
        citiesObject.items = citiesArray;
        citiesObject.items.unshift(item);
        localStorage.setItem('PreviousCities', JSON.stringify(citiesObject));
    }else{
        citiesObject = JSON.parse(localStorage.getItem("PreviousCities"));
        let item = {
            "City": cityName,
            "Lon": cityLat,
            "Lat": cityLon
        }
        //citiesObject.items = citiesArray;
        citiesObject.items.unshift(item);
        localStorage.setItem('PreviousCities', JSON.stringify(citiesObject));
    }
    createButtons();
}


function createButtons () {
    if(localStorage.getItem("PreviousCities")!== null) {
        let recentCitiesList = JSON.parse(localStorage.getItem("PreviousCities"));
        for (let i = 0; i < recentCitiesList.items.length; i++){
            let newButton = document.createElement("BUTTON");
            newButton.innerHTML = recentCitiesList.items[i].City;
            newButton.setAttribute("type", "button");
            newButton.setAttribute("class", "btn btn-primary");
            pastSearchArea.appendChild(newButton);
        }
    }
}



citySearchButton.addEventListener("click", citySearchButtonHandler);

/*
Store recent cities into local storage
When a city is searched, check to see if it is already added to the list, else add it to the top of the list
If the list is length of 8, then drop the item at 8th spot
For each item in the local storage list create a button in the recent search area

click handle

when a recent search is clicked then pull data from local storage and search for that city

Nice to have: If city doesn't exist
*/