---
layout: page
title: TestPage
permalink: /testpage/
---

<div id="wordle-container">
  <div id="guesses"></div>
  <input type="text" id="guess-input" placeholder="Enter your guess" maxlength="5" />
  <button onclick="makeGuess()">Guess</button>
</div>

<script>
  const wordToGuess = "apple"; // You can set this dynamically if you wish
  const maxGuesses = 6;
  let guesses = 0;

  function makeGuess() {
    const guessInput = document.getElementById("guess-input");
    const guess = guessInput.value;
    guessInput.value = "";
    
    const result = evaluateGuess(guess, wordToGuess);
    const guessesDiv = document.getElementById("guesses");
    guessesDiv.innerHTML += `<div>${guess}: ${result}</div>`;

    guesses++;
    if (guess === wordToGuess || guesses >= maxGuesses) {
      alert(guess === wordToGuess ? "You won!" : "You lost!");
      location.reload(); // Reload to restart the game
    }
  }

  function evaluateGuess(guess, word) {
    // Implement your logic for evaluating a guess here.
    // You can return a string with the proper clues for the Wordle game.
  }
</script>
