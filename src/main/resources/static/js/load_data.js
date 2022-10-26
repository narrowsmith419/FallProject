let trails = [];
let trails2 = [];
let activeTrail;
let count = 0;

//'Select a Trail' drop-down button
let submitButton = document.querySelector("#submitButton");
submitButton.addEventListener("click", buttonClick, false);
submitButton.addEventListener("click", fetchTrail);

//Select a Trail by Name drop-down button
let trailByNameShow = document.querySelector("#dropBtnName");
trailByNameShow.addEventListener("click", getTrailNameShow);
//Select a Trail by TrailSystem drop-down button
let trailBySystemShow = document.querySelector("#dropBtnSystem");
trailBySystemShow.addEventListener("click", getTrailSystemShow);
//Select a Trail by Difficulty drop-down button
let trailByDifficultyShow = document.querySelector("#dropBtnDifficulty");
trailByDifficultyShow.addEventListener("click", getTrailDifficultyShow);

window.onload = function () {

    //create trail objects to make with a GET request
    let trailUri = "http://localhost:8080/api/v1/trail";
    let params = {
        method: "get"
    };

    fetch(trailUri, params) //get response
        .then(function (response) {
            return response.json(); //ask for response to be converted to json
        })
        .then(function (data) { //receive the text when promise is complete
            trailDropDown(data);
            trailNameDropDown(data);
            showTrails(data);
        });
};


function showTrails(data) {

    //access the list in our HTML
    let trailList = document.getElementById("trail-list");

    for (let i = 0; i < data.length; i++) {
        let trail = data[i];

        //create all elements
        let section = document.createElement("section");
        let h2 = document.createElement("h2");
        let ul = document.createElement("ul")
        let li = document.createElement("li");
        let li1 = document.createElement("li");
        let li2 = document.createElement("li");
        let li3 = document.createElement("li");
        let li4 = document.createElement("li");
        let li5 = document.createElement("li");

        //add contents
        h2.innerText = "Trail: " + trail.name;
        li.innerText = "Trail System: " + trail.trailSystem;
        li1.innerText = "State: " + trail.state;
        li2.innerText = "Difficulty: " + trail.difficulty;
        li3.innerText = "Length: " + trail.length + "ft";
        li4.innerText = "Elevation: " + trail.elevation + "ft";
        li5.innerText = "BiDirectional: " + trail.multiDirectional;

        //construct list
        ul.appendChild(li);
        ul.appendChild(li1);
        ul.appendChild(li2);
        ul.appendChild(li3);
        ul.appendChild(li4);
        ul.appendChild(li5);

        //connect them
        section.appendChild(h2);
        section.appendChild(ul);

        //add the section to the list
        trailList.appendChild(section);

    }
}

/**
 * toggle trail names inside nav when button selected
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

/*close the dropdown menu when clicked outside it*/
window.onclick = function (event){
    if(!event.target.matches('.dropBtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for(i = 0; i < dropdowns.length; i++) {
            var openDropDown = dropdowns[i];
            if(openDropDown.classList.contains('show')){
                openDropDown.classList.remove('show');
            }
        }
    }
}

/**
 * dynamically generates trail names from trail API to populate drop down list
 * @param data Trail objects from /api/v1/trail
 */
function trailDropDown(data) {
    //access the dropdown in our HTML
    let trailDropDown = document.getElementById("trail-drop");

    //create outer elements
    let label = document.createElement("label");
    let div = document.createElement("div");
    label.setAttribute("id", "trailNameLabel");
    label.setAttribute("class", "h3 text-light");
    label.innerText = "Select a Trail";
    trailDropDown.appendChild(label);
    trailDropDown.appendChild(div);

    //create drop down
    let select = document.createElement("select");
    select.setAttribute("id", "trailNameDrop");
    for (let i = 0; i < data.length; i++) {
        trails[i] = data[i]; //will need to remove this eventually
        let trail = data[i];
        let option = document.createElement("option");
        option.innerText = trail.name;
        option.setAttribute("value", trail.name);
        select.appendChild(option);
    }
    div.appendChild(select);
    trailDropDown.appendChild(div);
}

function trailNameDropDown(data) {
    //set to prevent duplicate trail systems
    let systemSet = new Set();
    let difficultySet = new Set();

    //access the dropdown in our HTML
    let trailDropDown = document.getElementById("trailByName");
    let trailDropDownSystem = document.getElementById("trailBySystem");
    let trailDropDownDifficulty = document.getElementById("trailByDifficulty");

    for (let i = 0; i < data.length; i++) {
        trails2[i] = data[i]; //will need to remove this eventually
        let trail = data[i];
        let p = document.createElement("p");
        let p3 = document.createElement("p");
        p.innerText = trail.name;
        p.setAttribute("value", trail.name);
        if(!systemSet.has(trail.trailSystem)){ //if trailsystem doesn't already exist, add it to list
            systemSet.add(trail.trailSystem);
            let p2 = document.createElement("p");
            p2.innerText = trail.trailSystem;
            trailDropDownSystem.appendChild(p2);
        }
        if(!difficultySet.has(trail.difficulty)){ //if difficulty doesn't already exist, add it to list
            difficultySet.add(trail.difficulty);
            let p3 = document.createElement("p");
            p3.innerText = trail.difficulty;
            trailDropDownDifficulty.appendChild(p3);
        }

        trailDropDown.appendChild(p);
    }

}

