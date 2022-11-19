/**
 * Nathan Arrowsmith
 * SDEV 372 Fall 2022
 * Fall Project
 */

//TODO: HIDE THIS KEY
let apiKey = "e3a64f2a4f555438567f7813bd27447b";

let activeTrail;
let activeReviews = [];
let formType;
let userLat;
let userLong;
let map = L.map('map').setView([47.579680, -121.984790], 13); //default weather to Issaquah Washington
let userClick; //for event handing within leaflet Map

//Select a Trail by Name drop-down button
let trailByNameShow = document.querySelector("#dropBtnName");
trailByNameShow.addEventListener("click", getTrailNameShow);
//Select a Trail by TrailSystem drop-down button
let trailBySystemShow = document.querySelector("#dropBtnSystem");
trailBySystemShow.addEventListener("click", getTrailSystemShow);
//Select a Trail by Difficulty drop-down button
let trailByDifficultyShow = document.querySelector("#dropBtnDifficulty");
trailByDifficultyShow.addEventListener("click", getTrailDifficultyShow);
//close modal when user clicks 'x'
let span = document.getElementsByClassName("close")[0];
span.addEventListener("click", closeModal);
//'Add Trails' button
let addTrailButton = document.querySelector("#addTrailButton");
addTrailButton.addEventListener("click", addTrailFormType);
//'Home' button
let homeButton = document.querySelector("#homeButton");
homeButton.addEventListener("click", homePageButton);

/**
 * On page load: retrieve all stored trails at 'api/v1/trail' endpoint,
 * Generate home page HTML and Leaflet Map,
 * Generate Weather dashboard (under map) and
 * fetch predefined weather from userLat and userLon variables above
 */
window.onload = function () {
    //create trail objects to make with a GET request
    let trailUri = "http://localhost:8080/api/v1/trail";
    let params = {
        method: "get"
    };

    homePageCard(); //populate home page with intro text
    /*fetchWeather(); //populate weather box with duthie hill for initial load*/

    fetch(trailUri, params) //get response
        .then(function (response) {
            return response.json(); //ask for response to be converted to json
        })
        .then(function (data) { //receive the text when promise is complete
            console.log(data[0].trailSystem.name);
            trailNameDropDown(data);
        });

    //for complete Leaflet Tile generation
    setTimeout(function() {
        window.dispatchEvent(new Event('resize'));
    }, 1000);
};

/**
 * These (3) functions will set display properties to 'show' when respective button is pressed in
 * the side navigation component. These are the 'By Name:', 'By TrailSystem:', and 'By Difficulty;'
 */
function getTrailNameShow() {
    document.getElementById("trailByName").classList.toggle("show");
}
function getTrailSystemShow() {
    document.getElementById("trailBySystem").classList.toggle("show");
}
function getTrailDifficultyShow() {
    document.getElementById("trailByDifficulty").classList.toggle("show");
}


/**
 * This on click function closes the side-nav dropdown menu when clicked outside its container
 * Several mouse click event listeners located here such as:
 * side nav dropdown item clicks
 * removing form modal when clicking outside of form
 * delete review buttons
 * @param event a mouse 'click' event
 */
window.onclick = function (event) {
    if (!event.target.matches('.dropBtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropDown = dropdowns[i];
            if (openDropDown.classList.contains('show')) {
                openDropDown.classList.remove('show');
            }
        }
    }
    //grab trail name clicked in drop down
    if (event.target.matches('.trailNames') || event.target.matches('.trailSystemsList')) {
        getTrailByName(event.target.innerText, "names");
    }
    //grab trail system clicked in drop down
    if (event.target.matches('.trailSystems')) {
        getTrailByName(event.target.innerText, "systems");
    }
    //grab trail rating clicked in drop down
    if (event.target.matches('.trailDifficulties')) {
        getTrailByName(event.target.innerText, "ratings");
    }
    //if user clicks outside the modal
    if (event.target.matches('#allFormsModal')) {
        let modal = document.getElementById("allFormsModal");
        modal.style.display = "none";
    }
    //find which review user wants to delete
    if (event.target.matches('.deleteReviewButton')) {
        removeReview(event.target.id);
    }
}

/**
 * This function set's homePage div, mapContainer div, weatherInfoContainer div,
 * weatherContainer div, and sideNavExtend div from display: none to display: block
 */
function showHomePageElements(){
    let homePage = document.getElementById("homePage");
    let mapDiv = document.getElementById("mapContainer");
    let weatherInfo = document.getElementById("weatherInfoContainer");
    let weather = document.getElementById("weatherContainer");
    let side = document.getElementById("sideNavExtend");
    let blockElements = [homePage, mapDiv, weatherInfo, weather, side];
    for (let i = 0; i < blockElements.length; i++)
    {
        blockElements[i].style.display = "block";
    }
}

/**
 * This function set's homePage div, mapContainer div, weatherInfoContainer div,
 * weatherContainer div, and sideNavExtend div from display: block to display: none
 * This method also clears the inner HTML of the homeContainer card as the 'homePageCard' function
 * populates it with 'page updated!' when a trail has been edited..
 */
function hideHomePageElements(){
    let homePage = document.getElementById("homePage");
    homePage.innerHTML = "";
    let mapDiv = document.getElementById("mapContainer");
    let weatherInfo = document.getElementById("weatherInfoContainer");
    let weather = document.getElementById("weatherContainer");
    let side = document.getElementById("sideNavExtend");
    let blockElements = [homePage, mapDiv, weatherInfo, weather, side];
    for (let i = 0; i < blockElements.length; i++)
    {
        blockElements[i].style.display = "none";
    }
}

/**
 * This function produces the home page/site description text when the page is refreshed or first visited
 * @param data If user updated page (editTrailForm) change homePageCard -> homePageSection text to
 * show page was updated
 */
function homePageCard(data){

    //clear existing HTML content
    let trailCard = document.getElementById("trailCard");
    trailCard.innerHTML = ""; //clear existing card
    trailCard.classList.remove("SystemListCard");
    let trailStats = document.getElementById("trailStats");
    trailStats.innerHTML = ""; //clear existing card
    let trailDiv = document.getElementById("trails");
    trailDiv.style.display = "none";

    //grab homePage div and map div
    showHomePageElements();

    //create Stats Card
    let trailCardDiv = document.createElement("div");
    trailCardDiv.classList.add("homePageCard");
    let headerDiv = document.createElement("div");
    headerDiv.classList.add("homePageCardHeader");
    let h3 = document.createElement("h3");
    h3.innerHTML = "Welcome to trailHub!";
    let bodySection = document.createElement("section");
    bodySection.setAttribute('id', "homePageSection");
    bodySection.classList.add("homePageCardSection");
    let bodyText = document.createElement("p");
    if(data === undefined){
        bodyText.innerText = "Hello and welcome to trailHub. This is a community driven mountain-biking resource" +
            " created to give riders an opportunity to leave feedback on trails/trailsystems they ride. Begin by " +
            "selecting " + "a trail using the side navigation on the left, you can choose by trail name | trail system "
            + "| or trail difficulty." + " Don't see the trail you're looking for? You can add a trail to the database"
            + " by using the 'add trail' button " + " to the left!";
    }
    else{
        let h2 = document.createElement("h2");
        h2.innerText = "Page Updated!";
        h2.classList.add("updateMessage");
        bodySection.appendChild(h2);
    }

    //For Leaflet Map
    headerDiv.appendChild(h3);
    trailCardDiv.appendChild(headerDiv);
    bodySection.appendChild(bodyText);
    trailCardDiv.appendChild(bodySection);

    homePage.appendChild(trailCardDiv);

}

