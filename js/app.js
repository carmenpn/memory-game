/*
 * Create a list that holds all of your cards
 */

 const cardList = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", 
 "fa fa-cube", "fa fa-anchor", "fa fa-leaf", "fa fa-bicycle", "fa fa-diamond", "fa fa-bomb", 
 "fa fa-leaf", "fa fa-bomb", "fa fa-bolt", "fa fa-bicycle", "fa fa-paper-plane-o", "fa fa-cube"];

// ======================
// DECLARE VARIABLES
// ======================

let shuffleCards,
	openCards = [],
	matchCards = [];

// Score Panel Section

const scorePanel 	= document.getElementsByClassName("score-panel"),
	  starsPanel	= document.querySelector(".stars"),
	  stars 		= document.querySelectorAll(".stars li"),
	  moves 		= document.querySelector(".moves"),
	  timer 		= document.querySelector(".timer"),
	  restartButton = document.querySelector(".restart");

//Pop-up Window

const popUp 	   = document.querySelector(".pop-up"),
	  popUpContent = document.querySelector(".pop-up-content"),
	  closePopUp   = document.querySelector(".pop-up-close"),
	  timePopUp    = document.querySelector(".pop-up-time"),
	  movesPopUp   = document.querySelector(".pop-up-moves"),
	  starsPopUp   = document.querySelector(".pop-up-stars");

// Timer

let firstClick = false;
let min = 0,
	sec = 0,
	setTimer,
	timeNeeded,
	endingTime,
	startingTime;

// Card Deck

const deckOfCards = document.getElementsByClassName("deck"),
	  card 		  = document.getElementsByClassName("card");

//Counting moves

let countMoves 		= 0,
	memorizeCounts 	= 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

reset();

// Reset deck of cards and generate random cards
function reset() {
	shuffleCards = shuffle(cardList);
	for(let i = 0; i < shuffleCards.length; i++) {
		card[i].innerHTML = "";
		// Remove classes
		card[i].classList.remove("open", "show", "match");
		// Automatically generate HTML
		card[i].innerHTML = "<i class='" + shuffleCards[i] + "'></i>";
	}
	for (let i = 0; i < stars.length; i++) {
		stars[i].style.visibility = "visible";
	}
	resetTimer();
	firstClick = false;
	countMoves = 0;
	moves.textContent = "0";
	memorizeCounts = 0;
	openCards = [];
	matchCards = [];
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

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// ======================
// CARDS LISTENER
// ======================

for(let i = 0; i < card.length; i++) {
	card[i].addEventListener("click", function(evt) {
		displayCards(evt);
		addToOpenCards(evt);
		if(!firstClick) {
			firstClick = true;
			setTimer = setInterval(countingTime, 1000);
		}
		counterMoves();
		measureTime();
		displayPopUp();
	});
}

restartButton.addEventListener("click", reset);

// ======================
// GAME FUNCTIONS
// ======================

// Display the card's symbol
function displayCards(evt) {
	evt.target.classList.add("open", "show");
}

// Add the card to a *list* of "open" cards
function addToOpenCards(evt) {
	let clickedCard = evt.target.firstChild;
	openCards.push(clickedCard);
	cardsMatch(openCards);
	cardsDontMatch(openCards);
}

// If cards match
function cardsMatch(arr) {
	if(arr.length === 2 && arr[0].className === arr[1].className) {
		for(let i = 0; i < arr.length; i++) {
			arr[i].parentNode.classList.add("match", "card", "show");
		}
		matchCards.push(arr[0]);
		arr.splice(0, arr.length);
	}
}

// If cards don't match
function cardsDontMatch(arr) {
	if(arr.length === 2 && arr[0].className !== arr[1].className) {
		for(let i = 0; i < arr.length; i++) {
			arr[i].parentNode.classList.add("wrong", "card", "show");
		}
		setTimeout(function() {
			for(let i = 0; i < arr.length; i++) {
				arr[i].parentNode.classList.remove("wrong", "show", "open");
			}
			arr.splice(0, arr.length);
		}, 400);
	}
}

// ======================
// SCORE PANEL
// ======================

// Counting time for Set Interval
function countingTime() {
	sec++;
	if(sec < 10 && min < 10) {
		timer.textContent = "0" + min + ":" + "0" + sec;
	} else if(sec < 60 && min < 10) {
		timer.textContent = "0" + min + ":" + sec;
	} else {
		sec = 0;
		min++;
		sec++;
		if(min > 9) {
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

// Measure time start - end
function measureTime() {
	if(countMoves === 1) {
		startingTime = performance.now();
	}
	if(matchCards.length === 8) {
		endingTime = performance.now();
		resetTimer();
		moves.textContent = "0";
		if(countMoves > 34) {
			stars.item(0).style.visibility = "visible";
			stars.item(1).style.visibility = "visible";
		} else if(countMoves > 54) {
			stars.item(0).style.visibility = "visible";
			stars.item(1).style.visibility = "visible";
		}
	}
	timeNeeded = ((endingTime - startingTime) / 1000).toFixed(0);
}

// Counting the moves of the user
function counterMoves() {
	countMoves++;
	moves.textContent = countMoves;
	if(countMoves === 35) {
		stars.item(0).style.visibility = "hidden";
	} else if(countMoves === 55) {
		stars.item(1).style.visibility = "hidden";
	}
	memorizeCounts = countMoves;
}

// ======================
// POP UP WINDOW
// ======================

// Display pop-up if user wins
function displayPopUp() {
	if(matchCards.length === 8) {
		setTimeout(function() {
			popUp.style.display = "block";
			timePopUp.textContent = timeNeeded + " seconds";
			movesPopUp.textContent = memorizeCounts + " moves";
			starsPopUp.innerHTML = "";
			if(countMoves > 34) {
				starsPopUp.innerHTML = "<span><i class='fa fa-star'></i></span><span><i class='fa fa-star'></i></span>";
			} else if(countMoves > 54) {
				starsPopUp.innerHTML = "<span><i class='fa fa-star'></i></span>";
			} else {
				starsPopUp.innerHTML = "<span><i class='fa fa-star'></i></span><span><i class='fa fa-star'></i></span><span><i class='fa fa-star'></i></span>";
			}
			reset();
			closePopUp.addEventListener("click", function() {
				popUp.style.display = "none";
			});
		}, 300);
	}
}