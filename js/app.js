'use strict';

/* TO-DO: create a counter object */
// move counter
const moveCounter = function() {
  let counter = 0;
  return function() {
    counter += 1;
    return {
      reset: function() {
        counter = 0;
      },
      value: function() {
        return counter;
      }
    };
  };
}();

// click counter
const clickCounter = function() {
 let counter = 0;
 return function() {
   counter += 1;
   return {
     reset: function() {
       counter = 0;
     },
     value: function() {
       return counter;
     }
   };
 };
}();

const startTimer = function() {
  let startTime = new Date();
  return {
    reset: function() {
      startTime = new Date();
    },
    value: function() {
      return startTime;
    }
  };
}();

/* TO-DO: create an array object to use for both arrays */

// Create array function for matches
const cardMatches = function() {
let matchedCards = [];
  return {
    reset: function() {
      matchedCards = [];
    },
    value: function() {
      return matchedCards;
    },
    length: function() {
      return matchedCards.length;
    },
    push: function() {
      matchedCards.push(1);
    }
  };
}();

// create array function for opened cards
const openCards = function() {
  let openedCards = [];
  return {
    reset: function() {
      openedCards = [];
    },
    value: function() {
      return openedCards;
    },
    length: function() {
      return openedCards.length;
    },
    push: function(e) {
      openedCards.push(e);
    }
  };
}();


// Create the deck and cards, return values to start the game
function cardArray() {
  const deck = document.querySelector('.deck');
  const card = document.getElementsByClassName('card');
  const cards = [...card];
  return [deck, cards];
}

// Create an array for star
function starsArray() {
  const allStar = document.getElementsByClassName('fa fa-star');
  const allStars = [...allStar];
  const modalStar = document.getElementsByClassName('stats fa fa-star');
  const modalStars = [...modalStar];
  return [allStars, modalStars];
}

// function modal() {
//
//
//
// }
startGame();

/* The startGame() function starts the game
* The function creates a new deck
* Then assigns a new variable that returns the shuffled cards
* A new deck is created from the shuffled cards
*/

function startGame() {
  // create the deck and cards, then shuffle
  const createDeck = cardArray();
  const deck = createDeck[0];
  const cards = createDeck[1];
  const cardShuffle = shuffle(cards);
  const allStars = starsArray()[0];

  for (let i = 0; i < cardShuffle.length; i++) {
    deck.appendChild(cardShuffle[i]);
  }

  // set moves and stars
  document.querySelector('.moves').innerHTML = '0 Moves';
  for (let i = 0; i < 3; i++) {
    allStars[i].style.display = 'inline-block';
  }

  // listen for card clicks and reset clicks
  eventListeners();

}

/* Shuffle function from http://stackoverflow.com/a/2450976 */
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
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

/*
* Event Listeners for when users click cards or the reset button
*/
 function eventListeners() {
   const createDeck = cardArray();
   const cards = createDeck[1];
   const resetBtn = document.getElementsByClassName('reset-me');

   let startTime = startTimer.value();

   for (let i = 0; i < cards.length; i++) {
     cards[i].addEventListener('click', matchCards, false);
     for (let i =0; i < resetBtn.length; i++) {
       resetBtn[i].addEventListener('click', gameReset, false);
     }
   }
   document.getElementById('close').addEventListener('click', closeModal, false);

}

/*
* Create an array for card selection, flip card, check for match, and track moves and score
*/
function matchCards() {

  let clicks = clickCounter();
  let numMoves;
  let matchedNum;
  let visibleCard;
  let cardSelection = this;
  openCards.push(this);

  //prevent flipping on click for third card
  if (openCards.length() <= 2) {
    visibleCard = flipCard(cardSelection);
  }

  // If two cards are flipped, start move counter, keep score in score panel, and check for match.
  if (openCards.length() === 2) {
    numMoves = moveCounter();
    scorePanel(numMoves.value());

    // If cards match, send cards to the match() function to toggle CSS and game completeness.  If cards don't match, reset the cards
    if ((visibleCard == true ) && (openCards.value()[0].firstElementChild.className == openCards.value()[1].firstElementChild.className)) {
      match(numMoves.value());
      openCards.reset();
    } else {
      const resetTimer = setTimeout(reset, 500);
    }
  }

}

