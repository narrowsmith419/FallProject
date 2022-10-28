//let trails = [];
let activeTrail;

//'Select a Trail' drop-down button
/*let submitButton = document.querySelector("#submitButton");
submitButton.addEventListener("click", buttonClick, false);*/
//submitButton.addEventListener("click", fetchTrail);

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
            //trailDropDown(data);
            trailNameDropDown(data);
            /*showTrails(data);*/
        });
};


/*function showTrails(data) {

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
}*/

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
        console.log(event.target.innerText);
        getTrailByName(event.target.innerText, "names");
    }
    //grab trail name clicked in drop down
    if (event.target.matches('.trailSystems')) {
        console.log(event.target.innerText)
        getTrailByName(event.target.innerText, "systems");
    }
    //grab trail name clicked in drop down
    if (event.target.matches('.trailDifficulties')) {
        console.log(event.target.innerText)
        getTrailByName(event.target.innerText, "ratings");
    }
    //if user clicks outside the modal
    if (event.target.matches('#editTrailModal')) {
        let modal = document.getElementById("editTrailModal");
        modal.style.display = "none";
    }
}


/**
 * dynamically generates trail names from trail API to populate drop down list
 * @param data Trail objects from /api/v1/trail
 */

/*function trailDropDown(data) {
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
}*/

function trailNameDropDown(data) {
    //set to prevent duplicate trail systems
    let systemSet = new Set();
    let difficultySet = new Set();

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
        if (!systemSet.has(trail.trailSystem)) { //if trailsystem doesn't already exist, add it to list
            systemSet.add(trail.trailSystem);
            let p2 = document.createElement("p");
            p2.innerText = trail.trailSystem;
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
    }
}

function buttonClick(event) {
    event.preventDefault();
}

function fetchTrail(data) {
    let trail = data[0];

    //access the list in our HTML
    let allReviews = document.getElementById("reviewGrid");
    allReviews.innerHTML = ""; //clear existing reviews

    //store active card trail for reviewGrid
    activeTrail = trail;

    //for bootstrap cards
    let trailCard = document.getElementById("trailCard");
    trailCard.innerHTML = ""; //clear existing card
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
    reviewButton.classList.add("btn", "btn-primary", "mt-auto", "ml-auto");

    //add button to delete trail
    let removeTrailButton = document.createElement("button");
    removeTrailButton.setAttribute('id', "removeTrailButton");
    removeTrailButton.setAttribute('type', "submit");
    removeTrailButton.innerHTML = "Delete Trail";
    removeTrailButton.classList.add("btn", "btn-danger", "mt-auto", "ml-auto");

    //add button to edit trail
    let EditTrailButton = document.createElement("button");
    EditTrailButton.setAttribute('id', "editTrailButton");
    EditTrailButton.setAttribute('type', "submit");
    EditTrailButton.innerHTML = "Edit Trail";
    EditTrailButton.classList.add("cardButton");

    //append to HTML
    trailCard.appendChild(cardImg);
    trailCard.appendChild(cardDiv);
    trailStats.appendChild(headerDiv);
    trailStats.appendChild(statsUl);
    trailStats.appendChild(EditTrailButton);
    trailStats.appendChild(reviewButton);
    trailStats.appendChild(removeTrailButton);

    let img = document.getElementById("cardImage");

    singleTrail(trail);
    img.src = trail.imageLink;
    img.setAttribute('alt', trail.name + " trail at the " + trail.trailSystem + " bike park");
}

