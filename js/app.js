// ======================
// Declare card variable
// ======================

 const cardList = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", 
 "fa fa-cube", "fa fa-anchor", "fa fa-leaf", "fa fa-bicycle", "fa fa-diamond", "fa fa-bomb", 
 "fa fa-leaf", "fa fa-bomb", "fa fa-bolt", "fa fa-bicycle", "fa fa-paper-plane-o", "fa fa-cube"];

// ======================
// Declare variables
// ======================

let shuffleCards,
	openCards 	 = [],
	cardsMatched = [];

// Score Panel Section

const stars 		= document.querySelectorAll(".stars li"),
	  moves 		= document.querySelector(".moves"),
	  timer 		= document.querySelector(".timer"),
	  restartButton = document.querySelector(".restart");

//Pop-up Window

const popUp 	   = document.querySelector(".pop-up"),
	  closePopUp   = document.querySelector(".pop-up-close"),
	  timePopUp    = document.querySelector(".pop-up-time"),
	  movesPopUp   = document.querySelector(".pop-up-moves"),
	  starsPopUp   = document.querySelector(".pop-up-stars");

// Timer

let firstClickOnTimer = false,
 	min = 0,
	sec = 0,
	setTimer,
	timeNeeded,
	endingTime,
	startingTime;

// Card Deck

const card = document.getElementsByClassName("card");

//Counting moves and memorizing moves for Pop-up

let countMoves 		= 0,
	memorizeCounts 	= 0;

// ======================
// Reset function
// ======================

reset();

// Reset deck of cards and generate random cards
function reset() {
	shuffleCards = shuffle(cardList);
	for (let i = 0; i < shuffleCards.length; i++) {
		card[i].innerHTML = "";
		// Remove classes
		card[i].classList.remove("open", "show", "match", "opened", "wrong");
		// Automatically generate HTML
		card[i].innerHTML = "<i class='" + shuffleCards[i] + "'></i>";
	}
	for (let i = 0; i < stars.length; i++) {
		stars[i].style.visibility = "visible";
	}
	resetTimer();
	firstClickOnTimer = false;
	countMoves = 0;
	moves.textContent = "0";
	memorizeCounts = 0;
	openCards = [];
	cardsMatched = [];
	timeNeeded = 0;
}

 // Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// ======================
// Event listeners
// ======================

// For each card
for (let i = 0; i < card.length; i++) {
	card[i].addEventListener("click", clickCard);
}

// For restart button
restartButton.addEventListener("click", reset);

// ======================
// Game functions
// ======================

// The main click function for cards
function clickCard(evt) {
	if (evt.target.nodeName === "LI" && !evt.target.classList.contains("opened")) {
		displayCards(evt);
		addToOpenCards(evt);
		counterMoves();
	}
	if (!firstClickOnTimer) {
		firstClickOnTimer = true;
		setTimer = setInterval(countingTime, 1000);
	}
	measureTime();
	displayPopUp();
}

// Display the card's symbol after first click
function displayCards(evt) {
	if (openCards.length < 2) {
		evt.target.classList.add("open", "show");
	}
}

// Add the card to a *list* of "open" cards and add a class of 'opened'
function addToOpenCards(evt) {
	openCards.push(evt.target.firstChild);
	evt.target.classList.add("opened");		
	checkIfcardsMatch(openCards);
}

// Check if cards match - compare classes
function checkIfcardsMatch(arr) {
	if (arr.length === 2) {
		if (arr[0].classList.value === arr[1].classList.value) {
			cardsMatch(arr);
		} else {
			cardsDontMatch(arr);
		}
	}
}

function cardsMatch(arr) {
	for (let i = 0; i < arr.length; i++) {
		arr[i].parentNode.classList.add("match", "card", "show", "opened");
		cardsMatched.push(arr[i]);
	}
	arr.splice(0, arr.length);
}

function cardsDontMatch(arr) {
	for (let i = 0; i < arr.length; i++) {
		arr[i].parentNode.classList.add("wrong", "card", "show", "open");
	}
	setTimeout(function() {
		for (let i = 0; i < arr.length; i++) {
			arr[i].parentNode.classList.remove("wrong", "show", "open", "opened");
		}
		arr.splice(0, arr.length);
	}, 400);
}

// ======================
// Score panel
// ======================

// Counting time for Set Interval
function countingTime() {
	sec++;
	if (sec < 10 && min < 10) {
		timer.textContent = "0" + min + ":" + "0" + sec;
	} else if (sec < 60 && min < 10) {
		timer.textContent = "0" + min + ":" + sec;
	} else {
		sec = 0;
		min++;
		sec++;
		if (min > 9) {
			timer.textContent = min + ":" + "0" + sec;
		}
	}
}

// Reset timer
function resetTimer() {
	clearInterval(setTimer);
	sec = 0;
	min = 0;
	timer.textContent = "00:00";
}

// Measure time from the beginning of the game till the end
function measureTime() {
	if (countMoves === 1) {
		startingTime = performance.now();
	}
	if (cardsMatched.length === 16) {
		endingTime = performance.now();
		resetTimer();
		moves.textContent = "0";
		if (countMoves > 34) {
			stars.item(0).style.visibility = "visible";
			stars.item(1).style.visibility = "visible";
		} else if (countMoves > 54) {
			stars.item(0).style.visibility = "visible";
			stars.item(1).style.visibility = "visible";
		}
	}
	// Time needed to finish the game
	timeNeeded = ((endingTime - startingTime) / 1000).toFixed(0);
}

// Counting the moves of the user
function counterMoves() {
	countMoves++;
	moves.textContent = countMoves;
	// Display number of stars depending on number of moves
	if (countMoves === 35) {
		stars.item(0).style.visibility = "hidden";
	} else if (countMoves === 55) {
		stars.item(1).style.visibility = "hidden";
	}
	memorizeCounts = countMoves;
}

// ======================
// Pop-up window
// ======================

// Display pop-up if user wins
function displayPopUp() {
	if (cardsMatched.length === 16) {
		setTimeout(function() {
			popUp.style.display = "block";
			timePopUp.textContent = timeNeeded + " seconds";
			movesPopUp.textContent = memorizeCounts + " moves";
			starsPopUp.innerHTML = "";
			displayStarsPopUp();
			reset();
			popUpX();
		}, 200);
	}
}

// Stars in pop-up
function displayStarsPopUp() {
	if (countMoves < 35) {
		starsPopUp.innerHTML = "<span><i class='fa fa-star'></i></span><span><i class='fa fa-star'></i></span><span><i class='fa fa-star'></i></span>";
	} else if (countMoves < 55) {
		starsPopUp.innerHTML = "<span><i class='fa fa-star'></i></span><span><i class='fa fa-star'></i></span>";
	} else {
		starsPopUp.innerHTML = "<span><i class='fa fa-star'></i></span>";
	}
}

// Close pop-up
function popUpX() {
	closePopUp.addEventListener("click", function() {
		popUp.style.display = "none";
	});
}