// Flip the card by toggling CSS
function flipCard(e) {
  let cardSelection = e;
  let visibleCard;

  // toggle the classes
  visibleCard = cardSelection.classList.toggle('open');
  visibleCard = cardSelection.classList.toggle('show');
  return visibleCard;

}

/*
* If cards match, toggle CSS for matching cards
* If the number of matches equals 8, mark all cards as complete, stop timer, and display modal
*/
function match(e) {
  const createDeck = cardArray();
  const cards = createDeck[1];

  let numMoves = e;
  let numMatches;
  cardMatches.push();

  openCards.value()[0].classList.toggle('match');
  openCards.value()[1].classList.toggle('match');
  numMatches = cardMatches.length();

  if (numMatches == 8) {
    for (var i = 0; i < cards.length; i++) {
        cards[i].classList.toggle('complete');
    }
    let endTime = endTimer();
    let finalMoves = numMoves;
    const showStats = setTimeout(showModal, 300, finalMoves, endTime);
  }
  openCards.reset();

}

// Reset flipped cards if cards don't match
function reset() {
  const cls = ['show', 'open'];

  for (var i = 0; i < openCards.length(); i++) {
    openCards.value()[i].classList.remove(...cls);
  }
  openCards.reset();

}

/*
* Adapted from: https://stackoverflow.com/questions/41632942/how-to-measure-time-elapsed-on-javascript
* Only the endtimer() function remains similar.
*/


function endTimer() {
  let endTime = new Date();
  let timeDiff = endTime - startTimer.value();
  timeDiff /= 1000;
  let seconds = Math.round(timeDiff);
  return seconds;

}

/*
* Star counters and displays
* scorePanel() - Show number of moves in the score panel while playing
* stars() - Calculate number of stars based on number of moves
* todo - It would be nice to have this be a function of both time and Moves
*/
function scorePanel(e) {
  const allStars = starsArray()[0];
  let numMoves = e;
  let numStars = stars(numMoves);


  if (numMoves === 1) {
    document.querySelector('.moves').innerHTML = numMoves + ' Move';
  } else {
    document.querySelector('.moves').innerHTML = numMoves + ' Moves';
  }


// Can't have zero stars, so display 'none' only changed on two
  if (numStars == 1) {
    for (var i = 0; i <= numStars; i++) {
      allStars[i].style.display = 'none';
    }
  } else if (numStars == 2) {
    for (var i = 1; i < numStars; i++) {
    allStars[i].style.display = 'none';
    }
  }

}

function stars(e) {
  let numMoves = e;
  let numStars;

  if (numMoves <= 11) {
    numStars = 3;
  } else if (numMoves > 11 && numMoves <= 18) {
    numStars = 2;
  } else {
    numStars = 1;
  }
  return numStars;

}

/*
* Modal display functions
* showModal() - Display modal including moves, time, and number of stars
* closeModal() - Close modal without resetting game
*/
function showModal(e, f) {
  const modal = document.querySelector('.modal');
  const modalStars = starsArray()[1];
  let numStars = stars(e);
  let numMoves = e;
  let seconds = f;
  modal.style.display ='block';

  //get ids for modal heading display
  document.getElementById('modal-moves').innerHTML = numMoves;
  document.getElementById('time').innerHTML = seconds;

  //get classes for modal display
  document.querySelector('.moves-stat').innerHTML = numMoves;
  document.querySelector('.time-stat').innerHTML = seconds + ' seconds';

  for (var i = 0; i < numStars; i++) {
    modalStars[i].style.display = 'inline-block';
  }

}

function closeModal() {
  const modal = document.querySelector('.modal');
  modal.style.display ='none';

}

/*
* Game reset
* Reset CSS class values, variables and display
*/
function gameReset() {
  const createDeck = cardArray();
  const deck = createDeck[0];
  const cards = createDeck[1];

  const cls = ['complete', 'open', 'show', 'match'];
  const modalStars = starsArray()[1];

  closeModal();

  let resetMoves;
  let resetClicks;

  openCards.reset();
  cardMatches.reset();
  startTimer.reset();

  resetMoves = moveCounter().reset();

  resetClicks = clickCounter().reset();

// reset display values
  for (var i = 0; i < cards.length; i++) {
    cards[i].classList.remove(...cls);
  }

  for (var i = 0; i < modalStars.length; i++) {
    modalStars[i].style.display = 'none';
  }

  // Restart game
  const restartGame = setTimeout(startGame, 250);

}