function singleTrail(data) {

    //access the list in our HTML
    let trailResult = document.getElementById("trail-result");
    let trailStats = document.getElementById("trail-stats");
    trailResult.innerHTML = ""; //clear existing trail
    trailStats.innerHTML = "";

    let trail = data;

    //create all elements
    let section = document.createElement("section");
    /*let h2 = document.createElement("h2");
    let ul = document.createElement("ul")
    let li = document.createElement("li");
    let li1 = document.createElement("li");
    let li2 = document.createElement("li");
    let li3 = document.createElement("li");
    let li4 = document.createElement("li");
    let li5 = document.createElement("li");*/

    //trail stats card
    let statsLi = document.createElement("li");
    let statsLi1 = document.createElement("li");
    let statsLi2 = document.createElement("li");
    let statsLi3 = document.createElement("li");
    let statsLi4 = document.createElement("li");
    let statsLi5 = document.createElement("li");
    const listItems = [statsLi, statsLi1, statsLi2, statsLi3, statsLi4, statsLi5];

    //add contents
    /* h2.innerText = "Trail: " + trail.name;
     li.innerText = "Trail System: " + trail.trailSystem;
     li1.innerText = "State: " + trail.state;
     li2.innerText = "Difficulty: " + trail.difficulty;
     li3.innerText = "Length: " + trail.length + "ft";
     li4.innerText = "Elevation: " + trail.elevation + "ft";
     li5.innerText = "BiDirectional: " + trail.multiDirectional;*/

    statsLi.innerText = "Trail System: " + trail.trailSystem;
    statsLi1.innerText = "State: " + trail.state;
    statsLi2.innerText = "Difficulty: " + trail.difficulty;
    statsLi3.innerText = "Length: " + trail.length + "ft";
    statsLi4.innerText = "Elevation: " + trail.elevation + "ft";
    statsLi5.innerText = "BiDirectional: " + trail.multiDirectional;

    //construct list
    /*ul.appendChild(li);
    ul.appendChild(li1);
    ul.appendChild(li2);
    ul.appendChild(li3);
    ul.appendChild(li4);
    ul.appendChild(li5);*/

    //construct stats list
    listItems.forEach(item => item.classList.add("list-group-item"));
    listItems.forEach(item => trailStats.appendChild(item));

    //connect them
    /*section.appendChild(h2);
    section.appendChild(ul);*/

    //add the section to the list
    trailResult.appendChild(section);

    //'Edit Trails' button
    let editTrailButton = document.querySelector("#editTrailButton");
    editTrailButton.addEventListener("click", editTrailModal);

    //'Get all Reviews' button
    let getReviewButton = document.querySelector("#getReviewButton");
    getReviewButton.addEventListener("click", getReviews);

    //'Delete Trail' button
    let removeTrailButton = document.querySelector("#removeTrailButton");
    removeTrailButton.addEventListener("click", removeTrail);
}

function getReviews(event) {
    event.preventDefault();

    let trailUri = "http://localhost:8080/api/v1/review/" + activeTrail.name;
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
        .then(function (response) {
            console.log("SUCCESSFULLY DELETED");
        })

}