//*************************
/**
 * FOR LEAFLET (MAP)
 */
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
    ).addTo(map);

//test
map.data

//add a marker to the map
let marker = L.marker([47.58216, -121.97715]).addTo(map);
//add pop-up to marker
marker.bindPopup("<b class='trailSystems'>Duthie Hill</b>").openPopup();

/**
 * This function populates leaflet map with all trail systems in database. The data passed to this method is from the
 * trailNameDropDown function that already filters duplicate trail systems.After trail objects have been filtered,
 * trail objects are added to a list and then fed to this function.
 * @param data Single Trail Object (to use Lat and Lon values from trailSystem variable)
 */
function addTrailSystemToMap(data) {

    let trail = data;

    //have default homepage weather set to currently visible trailSystem
    userLat = trail.trailSystem.lat;
    userLong = trail.trailSystem.lon;

    //create map marker for trailSystem, add to Leaflet Map
    let testMarker = L.marker([trail.trailSystem.lat, trail.trailSystem.lon]).addTo(map);
    //add pop-up to marker
    let div = document.createElement("div");
    let b = document.createElement("b");
    let p = document.createElement("p");
    b.classList.add("trailSystems");
    b.innerText = trail.trailSystem.name;
    p.innerText = "Trail System";
    div.appendChild(b);
    div.appendChild(p);
    testMarker.bindPopup(div).openPopup();

}

//TODO create polygon boundaries for all trail systems added
//make a map shape (just an example)
let polygon = L.polygon([
    [47.583929, -121.977879],
    [47.58021, -121.977861],
    [47.580275, -121.981897],
    [47.573065, -121.982032],
    [47.573056, -121.976776],
    [47.576569, -121.97657],
    [47.576439, -121.971394],
    [47.580083, -121.971196],
    [47.580184, -121.97635],
    [47.584131, -121.976287]
]).addTo(map);

//add all trails at this trail system to this popup?
polygon.bindPopup("<b class='trailSystems'>Duthie Hill</b><br>Trail System");


function onMapClick(e){
    userClick = e.latlng; //store user latitude/longitude

}
map.on('click', onMapClick);
map.on('click', getUserClick);

/**
 * Grab Lat/Lon data from area of map user clicked and
 * run fetchWeather function
 */
function getUserClick(){

    //set latitude/longitude variables
    userLat = userClick.lat;
    userLong = userClick.lng;
    fetchWeather("home");
}


/**
 * Call openWeatherMap API using user clicked Map Longitude and Latitude (userLat and userLon local variables)
 */
function fetchWeather(outputPlace){
    let type = outputPlace;

    let weatherUri = "https://api.openweathermap.org/data/2.5/forecast?"
        + "lat=" + userLat
        + "&lon=" + userLong
        + "&appid=" + apiKey
        + "&exclude=minutely"
        + "&exclude=hourly"
        + "&exclude=daily"
        + "&exclude=alerts"
        + "&units=imperial";

    let params = {
        method: "get",
        /*mode: "cors",
        lat: userLat,
        lon: userLong,
        /!*appid: apiKey,
        exclude: ["minutely", "hourly", "daily", "alerts"],
        units: "imperial"*!/
        headers: {
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key" : apiKey
        }*/
    };


    fetch(weatherUri, params) //get response
        .then(function (response) {
            return response.json(); //ask for response to be converted to json
        })
        .then(function (data) { //receive the text when promise is complete
            if(type === "home"){
                populateWeatherDiv(data);
            }
            if(type === "systemsList"){
                populateSystemWeather(data);
            }
        });
}

/**
 * This method converts the openWeatherApi UTC time to Pacific Standard Time
 * @param utcTime the int variable provided by the openWeatherApi response
 * @returns {string} a pacific standard time string with the hour/minute and am/pm
 */
