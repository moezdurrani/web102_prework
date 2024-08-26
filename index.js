/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    // Loop over each item in the games array
    for (let i = 0; i < games.length; i++) {
        const game = games[i];

        // Create a new div element for the game card
        const gameCard = document.createElement("div");

        // Add the class 'game-card' to the div's class list
        gameCard.classList.add("game-card");

        // Set the inner HTML of the game card using a template literal
        gameCard.innerHTML = `
            <img src="${game.img}" alt="${game.name}" class="game-img"/>
            <h3>${game.name}</h3>
            <p>${game.description}</p>
            <p>Pledged: $${game.pledged.toLocaleString()}</p>
            <p>Goal: $${game.goal.toLocaleString()}</p>
        `;

        // Step 4: Append the new game card to the games-container
        const gamesContainer = document.getElementById("games-container");
        gamesContainer.appendChild(gameCard);
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
// After declaring the addGamesToPage function
addGamesToPage(GAMES_JSON);


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// Function to animate the counter values in the stats cards
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Function to initialize and display the statistics at the top of the page
function displayStatisticsOnHover() {
    // Calculate the total contributions, amount raised, and number of games
    const totalContributions = GAMES_JSON.reduce((total, game) => total + game.backers, 0);
    const totalRaised = GAMES_JSON.reduce((total, game) => total + game.pledged, 0);
    const totalGames = GAMES_JSON.length;

    // Grab the elements for the stats cards
    const contributionsCard = document.getElementById("num-contributions");
    const raisedCard = document.getElementById("total-raised");
    const gamesCard = document.getElementById("num-games");

    // Add hover event listeners to each card to trigger the animation
    document.querySelector(".stats-card:nth-child(1)").addEventListener('mouseover', () => {
        animateValue(contributionsCard, 0, totalContributions, 1500);
    });

    document.querySelector(".stats-card:nth-child(2)").addEventListener('mouseover', () => {
        animateValue(raisedCard, 0, totalRaised, 1500);
    });

    document.querySelector(".stats-card:nth-child(3)").addEventListener('mouseover', () => {
        animateValue(gamesCard, 0, totalGames, 1000);
    });
}

// Ensure the DOM is fully loaded before executing any DOM manipulation
window.addEventListener('load', () => {
    displayStatisticsOnHover();
});






// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((total, game) => {
    return total + game.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${totalContributions.toLocaleString()}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
// const totalRaised = GAMES_JSON.reduce((total, game) => {
//     return total + game.pledged;
// }, 0);
const totalRaised = GAMES_JSON.reduce((total, game) => total + game.pledged, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `$${totalRaised.toLocaleString()}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = `${GAMES_JSON.length}`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // Use filter() to get a list of games that have not yet met their goal
    const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);

    // Log the number of unfunded games for the secret key
    // alert(unfundedGames.length);

    // Use the addGamesToPage function to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
}

function filterFundedOnly() {
    // Clear the existing games from the page
    deleteChildElements(gamesContainer);

    // Use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);

    // Log the number of funded games for the secret key
    // alert(fundedGames.length);

    // Use the addGamesToPage function to add the funded games to the DOM
    addGamesToPage(fundedGames);
}
filterFundedOnly()


// show all games
function showAllGames() {
    // Clear the existing games from the page
    deleteChildElements(gamesContainer);

    // Use the addGamesToPage function to add all the games to the DOM
    addGamesToPage(GAMES_JSON);
}


// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGamesCount = GAMES_JSON.filter(game => game.pledged < game.goal).length;

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${totalRaised.toLocaleString()} has been raised for ${GAMES_JSON.length} games. 
Currently, ${unfundedGamesCount} game${unfundedGamesCount === 1 ? '' : 's'} remain unfunded. 
We need your help to fund these amazing games!`;
// alert(displayStr);

// create a new DOM element containing the template string and append it to the description container
const newParagraph = document.createElement("p");
newParagraph.innerHTML = displayStr;
descriptionContainer.appendChild(newParagraph);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */




// const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
//     return item2.pledged - item1.pledged;
// });
const sortedGames = [...GAMES_JSON].sort((a, b) => b.pledged - a.pledged);

// use destructuring and the spread operator to grab the first and second games
const [mostFundedGame, secondMostFundedGame] = sortedGames;

const mostFundedElement = document.createElement("p");
mostFundedElement.innerText = mostFundedGame.name;

const firstGameContainer = document.getElementById("first-game");
firstGameContainer.appendChild(mostFundedElement);

const secondMostFundedElement = document.createElement("p");
secondMostFundedElement.innerText = secondMostFundedGame.name;

const secondGameContainer = document.getElementById("second-game");
secondGameContainer.appendChild(secondMostFundedElement);

// alert(mostFundedGame.name);
// alert(mostFundedGame.name.split(" ")[0]);
// alert(secondMostFundedGame.name);
// alert(secondMostFundedGame.name.split(" ")[0]);



// create a new element to hold the name of the top pledge game, then append it to the correct element

// do the same for the runner up item
