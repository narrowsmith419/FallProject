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
    label.setAttribute("class", "h3 text-dark");
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

/**
 * drop down Trail selector
 * @type {*[]}
 */
let trails = [];
let activeTrail;
let count = 0;
let submitButton = document.querySelector("#submitButton");
submitButton.addEventListener("click", buttonClick, false);
submitButton.addEventListener("click", fetchTrail);

function buttonClick(event) {
    event.preventDefault();
}

function fetchTrail() {

    //get value from dropdown
    let trailName = document.getElementById("trailNameDrop").value;

    //store active card trail for reviewGrid
    activeTrail = trailName;

    //for bootstrap card
    let trailCard = document.getElementById("trailCard");

    //if fresh page load then create a card
    if(count === 0) {
        trailCard.classList.add("card");
        let cardImg = document.createElement("img");
        cardImg.classList.add("card-img-top");
        cardImg.setAttribute('id', 'cardImage');
        let cardDiv = document.createElement("div");
        cardDiv.setAttribute('id', "trail-result");
        cardDiv.classList.add("card-body");
        trailCard.appendChild(cardImg);
        trailCard.appendChild(cardDiv);
    }

    let img = document.getElementById("cardImage");

    for (let i = 0; i < trails.length; i++) {
        let trail = trails[i];
        console.log(trail.name);
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
}

function getReviews() {

    //access the list in our HTML
    let allReviews = document.getElementById("reviewGrid");
    allReviews.innerHTML = ""; //clear existing reviews

    for (let i = 0; i < trails.length; i++) {
        let trail = trails[i];
        if (trail.name === activeTrail) {

            //create all elements
            let section = document.createElement("section");
            let h4 = document.createElement("h4");
            let ul = document.createElement("ul")
            let li = document.createElement("li");
            let li1 = document.createElement("li");
            let li2 = document.createElement("li");
            let li3 = document.createElement("li");
            let li4 = document.createElement("li");
            let li5 = document.createElement("li");

            //add contents
            h4.innerText = "Trail: " + trail.name;
            li.innerText = "Rider: " + trail.trailSystem;
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
            allReviews.appendChild(section);




        }
    }



}