function timeConvert(utcTime){
    let fixedTime = utcTime * 1000;
    let time = new Date(fixedTime);

    return time.toLocaleTimeString("en-us", {
        timeZone: "America/Los_Angeles",
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * This function creates the HTML for the homepage Weather Dashboard
 * @param data is the response from the openWeatherMap API fetch from fetchWeather
 */
function populateWeatherDiv(data) {

    let weatherData = data;
    let currentWeather = weatherData.list[0];

    //weather div variables
    let city = weatherData.city.name;
    let country = weatherData.city.country;
    let sunrise = timeConvert(weatherData.city.sunrise);
    let sunset = timeConvert(weatherData.city.sunset);
    let currentTemp = currentWeather.main.temp;
    let minTemp = currentWeather.main.temp_min;
    let maxTemp = currentWeather.main.temp_max;
    let archiveIcon = chooseWeatherIcon(currentWeather.weather[0].main);

    //create HTML elements
    let weatherContainer = document.getElementById("weatherContainer");
    weatherContainer.style.display = "block";

    let weatherDiv = document.getElementById("weatherBox"); //contains all divs
    weatherDiv.innerHTML = "";

    let a1 = document.createElement("div");
    let a2 = document.createElement("div");
    let a3 = document.createElement("div");
    let a4 = document.createElement("div");

    let iconDiv = document.createElement("div"); //weather icon
    a1.classList.add("iconDiv");
    iconDiv.classList.add("nestedWeather");
    let locationDiv = document.createElement("div"); //city, country
    a2.classList.add("locationDiv");
    locationDiv.classList.add("nestedWeather");
    let sunDiv = document.createElement("div"); //sunrise, sunset
    a4.classList.add("lightDiv");
    sunDiv.classList.add("nestedWeather");
    let tempDiv = document.createElement("div"); //current temp, min/max
    a3.classList.add("tempDiv");
    tempDiv.classList.add("nestedWeather");

    //labels and info
    let locationTitle = document.createElement("p");
    locationTitle.innerText = "Location:";
    let cityP = document.createElement("p");
    cityP.innerText = "City: " + city;
    let countryP = document.createElement("p");
    countryP.innerText = "Country: " + country;
    locationDiv.appendChild(locationTitle);
    locationDiv.appendChild(cityP);
    locationDiv.appendChild(countryP);
    a2.appendChild(locationDiv);
    let tempsTitle = document.createElement("p");
    tempsTitle.innerText = "Temps:";
    let currentP = document.createElement("p");
    currentP.innerText = "Current: " + String(currentTemp).slice(0,2) + String.fromCharCode(176) +" F";
    let lowP = document.createElement("p");
    lowP.innerText = "Low: " + String(minTemp).slice(0,2) + String.fromCharCode(176) +" F";
    let highP = document.createElement("p");
    highP.innerText = "High: " + String(maxTemp).slice(0,2) + String.fromCharCode(176) +" F";
    tempDiv.appendChild(tempsTitle);
    tempDiv.appendChild(currentP);
    tempDiv.appendChild(lowP);
    tempDiv.appendChild(highP);
    a3.appendChild(tempDiv);
    let sunTitle = document.createElement("p");
    sunTitle.innerText = "Light Conditions:";
    let sunriseP = document.createElement("p");
    sunriseP.innerText = "Sunrise: " + sunrise;
    let sunsetP = document.createElement("p");
    sunsetP.innerText = "Sunset: " + sunset;
    sunDiv.appendChild(sunTitle);
    sunDiv.appendChild(sunriseP);
    sunDiv.appendChild(sunsetP);
    a4.appendChild(sunDiv);

    let icon = document.createElement("img");
    icon.classList.add("weatherIcon");
    icon.src = archiveIcon;
    iconDiv.appendChild(icon);
    a1.appendChild(iconDiv);

    weatherDiv.appendChild(a1);
    weatherDiv.appendChild(a2);
    weatherDiv.appendChild(a3);
    weatherDiv.appendChild(a4);
}

/**
 * This function creates the HTML for the Trail System List page Weather bubble
 * @param data is the response from the openWeatherMap API fetch from fetchWeather
 */
function populateSystemWeather(data){

    let currentWeather = data.list[0];
    console.log(currentWeather);

    //grab HTML trailStats element
    let trailStats = document.getElementById("trailStats");
    let trailCard = document.getElementById("trailCard");
    trailStats.classList.remove("card");
    trailCard.classList.remove("card");

    //weather div variables
    let currentTemp = currentWeather.main.temp;
    let archiveIcon = chooseWeatherIcon(currentWeather.weather[0].main);

    //create HTML elements
    let weatherBox = document.createElement("div");
    weatherBox.classList.add("trailListWeather");
    let h2 = document.createElement("h2");
    h2.classList.add("trailListWeatherH2")
    h2.innerText = 'Current weather at ' + activeTrail.trailSystem.name;
    let iconDiv = document.createElement("div");
    let icon = document.createElement("img");
    icon.classList.add("weatherIconList");
    icon.src = archiveIcon;
    iconDiv.appendChild(icon);
    let temp = document.createElement("h1");
    temp.classList.add("trailListWeatherH1")
    temp.innerText = String(currentTemp).slice(0,2) + String.fromCharCode(176) + "F";

    weatherBox.appendChild(h2);
    weatherBox.appendChild(iconDiv);
    weatherBox.appendChild(temp);
    //add to HTML
    trailStats.appendChild(weatherBox);

}

/**
 * This function parses the openWeather API icon title and matches it to a relevant icon in images folder
 * @param weatherIcon openWeather API icon name
 * @returns {string} image source path of relevant icon
 */
function chooseWeatherIcon(weatherIcon){

    let icon = weatherIcon.toLowerCase();

    let cloudy = ["cloudy","cloudy-gusts","smog","tornado","hurricane","day-haze","fog", "clouds"];
    let rain = ["storm-showers","thunderstorm","sprinkle","rain","rain-mix"];
    let clear = ["dust","day-windy","sunny","hot","windy","clear"];
    let snow = ["snow","sleet","snowflake-cold"];

    if(cloudy.includes(icon))
    {
        return "../images/cloudy.png";
    }
    else if(rain.includes(icon))
    {
        return "../images/showers.png";
    }
    else if(clear.includes(icon))
    {
        return "../images/clear.png";
    }
    else if(snow.includes(icon))
    {
        return "../images/snow.png";
    }
    else return "../images/trailHub-1.png";
}

/**
 * This is a function to refresh the page for the homePageButton eventListener
 */
function homePageButton() {
    window.location.reload();
}

/**
 * This method dynamically generates trail names from trail API to populate drop down list (side nav)
 * This method also populates the LeafLet map with all unique TrailSystems in database
 * @param data Trail objects from /api/v1/trail
 */
function trailNameDropDown(data) {

    let systemSet = new Set(); //set to prevent duplicate trail systems
    let trailObjectList = []; //set to pull Lat/Lon from trail objects with separate systems
    let difficultySet = new Set(); //set to prevent duplicate trail systems

    //access the dropdown in our HTML
    let trailDropDown = document.getElementById("trailByName");
    let trailDropDownSystem = document.getElementById("trailBySystem");
    let trailDropDownDifficulty = document.getElementById("trailByDifficulty");

    for (let i = 0; i < data.length; i++) {
        let trail = data[i];
        let p = document.createElement("p");
        p.innerText = trail.name;
        p.setAttribute("value", trail.name);
        p.classList.add("trailNames");
        if (!systemSet.has(trail.trailSystem.name)) { //if trail system doesn't already exist, add it to list
            systemSet.add(trail.trailSystem.name);
            trailObjectList.push(trail); //add trail object with unique system to grab lat/lon for map
            let p2 = document.createElement("p");
            p2.innerText = trail.trailSystem.name;
            p2.classList.add("trailSystems");
            trailDropDownSystem.appendChild(p2);
        }
        if (!difficultySet.has(trail.difficulty)) { //if difficulty doesn't already exist, add it to list
            difficultySet.add(trail.difficulty);
            let p3 = document.createElement("p");
            p3.innerText = trail.difficulty;
            p3.classList.add("trailDifficulties");
            trailDropDownDifficulty.appendChild(p3);
        }
        trailDropDown.appendChild(p);

        //add trailSystems to leaflet Map
        trailObjectList.forEach(trailSystem => addTrailSystemToMap(trailSystem));
        fetchWeather("home"); //set homepage weather to current visible trailSystem on map
    }
}

/**
 * This function retrieves a trail object by name or retrieves all trail objects by trail system name or
 * trail objects by trail difficulty (rating)
 * @param value the name of either a trail or trail system or trail rating
 * @param type either names, systems, or ratings
 */
function getTrailByName(value, type) {

    let trailUri = "http://localhost:8080/api/v1/trail/" + type + "/" + value;
    let params = {
        method: "get"
    };

    fetch(trailUri, params)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("Get trail by name output:")
            console.log(data);
            if (type === "names") {
                fetchTrail(data);
            } else {
                fetchTrailList(data, type);
            }
        });
}

/**
 * This function generates the HTML for the TrailCards with the trail image, then the TrailStats with the
 * trail information as well as the action buttons beneath it
 * @param data is the trail object(s) previously fetched from getTrailByName
 */
function fetchTrail(data) {
    let trail = data[0];

    //clear Review HTML
    let allReviews = document.getElementById("reviewGrid");
    allReviews.innerHTML = ""; //clear existing reviews

    //clear existing HomePage content
    hideHomePageElements();

    //show trails div
    let trailDiv = document.getElementById("trails");
    trailDiv.style.display = "block";

    //store active card trail for reviewGrid
    activeTrail = trail;

    //for bootstrap cards
    let trailCard = document.getElementById("trailCard");
    trailCard.innerHTML = ""; //clear existing card
    trailCard.classList.remove("SystemListCard");
    trailCard.classList.add("removeBorderRad");
    let trailStats = document.getElementById("trailStats");
    trailStats.innerHTML = ""; //clear existing card

    //create card elements || IMAGE CARD
    trailCard.classList.add("card");
    let cardImg = document.createElement("img");
    cardImg.classList.add("card-img-top");
    cardImg.setAttribute('id', 'cardImage');
    let cardDiv = document.createElement("div");
    cardDiv.setAttribute('id', "trail-result");
    cardDiv.classList.add("card-body", "p-0");

    //create Stats Card
    trailStats.classList.add("card");
    let headerDiv = document.createElement("div");
    headerDiv.classList.add("card-header");
    headerDiv.innerHTML = "Trail: " + trail.name;
    let statsUl = document.createElement("ul");
    statsUl.setAttribute('id', "trail-stats");
    statsUl.classList.add("list-group", "list-group-flush", "trailStatsList");

    //add button to retrieve reviews
    let reviewButton = document.createElement("button");
    reviewButton.setAttribute('id', "getReviewButton");
    reviewButton.setAttribute('type', "submit");
    reviewButton.innerHTML = "Get Reviews";

    //add button to add reviews
    let addReviewButton = document.createElement("button");
    addReviewButton.setAttribute('id', "addReviewButton");
    addReviewButton.setAttribute('type', "submit");
    addReviewButton.innerHTML = "Add Review";

    //add button to delete trail
    let removeTrailButton = document.createElement("button");
    removeTrailButton.setAttribute('id', "removeTrailButton");
    removeTrailButton.setAttribute('type', "submit");
    removeTrailButton.innerHTML = "Delete Trail";

    //add button to edit trail
    let EditTrailButton = document.createElement("button");
    EditTrailButton.setAttribute('id', "editTrailButton");
    EditTrailButton.setAttribute('type', "submit");
    EditTrailButton.innerHTML = "Edit Trail";
    EditTrailButton.classList.add("cardButton");

    //append to HTML
    trailCard.appendChild(cardImg);
    trailCard.appendChild(cardDiv);
    let stats = [headerDiv, statsUl, EditTrailButton, reviewButton, addReviewButton, removeTrailButton];
    for (let i = 0; i < stats.length; i++)
    {
        trailStats.appendChild(stats[i]);
    }

    let img = document.getElementById("cardImage");

    singleTrail(trail);
    img.src = trail.imageLink;
    //add image description under image
    img.setAttribute('alt', trail.name + " trail at the " + trail.trailSystem.name + " bike park");
}

/**
 * This function processes either a list of trails at a TrailSystem, or a list of trails with a certain Rating
 * @param data the list of Trail objects fetched previously from getTrailByName
 * @param type either type 'systems' or 'ratings'
 */
function fetchTrailList(data, type) {

    //show trails div
    let trailDiv = document.getElementById("trails");
    trailDiv.style.display = "block";

    //clear existing trail card (if there is one) and reviews
    let trailCard = document.getElementById("trailCard");
    let trailStats = document.getElementById("trailStats");
    let allReviews = document.getElementById("reviewGrid");
    allReviews.innerHTML = ""; //clear existing reviews
    trailCard.innerHTML = "";
    trailStats.innerHTML = "";

    //clear existing HomePage content
    hideHomePageElements();

    trailCard.classList.add("card");
    trailCard.classList.add("SystemListCard");
    trailCard.classList.remove("removeBorderRad");

    let div = document.createElement("div");
    div.classList.add("trailListBySystem", "card-header");

    try {
        if (type === "systems") {
            div.innerText = 'Trails at "' + data[0].trailSystem.name + '" trail system';

            //populate trailStats card with weather for trail system
            userLat = data[0].trailSystem.lat;
            userLong = data[0].trailSystem.lon;

            activeTrail = data[0];//this might break something

            fetchWeather("systemsList");

        }
    } catch (e) {
        trailCard.innerHTML = "There are no trails at this system :(";
    }

    if (type === "ratings") {
        trailStats.classList.remove("card"); //hide stats card styles
        div.innerText = 'All Trails with a "' + data[0].difficulty + '" rating';
    }
    trailCard.appendChild(div);
    let ul = document.createElement("ul");
    ul.classList.add("list-group", "list-group-flush", "trailSystemList");

    for (let i = 0; i < data.length; i++) {
        let trailSystem = data[i];

        //create all elements
        let li = document.createElement("li");
        li.classList.add("list-group-item", "trailSystemsList");

        //add contents
        li.innerText = trailSystem.name;

        //append to UL
        ul.appendChild(li);
    }

    trailCard.appendChild(ul);

}

/**
 * This function populates the trail stats with the single trail values from Trail object and
 * this function also handles all action buttons found under the stats list
 * @param data trail object
 */
function singleTrail(data) {

    //access the list in our HTML
    let trailResult = document.getElementById("trail-result");
    let trailStats = document.getElementById("trail-stats");
    trailResult.innerHTML = ""; //clear existing trail
    trailStats.innerHTML = "";

    let trail = data;
    activeTrail = trail //set for getReviews method

    //create all elements for img card
    let section = document.createElement("section");
    let p = document.createElement("p");
    p.classList.add("imageDescription");

    //trail stats card
    let statsLi = document.createElement("li");
    let statsLi1 = document.createElement("li");
    let statsLi2 = document.createElement("li");
    let statsLi3 = document.createElement("li");
    let statsLi4 = document.createElement("li");
    let statsLi5 = document.createElement("li");
    const listItems = [statsLi, statsLi1, statsLi2, statsLi3, statsLi4, statsLi5];

    //add image description
    p.innerText = '"' + trail.name + ' trail at the ' + trail.trailSystem.name + ' bike park"';

    statsLi.innerText = "Trail System: " + trail.trailSystem.name;
    statsLi1.innerText = "State: " + trail.state;
    statsLi2.innerText = "Difficulty: " + trail.difficulty;
    statsLi3.innerText = "Length: " + trail.length + "ft";
    statsLi4.innerText = "Elevation: " + trail.elevation + "ft";
    statsLi5.innerText = "BiDirectional: " + trail.multiDirectional;

    //construct stats list
    listItems.forEach(item => item.classList.add("list-group-item"));
    listItems.forEach(item => trailStats.appendChild(item));

    //connect them
    section.appendChild(p);

    //add the section to the list
    trailResult.appendChild(section);

    //'Edit Trails' button
    let editTrailButton = document.querySelector("#editTrailButton");
    editTrailButton.addEventListener("click", editTrailFormType);

    //'Get all Reviews' button
    let getReviewButton = document.querySelector("#getReviewButton");
    getReviewButton.addEventListener("click", getReviews);

    //'Add Review' button
    let addReviewButton = document.querySelector("#addReviewButton");
    addReviewButton.addEventListener("click", addReviewModal);

    //'Delete Trail' button
    let removeTrailButton = document.querySelector("#removeTrailButton");
    removeTrailButton.addEventListener("click", removeTrail);
}

/**
 * This function styles the allFormsModal form to edit a Trail
 */
function editTrailFormType(){
    formType = "editTrail";
    let editForm = document.getElementById("editTrailForm"); //grab html
    let addForm = document.getElementById("addTrailForm");
    editForm.innerHTML = ""; //clear existing fields
    addForm.innerHTML = ""; //clear existing fields
    editTrailModal();
}

/**
 * This function styles the allFormsModal form to add a Trail
 */
function addTrailFormType(){
    //show trails div
    let trailDiv = document.getElementById("trails");
    trailDiv.style.display = "block";

    formType = "addTrail";
    let editForm = document.getElementById("editTrailForm"); //grab html
    let addForm = document.getElementById("addTrailForm");
    editForm.innerHTML = ""; //clear existing fields
    addForm.innerHTML = ""; //clear existing fields
    editTrailModal();
}

/**
 * This function performs a fetch of all Review objects at the currently shown trail
 * @param event mouse click (when user clicks 'Get Reviews' button)
 */
function getReviews(event) {

    event.preventDefault();

    let trailUri = "http://localhost:8080/api/v1/review/" + activeTrail.name;
    let params = {
        method: "get"
    };

    fetch(trailUri, params) //get response
        .then(function (response) {
            if(response.ok){
            return response.json(); //ask for response to be converted to json
            }
        })
        .then(function (data) { //receive the text when promise is complete
            printReviews(data);
        });
}

/**
 * This function performs a DELETE request to remove the 'active' Trail
 * Page is reloaded when delete is completed
 * @param event mouse click (when user selects DELETE TRAIL button)
 */
function removeTrail(event) {
    event.preventDefault();

    let data = {trailID: activeTrail.trailID};

    let trailUri = "http://localhost:8080/api/v1/trail/";
    let params = {
        method: "delete",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    fetch(trailUri, params)
        .then(function () {
            window.location.reload(); //refresh page
        });
}

/**
 * This function performs a DELETE request to remove the single review from current Trail object
 * Page is reloaded when delete is completed
 * @param data mouse click (when user selects DELETE REVIEW button on single review)
 */
function removeReview(data) {

    let id = {reviewID: data};

    let trailUri = "http://localhost:8080/api/v1/review/";
    let params = {
        method: "delete",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(id),
    };

    fetch(trailUri, params)
        .then(function () {
            window.location.reload(); //refresh page
        });
}

/**
 * Despite it's name, this function populates all forms with their respective form content
 * Add Trail and Edit Trail have the same fields, Edit Trail will populate the fields with the current data
 * Add Review will populate the form with data specific to Review objects
 */
function editTrailModal() {

    //turn off AddReview button
    let submitReviewButton = document.getElementById("reviewFormButton");
    submitReviewButton.style.display = "none";

    let trailFormButton = document.getElementById("trailFormButton");
    trailFormButton.style.display = "block";

    let editForm = document.getElementById("editTrailForm"); //grab html
    let addForm = document.getElementById("addTrailForm");
    let reviewForm = document.getElementById("addReviewForm");
    let header = document.getElementById("modalHeader");

    reviewForm.innerHTML = "";
    editForm.innerHTML = ""; //clear existing fields
    addForm.innerHTML = ""; //clear existing fields

    //create all form elements
    //labels & inputs //TODO: create these elements in a loop

    let labelName = document.createElement("label");
    let labelSystem = document.createElement("label");
    let labelLat = document.createElement("label");
    let labelLon = document.createElement("label");
    let labelState = document.createElement("label");
    let labelElevation = document.createElement("label");
    let labelLength = document.createElement("label");
    let labelDirection = document.createElement("label");
    let labelDirection1 = document.createElement("label");
    let labelDirection2 = document.createElement("label");
    let labelDifficulty = document.createElement("label");
    let labelDifficulty1 = document.createElement("label");
    let labelDifficulty2 = document.createElement("label");
    let labelDifficulty3 = document.createElement("label");
    let labelDifficulty4 = document.createElement("label");

    //TODO classlist.adds to a forLoop
    let inputDiv1 = document.createElement("div");
    inputDiv1.classList.add("inputDiv");
    let inputName = document.createElement("input");
    let inputDiv2 = document.createElement("div");
    inputDiv2.classList.add("inputDiv");
    let inputSystem = document.createElement("input");
    let inputDiv6 = document.createElement("div");
    let inputLat = document.createElement("input");
    inputDiv6.classList.add("inputDiv");
    let inputDiv7 = document.createElement("div");
    let inputLon = document.createElement("input");
    inputDiv7.classList.add("inputDiv");
    let inputDiv3 = document.createElement("div");
    inputDiv3.classList.add("inputDiv");
    let inputState = document.createElement("input");
    let inputDiv4 = document.createElement("div");
    inputDiv4.classList.add("inputDiv");
    let inputElevation = document.createElement("input");
    let inputDiv5 = document.createElement("div");
    inputDiv5.classList.add("inputDiv");
    let inputLength = document.createElement("input");
    let inputDirection1 = document.createElement("input");
    let inputDirection2 = document.createElement("input");
    let inputDifficulty1 = document.createElement("input");
    let inputDifficulty2 = document.createElement("input");
    let inputDifficulty3 = document.createElement("input");
    let inputDifficulty4 = document.createElement("input");
    //radio div
    let difficultyDiv = document.createElement("div");
    let directionDiv = document.createElement("div");

    labelName.innerText = "Trail Name: ";
    labelName.setAttribute("for", "name");
    inputName.setAttribute("type", "text");
    inputName.setAttribute("name", "name");
    inputName.setAttribute("id", "name");

    labelSystem.innerText = "Trail System: ";
    labelSystem.setAttribute("for", "system");
    inputSystem.setAttribute("type", "text");
    inputSystem.setAttribute("name", "system");
    inputSystem.setAttribute("id", "system");

    labelLat.innerText = "Trail System Latitude: ";
    labelLat.setAttribute("for", "lat");
    inputLat.setAttribute("type", "text");
    inputLat.setAttribute("name", "lat");
    inputLat.setAttribute("id", "lat");

    labelLon.innerText = "Trail System Longitude: ";
    labelLon.setAttribute("for", "lon");
    inputLon.setAttribute("type", "text");
    inputLon.setAttribute("name", "lon");
    inputLon.setAttribute("id", "lon");

    labelState.innerText = "State: ";
    labelState.setAttribute("for", "state");
    inputState.setAttribute("type", "text");
    inputState.setAttribute("name", "state");
    inputState.setAttribute("id", "state");

    labelElevation.innerText = "Elevation: ";
    labelElevation.setAttribute("for", "elevation");
    inputElevation.setAttribute("type", "text");
    inputElevation.setAttribute("name", "elevation");
    inputElevation.setAttribute("id", "elevation");

    labelLength.innerText = "Length: ";
    labelLength.setAttribute("for", "length");
    inputLength.setAttribute("type", "text");
    inputLength.setAttribute("name", "length");
    inputLength.setAttribute("id", "length");

    labelDirection.innerText = "Is this a two-way trail?  ";
    labelDirection1.innerText = "True ";
    inputDirection1.setAttribute("name", "direction");
    inputDirection1.setAttribute("value", "true");
    inputDirection1.setAttribute("type", "radio");
    labelDirection2.innerText = "False ";
    inputDirection2.setAttribute("name", "direction");
    inputDirection2.setAttribute("value", "false");
    inputDirection2.setAttribute("type", "radio");

    labelDifficulty.innerText = "Difficulty Rating: ";
    labelDifficulty1.innerText = "Green ";
    inputDifficulty1.setAttribute("name", "difficulty");
    inputDifficulty1.setAttribute("value", "GREEN");
    inputDifficulty1.setAttribute("type", "radio");
    inputDifficulty1.classList.add("radioButtonInput");
    labelDifficulty2.innerText = "Blue ";
    inputDifficulty2.setAttribute("name", "difficulty");
    inputDifficulty2.setAttribute("value", "BLUE");
    inputDifficulty2.setAttribute("type", "radio");
    inputDifficulty2.classList.add("radioButtonInput");
    labelDifficulty3.innerText = "Black ";
    inputDifficulty3.setAttribute("name", "difficulty");
    inputDifficulty3.setAttribute("value", "BLACK");
    inputDifficulty3.setAttribute("type", "radio");
    inputDifficulty3.classList.add("radioButtonInput");
    labelDifficulty4.innerText = "Double Black ";
    inputDifficulty4.setAttribute("name", "difficulty");
    inputDifficulty4.setAttribute("value", "DOUBLE_BLACK");
    inputDifficulty4.setAttribute("type", "radio");
    inputDifficulty4.classList.add("radioButtonInput");

    //construct radio divs
    difficultyDiv.appendChild(labelDifficulty);
    difficultyDiv.classList.add("radioDiv");
    labelDifficulty1.appendChild(inputDifficulty1);
    difficultyDiv.appendChild(labelDifficulty1);
    labelDifficulty2.appendChild(inputDifficulty2);
    difficultyDiv.appendChild(labelDifficulty2);
    labelDifficulty3.appendChild(inputDifficulty3);
    difficultyDiv.appendChild(labelDifficulty3);
    labelDifficulty4.appendChild(inputDifficulty4);
    difficultyDiv.appendChild(labelDifficulty4);
    //direction divs
    directionDiv.appendChild(labelDirection);
    directionDiv.classList.add("radioDiv");
    labelDirection1.appendChild(inputDirection1);
    directionDiv.appendChild(labelDirection1);
    labelDirection2.appendChild(inputDirection2);
    directionDiv.appendChild(labelDirection2);

    if (formType === "addTrail") {

        header.innerHTML = " Add Trail ";

        inputDiv1.appendChild(inputName);
        inputDiv2.appendChild(inputSystem);
        inputDiv6.appendChild(inputLat);
        inputDiv7.appendChild(inputLon);
        inputDiv3.appendChild(inputState);
        inputDiv4.appendChild(inputElevation);
        inputDiv5.appendChild(inputLength);

        let formItems = [labelName, inputDiv1, labelSystem, inputDiv2, labelLat, inputDiv6, labelLon, inputDiv7,
            labelState, inputDiv3, labelElevation, inputDiv4, labelLength, inputDiv5, directionDiv, difficultyDiv];
        for (let i = 0; i < formItems.length; i++)
        {
            addForm.appendChild(formItems[i]);
        }

    }

    if (formType === "editTrail") //preFill form if editTrail  is selected //add elements
    {
        header.innerHTML = " Edit Trail ";
        inputName.setAttribute("value", activeTrail.name);
        inputSystem.setAttribute("value", activeTrail.trailSystem.name);
        inputLat.setAttribute("value", activeTrail.trailSystem.lat);
        inputLon.setAttribute("value", activeTrail.trailSystem.lon);
        inputState.setAttribute("value", activeTrail.state);
        inputElevation.setAttribute("value", activeTrail.elevation);
        inputLength.setAttribute("value", activeTrail.length);

        editForm.appendChild(labelName);
        inputDiv1.appendChild(inputName);
        editForm.appendChild(inputDiv1);
        editForm.appendChild(labelSystem);
        inputDiv2.appendChild(inputSystem);
        editForm.appendChild(inputDiv2);
        editForm.appendChild(labelLat);
        inputDiv6.appendChild(inputLat);
        editForm.appendChild(inputDiv6);
        editForm.appendChild(labelLon);
        inputDiv7.appendChild(inputLon);
        editForm.appendChild(inputDiv7);
        editForm.appendChild(labelState);
        inputDiv3.appendChild(inputState);
        editForm.appendChild(inputDiv3);
        editForm.appendChild(labelElevation);
        inputDiv4.appendChild(inputElevation);
        editForm.appendChild(inputDiv4);
        editForm.appendChild(labelLength);
        inputDiv5.appendChild(inputLength);
        editForm.appendChild(inputDiv5);
        editForm.appendChild(directionDiv);
        editForm.appendChild(difficultyDiv);

    }

    //display modal
    let modal = document.getElementById("allFormsModal");
    modal.style.display = "block";
}

/**
 * This function populates the allFormsModal form with Review object fields
 */
function addReviewModal(){

    //show button || hide editTrail button
    let reviewFormButton = document.getElementById("reviewFormButton");
    reviewFormButton.style.display = "block";
    let trailFormButton = document.getElementById("trailFormButton");
    trailFormButton.style.display = "none";

    //clear existing form fields
    let editForm = document.getElementById("editTrailForm"); //grab html
    let addForm = document.getElementById("addTrailForm");
    editForm.innerHTML = ""; //clear existing fields
    addForm.innerHTML = ""; //clear existing fields

    let form = document.getElementById("addReviewForm");
    form.innerHTML = ""; //clear existing fields
    let header = document.getElementById("modalHeader");
    header.innerHTML = " Add Review ";

    //labels & inputs //TODO: create these elements in a loop
    let labelAuthor = document.createElement("label");
    let inputDiv1 = document.createElement("div");
    inputDiv1.classList.add("inputDiv");
    let inputAuthor = document.createElement("input");
    let labelBike = document.createElement("label")
    let inputDiv2 = document.createElement("div");
    inputDiv2.classList.add("inputDiv");
    let inputBike = document.createElement("input");
    let labelWeather = document.createElement("label");
    let inputDiv3 = document.createElement("div");
    inputDiv3.classList.add("inputDiv");
    let inputWeather = document.createElement("input");
    let labelConditions = document.createElement("label");
    let inputDiv4 = document.createElement("div");
    inputDiv4.classList.add("inputDiv");
    let inputConditions = document.createElement("input");
    let labelScore = document.createElement("label");
    let inputDiv5 = document.createElement("div");
    inputDiv5.classList.add("inputDiv");
    let inputScore = document.createElement("input");

    let inputDiv6 = document.createElement("div");
    inputDiv6.classList.add("inputDiv");
    let labelRecommend = document.createElement("label");
    let labelRecommend1 = document.createElement("label");
    let inputRecommend1 = document.createElement("input");
    let labelRecommend2 = document.createElement("label");
    let inputRecommend2 = document.createElement("input");

    let inputDiv7 = document.createElement("div");
    inputDiv7.classList.add("inputDiv");
    let labelRatingValid = document.createElement("label");
    let labelRatingValid1 = document.createElement("label");
    let inputRatingValid1 = document.createElement("input");
    let labelRatingValid2 = document.createElement("label");
    let inputRatingValid2 = document.createElement("input");

    //radio div
    let ratingValidDiv = document.createElement("div");
    let recommendDiv = document.createElement("div");

    labelAuthor.innerText = "Rider Name: ";
    labelAuthor.setAttribute("for", "riderName");
    inputAuthor.setAttribute("type", "text");
    inputAuthor.setAttribute("name", "riderName");
    inputAuthor.setAttribute("id", "riderName");

    labelBike.innerText = "Bike Ridden: ";
    labelBike.setAttribute("for", "bike");
    inputBike.setAttribute("type", "text");
    inputBike.setAttribute("name", "bike");
    inputBike.setAttribute("id", "bike");

    labelWeather.innerText = "Weather when ridden: ";
    labelWeather.setAttribute("for", "weather");
    inputWeather.setAttribute("type", "text");
    inputWeather.setAttribute("name", "weather");
    inputWeather.setAttribute("id", "weather");

    labelConditions.innerText = "Trail conditions when ridden: ";
    labelConditions.setAttribute("for", "conditions");
    inputConditions.setAttribute("type", "text");
    inputConditions.setAttribute("name", "conditions");
    inputConditions.setAttribute("id", "conditions");

    labelScore.innerText = "Score out of 5: ";
    labelScore.setAttribute("for", "score");
    inputScore.setAttribute("type", "text");
    inputScore.setAttribute("name", "score");
    inputScore.setAttribute("id", "score");

    labelRecommend.innerText = "Would you recommend this trail?  ";
    labelRecommend1.innerText = "true";
    inputRecommend1.setAttribute("name", "recommend");
    inputRecommend1.setAttribute("value", "true");
    inputRecommend1.setAttribute("type", "radio");
    labelRecommend2.innerText = "false";
    inputRecommend2.setAttribute("name", "recommend");
    inputRecommend2.setAttribute("value", "false");
    inputRecommend2.setAttribute("type", "radio");

    labelRatingValid.innerText = "Does the rating seem accurate for this trail?  ";
    labelRatingValid1.innerText = "true";
    inputRatingValid1.setAttribute("name", "ratingValid");
    inputRatingValid1.setAttribute("value", "true");
    inputRatingValid1.setAttribute("type", "radio");
    labelRatingValid2.innerText = "false";
    inputRatingValid2.setAttribute("name", "ratingValid");
    inputRatingValid2.setAttribute("value", "false");
    inputRatingValid2.setAttribute("type", "radio");

    //construct radio divs
    recommendDiv.appendChild(labelRecommend);
    labelRecommend1.appendChild(inputRecommend1);
    recommendDiv.appendChild(labelRecommend1);
    labelRecommend2.appendChild(inputRecommend2);
    recommendDiv.appendChild(labelRecommend2);
    inputDiv6.appendChild(recommendDiv); //append to list
    ratingValidDiv.appendChild(labelRatingValid);
    labelRatingValid1.appendChild(inputRatingValid1);
    ratingValidDiv.appendChild(labelRatingValid1);
    labelRatingValid2.appendChild(inputRatingValid2);
    ratingValidDiv.appendChild(labelRatingValid2);
    inputDiv7.appendChild(ratingValidDiv); //append to list

    //add to form
    form.appendChild(labelAuthor);
    inputDiv1.appendChild(inputAuthor);
    form.appendChild(inputDiv1);
    form.appendChild(labelBike);
    inputDiv2.appendChild(inputBike);
    form.appendChild(inputDiv2);
    form.appendChild(labelWeather);
    inputDiv3.appendChild(inputWeather);
    form.appendChild(inputDiv3);
    form.appendChild(labelConditions);
    inputDiv4.appendChild(inputConditions);
    form.appendChild(inputDiv4);
    form.appendChild(labelScore);
    inputDiv5.appendChild(inputScore);
    form.appendChild(inputDiv5);
    form.appendChild(inputDiv6);
    form.appendChild(inputDiv7);

    //display modal
    let modal = document.getElementById("allFormsModal");
    modal.style.display = "block";

}

/**
 * This function closes the allFormsModal modal, it also hides the separate submit buttons for
 * the different forms that populate it
 */
function closeModal() {

    //hide form buttons
    let trailFormButton = document.getElementById("trailFormButton");
    trailFormButton.style.display = "none";
    let reviewFormButton = document.getElementById("reviewFormButton");
    reviewFormButton.style.display = "none";

    let modal = document.getElementById("allFormsModal");
    modal.style.display = "none";
}

//process editTrail || addTrail form data on submit
/**
 * event listeners for Edit Trail and Add Review buttons
 */
let trailFormButton = document.querySelector("#trailFormButton");
trailFormButton.addEventListener('click', editTrailFormData);
let reviewFormButton = document.querySelector("#reviewFormButton");
reviewFormButton.addEventListener('click', addReviewFormData);

//TODO: ADD FORM VALIDATION
/**
 * This function sets a POST request to API to add a Review Object on currently active trail
 * @param event mouse click on Submit button in AddReview form Modal
 */
function addReviewFormData(event){

    event.preventDefault();

    let date = new Date();
    let day = date.getDate();
    //add zero before number if necessary
    if(day < 10) { day = "0" + day; }
    let today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + day;

    let form = document.getElementById("addReviewForm");

    //store fields
    let reviewAuthor = form.elements['riderName'].value; //trail name
    let reviewBike = form.elements['bike'].value; //trail system
    let reviewWeather = form.elements['weather'].value; //trail system
    let reviewConditions = form.elements['conditions'].value; //trail elevation
    let reviewScore = document.getElementById("score").value;
    let reviewRecommend = form.elements['recommend'].value; //trail direction
    let reviewRating = form.elements['ratingValid'].value; //trail rating

    //create a JS object for serialization
    let jsonObj = {
        maxScore: 5,
        score: reviewScore,
        author: reviewAuthor,
        dateReviewed: today,
        wouldRecommend: reviewRecommend,
        bikeRidden: reviewBike,
        trailConditions: reviewConditions,
        weather: reviewWeather,
        trailName: activeTrail.name,
        ratingValid: reviewRating
    }

    //prepare fetch() data
    let url = "http://localhost:8080/api/v1/review";
    let params = {
        method: "post",
        //required mim type for post request
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonObj)
    }

    //send data, then print the response
    fetch(url, params).then(response => console.log(response));

    //hide button
    let reviewFormButton = document.getElementById("reviewFormButton");
    reviewFormButton.style.display = "none";
    closeModal();

}

//TODO: ADD FORM VALIDATION
/**
 * This function either sends a POST or PUT request to local API whether the addTrail or editTrail form submit
 * buttons were clicked
 * @param event either addTrail submit or editTrail submit buttons selected in respective forms (modal)
 */
function editTrailFormData(event){

    event.preventDefault();

    let form;
    let url;
    let params;

    if(formType === "editTrail")
    {
        form = document.getElementById("editTrailForm");
    }

    if(formType === "addTrail")
    {
        form = document.getElementById("addTrailForm");
    }

    //store fields
    let name = form.elements['name'].value; //trail name
    let system = form.elements['system'].value; //trail system
    let lat = form.elements['lat'].value; //trail system lat
    let lon = form.elements['lon'].value; //trail system lon
    let trailState = form.elements['state'].value; //trail system
    let trailElevation = form.elements['elevation'].value; //trail elevation
    let trailLength = document.getElementById("length").value;
    let trailDirection = form.elements['direction'].value; //trail direction
    let trailDifficulty = form.elements['difficulty'].value; //trail rating

    let trailSystemJson = {
        lat: lat,
        lon: lon,
        name: system
    }

    //add trail process
    if(formType === "addTrail")
    {
        //create a JS object for serialization
        let jsonObj = {
            length: trailLength,
            elevation: trailElevation,
            state: trailState,
            trailSystem: trailSystemJson,
            name: name,
            imageLink: "../images/roadGap.jpeg",
            multiDirectional: trailDirection,
            difficulty: trailDifficulty
        }

        //prepare fetch() data
        url = "http://localhost:8080/api/v1/trail";
        params = {
            method: "post",
            //required mim type for post request
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonObj)
        }
        console.log(JSON.stringify(jsonObj));
    }

    //edit trail process
    if(formType === "editTrail")
    {
        let trailSystemJson = {
            lat: lat,
            lon: lon,
            name: system
        }

        //create a JS object for serialization
        let jsonObj = {
            trailID: activeTrail.trailID,
            length: trailLength,
            elevation: trailElevation,
            state: trailState,
            trailSystem: trailSystemJson,
            name: name,
            imageLink: activeTrail.imageLink,
            multiDirectional: trailDirection,
            difficulty: trailDifficulty
        }

        //prepare fetch() data
        url = "http://localhost:8080/api/v1/trail";
        params = {
            method: "put",
            //required mim type for post request
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonObj)
        }
    }

    //send data, then print the response
    fetch(url, params).then(response => console.log(response));

    let trailFormButton = document.getElementById("trailFormButton");
    trailFormButton.style.display = "none";

    //if updating trail, go back to that trail
    if(formType === "editTrail")
    {
        closeModal();
        homePageCard("updated");
    }
    else{
        window.location.reload(); //refresh page
    }

}