function buttonClick(event) {
    event.preventDefault();
}

function fetchTrail() {

    //get value from dropdown
    let trailName = document.getElementById("trailNameDrop").value;

    //access the list in our HTML
    let allReviews = document.getElementById("reviewGrid");
    allReviews.innerHTML = ""; //clear existing reviews

    //store active card trail for reviewGrid
    activeTrail = trailName;

    //for bootstrap card
    let trailCard = document.getElementById("trailCard");

    //if fresh page load then create a card
    if (count === 0) {
        trailCard.classList.add("card");
        let cardImg = document.createElement("img");
        cardImg.classList.add("card-img-top");
        cardImg.setAttribute('id', 'cardImage');
        let cardDiv = document.createElement("div");
        cardDiv.setAttribute('id', "trail-result");
        cardDiv.classList.add("card-body");
        //add button to retrieve reviews
        let reviewButton = document.createElement("button");
        reviewButton.setAttribute('id', "getReviewButton");
        reviewButton.setAttribute('type', "submit");
        reviewButton.innerHTML= "Get Reviews";
        reviewButton.classList.add("btn");
        reviewButton.classList.add("btn-primary");
        reviewButton.classList.add("ml-auto");
        //append to HTML
        trailCard.appendChild(cardImg);
        trailCard.appendChild(cardDiv);
        trailCard.appendChild(reviewButton);
    }

    let img = document.getElementById("cardImage");

    for (let i = 0; i < trails.length; i++) {
        let trail = trails[i];
        // console.log(trail);
        if (trail.name === trailName) {
            singleTrail(trail);
            img.src = trail.imageLink;
            img.setAttribute('alt', trailName + " trail at the " + trail.trailSystem + " bike park");
            break;
        }
    }
}

function singleTrail(data) {

    //access the list in our HTML
    let trailResult = document.getElementById("trail-result");
    trailResult.innerHTML = ""; //clear existing trail

    let trail = data;

    //create all elements
    let section = document.createElement("section");
    let h2 = document.createElement("h2");
    let ul = document.createElement("ul")
    let li = document.createElement("li");
    let li1 = document.createElement("li");
    let li2 = document.createElement("li");
    let li3 = document.createElement("li");
    let li4 = document.createElement("li");
    let li5 = document.createElement("li");

    //add contents
    h2.innerText = "Trail: " + trail.name;
    li.innerText = "Trail System: " + trail.trailSystem;
    li1.innerText = "State: " + trail.state;
    li2.innerText = "Difficulty: " + trail.difficulty;
    li3.innerText = "Length: " + trail.length + "ft";
    li4.innerText = "Elevation: " + trail.elevation + "ft";
    li5.innerText = "BiDirectional: " + trail.multiDirectional;

    //construct list
    ul.appendChild(li);
    ul.appendChild(li1);
    ul.appendChild(li2);
    ul.appendChild(li3);
    ul.appendChild(li4);
    ul.appendChild(li5);

    //connect them
    section.appendChild(h2);
    section.appendChild(ul);

    //add the section to the list
    trailResult.appendChild(section);
    count++;

    //'Get all Reviews' button
    let getReviewButton = document.querySelector("#getReviewButton");

    console.log(getReviewButton);
    getReviewButton.addEventListener("click", buttonClick, false);
    getReviewButton.addEventListener("click", getReviews);
}

function getReviews(event) {
    event.preventDefault();
    console.log("hello from getReviews method");

    //create trail objects to make with a GET request
    let trailUri = "http://localhost:8080/api/v1/review/" + activeTrail;
    let params = {
        method: "get"
    };

    fetch(trailUri, params) //get response
        .then(function (response) {
            return response.json(); //ask for response to be converted to json
        })
        .then(function (data) { //receive the text when promise is complete
            printReviews(data);
        });

}

function printReviews(data){

    //access the list in our HTML
    let allReviews = document.getElementById("reviewGrid");
    allReviews.innerHTML = ""; //clear existing reviews

    for (let i = 0; i < data.length; i++) {
        let review = data[i];

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

        //add contents
        h5.innerText = "Rider: " + review.author;
        li.innerText = "Date Ridden: " + review.dateReviewed;
        li1.innerText = "Bike: " + review.bikeRidden;
        li2.innerText = "Weather when Ridden: " + review.weather;
        li3.innerText = "Trail Conditions: " + review.trailConditions;
        li4.innerText = "Was the Trail Rating Accurate? " + review.ratingValid;
        li5.innerText = "I would Recommend this Trail: " + review.wouldRecommend;

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

        //add the section to the list
        allReviews.appendChild(section);
    }

}