//show modal
function editTrailModal() {

    let formModal = document.getElementById("editTrailForm"); //grab html

    //create all form elements
    let form = document.createElement("form");
    //labels & inputs //TODO: create these elements in a loop
    let labelName = document.createElement("label");
    let inputName = document.createElement("input");
    let labelSystem = document.createElement("label")
    let inputSystem = document.createElement("input");
    let labelState = document.createElement("label");
    let inputState = document.createElement("input");
    let labelElevation = document.createElement("label");
    let inputElevation = document.createElement("input");
    let labelLength = document.createElement("label");
    let inputLength = document.createElement("input");
    let labelDirection = document.createElement("label");
    let labelDirection1 = document.createElement("label");
    let inputDirection1 = document.createElement("input");
    let labelDirection2 = document.createElement("label");
    let inputDirection2 = document.createElement("input");
    let labelDifficulty = document.createElement("label");
    let labelDifficulty1 = document.createElement("label");
    let inputDifficulty1 = document.createElement("input");
    let labelDifficulty2 = document.createElement("label");
    let inputDifficulty2 = document.createElement("input");
    let labelDifficulty3 = document.createElement("label");
    let inputDifficulty3 = document.createElement("input");
    let labelDifficulty4 = document.createElement("label");
    let inputDifficulty4 = document.createElement("input");
    //radio div
    let difficultyDiv = document.createElement("div");
    let directionDiv = document.createElement("div");

    //add contents
    /* h2.innerText = "Trail: " + trail.name; */
    labelName.innerText = "Trail Name: ";
    labelName.setAttribute("for", "name");
    inputName.setAttribute("type", "text");
    inputName.setAttribute("name", "name");
    inputName.setAttribute("id", "name");
    inputName.setAttribute("value", activeTrail.name);
    labelSystem.innerText = "Trail System: ";
    labelSystem.setAttribute("for", "system");
    inputSystem.setAttribute("type", "text");
    inputSystem.setAttribute("name", "system");
    inputSystem.setAttribute("id", "system");
    inputSystem.setAttribute("value", activeTrail.trailSystem);
    labelState.innerText = "State: ";
    labelState.setAttribute("for", "state");
    inputState.setAttribute("type", "text");
    inputState.setAttribute("name", "state");
    inputState.setAttribute("id", "state");
    inputState.setAttribute("value", activeTrail.state);
    labelElevation.innerText = "Elevation: ";
    labelElevation.setAttribute("for", "elevation");
    inputElevation.setAttribute("type", "text");
    inputElevation.setAttribute("name", "elevation");
    inputElevation.setAttribute("id", "elevation");
    inputElevation.setAttribute("value", activeTrail.elevation);
    labelLength.innerText = "Length: ";
    labelLength.setAttribute("for", "length");
    inputLength.setAttribute("type", "text");
    inputLength.setAttribute("name", "length");
    inputLength.setAttribute("id", "length");
    inputLength.setAttribute("value", activeTrail.length);
    labelDirection.innerText = "Direction: ";
    //add label direction 1
    inputDirection1.setAttribute("name","direction");
    inputDirection1.setAttribute("value","true");
    inputDirection1.setAttribute("type","radio");
    //add label direction 2
    inputDirection2.setAttribute("name","direction");
    inputDirection2.setAttribute("value","false");
    inputDirection2.setAttribute("type","radio");

    labelDifficulty.innerText = "Difficulty Rating: ";
    //add label difficuly 1
    inputDifficulty1.setAttribute("name","difficulty");
    inputDifficulty1.setAttribute("value","GREEN");
    inputDifficulty1.setAttribute("type","radio");
    //add label difficulty 2
    inputDifficulty2.setAttribute("name","difficulty");
    inputDifficulty2.setAttribute("value","BLUE");
    inputDifficulty2.setAttribute("type","radio");
    //add label difficulty 3
    inputDifficulty3.setAttribute("name","difficulty");
    inputDifficulty3.setAttribute("value","BLACK");
    inputDifficulty3.setAttribute("type","radio");
    //add label difficulty 4
    inputDifficulty4.setAttribute("name","difficulty");
    inputDifficulty4.setAttribute("value","DOUBLE_BLACK");
    inputDifficulty4.setAttribute("type","radio");



    //construct radio divs
    difficultyDiv.appendChild(labelDifficulty);
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
    labelDirection1.appendChild(inputDirection1);
    directionDiv.appendChild(labelDirection1);
    labelDirection2.appendChild(inputDirection2);
    directionDiv.appendChild(labelDirection2);

    form.appendChild(labelName);
    form.appendChild(inputName);
    form.appendChild(labelSystem);
    form.appendChild(inputSystem);
    form.appendChild(labelElevation);
    form.appendChild(inputElevation);
    form.appendChild(labelLength);
    form.appendChild(inputLength);
    form.appendChild(directionDiv);
    form.appendChild(difficultyDiv);

    //add to HTML
    formModal.appendChild(form);

    let modal = document.getElementById("editTrailModal");
    modal.style.display = "block";

}

//close modal
function closeModal() {

    let modal = document.getElementById("editTrailModal");
    modal.style.display = "none";
}

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

function fetchTrailList(data, type) {

//clear existing trail card (if there is one) and reviews
    let trailCard = document.getElementById("trailCard");
    let trailStats = document.getElementById("trailStats");
    let allReviews = document.getElementById("reviewGrid");
    allReviews.innerHTML = ""; //clear existing reviews
    trailCard.innerHTML = "";
    trailStats.innerHTML = "";
    trailCard.classList.add("card");
    trailStats.classList.remove("card");

    let div = document.createElement("div");
    div.classList.add("trailListBySystem", "card-header");

    try {
        if (type === "systems") {
            div.innerText = 'Trails at "' + data[0].trailSystem + '" trail system';
        }
    } catch (e) {
        trailCard.innerHTML = "There are no trails at this system :(";
    }

    if (type === "ratings") {
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

function printReviews(data) {

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