/**
 * This function populates area beneath trail cards with review objects after user selects 'Get Reviews' button
 * @param data Review object(s) retrieved from api/v1/review
 */
function printReviews(data) {

//access the list in our HTML
    let allReviews = document.getElementById("reviewGrid");
    allReviews.innerHTML = ""; //clear existing reviews
    activeReviews = []; //clear current list of reviews

    if(data == null) { return } // if there are no reviews, stop function

    for (let i = 0; i < data.length; i++) {
        let review = data[i];
        activeReviews[i] = data[i];

        //create all elements
        let section = document.createElement("section");
        section.classList.add("reviewSection")
        let h5 = document.createElement("h5");
        let ul = document.createElement("ul")
        let li = document.createElement("li");
        let li1 = document.createElement("li");
        let li2 = document.createElement("li");
        let li3 = document.createElement("li");
        let li4 = document.createElement("li");
        let li5 = document.createElement("li");
        let div = document.createElement("div");
        div.classList.add("deleteButtonDiv");
        let deleteButton = document.createElement("button");

        //add contents
        h5.innerText = "Rider: " + review.author;
        li.innerText = "Date Ridden: " + review.dateReviewed;
        li1.innerText = "Bike: " + review.bikeRidden;
        li2.innerText = "Weather when Ridden: " + review.weather;
        li3.innerText = "Trail Conditions: " + review.trailConditions;
        li4.innerText = "Was the Trail Rating Accurate? " + review.ratingValid;
        li5.innerText = "I would Recommend this Trail: " + review.wouldRecommend;
        deleteButton.innerHTML = "Delete";
        deleteButton.setAttribute("class", "deleteReviewButton");
        deleteButton.setAttribute('id', review.reviewID); //store unique id of review for delete
        deleteButton.setAttribute('type', "submit");

        //construct list
        ul.appendChild(li);
        ul.appendChild(li1);
        ul.appendChild(li2);
        ul.appendChild(li3);
        ul.appendChild(li4);
        ul.appendChild(li5);

        //connect them
        section.appendChild(h5);
        section.appendChild(ul);
        div.appendChild(deleteButton);
        section.appendChild(div);

        //add the section to the list
        allReviews.appendChild(section);

    }

}
