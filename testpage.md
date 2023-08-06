---
layout: page
title: TestPage
permalink: /testpage/
---

<style>
  #wordle-container {
    font-family: Arial, sans-serif;
    max-width: 300px;
    margin: auto;
  }
  #guesses div {
    display: grid;
    grid-template-columns: repeat(5, 30px);
    gap: 5px;
  }
  .guess-cell {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #000;
    background-color: #f2f2f2;
  }
  .correct {
    background-color: green;
  }
  .present {
    background-color: yellow;
  }
</style>

<div id="wordle-container">
  <div id="guesses"></div>
  <input type="text" id="guess-input" placeholder="Enter your guess" maxlength="5" />
  <button onclick="makeGuess()">Guess</button>
</div>

<script>
  // Randomly pick a word from the list for the player to guess
  const wordsToGuess = ["apple", "grape", "water", "tiger", "plant"];
  const wordToGuess = wordsToGuess[Math.floor(Math.random() * wordsToGuess.length)];
  const maxGuesses = 6;
  let guesses = 0;

  function makeGuess() {
    const guessInput = document.getElementById("guess-input");
    const guess = guessInput.value.toLowerCase();
    guessInput.value = "";
    
    if (guess.length !== 5) {
      alert('Please enter a 5-letter word.');
      return;
    }
    
    const result = evaluateGuess(guess, wordToGuess);
    const guessesDiv = document.getElementById("guesses");
    
    const guessRow = document.createElement("div");
    for (const letter of result) {
      const cell = document.createElement("div");
      cell.className = `guess-cell ${letter.status}`;
      cell.textContent = letter.char;
      guessRow.appendChild(cell);
    }
    guessesDiv.appendChild(guessRow);

    guesses++;
    if (guess === wordToGuess || guesses >= maxGuesses) {
      setTimeout(() => {
        alert(guess === wordToGuess ? "You won!" : `You lost! The word was ${wordToGuess}`);
        location.reload(); // Reload to restart the game
      }, 100);
    }
  }

  function evaluateGuess(guess, word) {
    const result = [];
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === word[i]) {
        result.push({ char: guess[i], status: "correct" });
      } else if (word.includes(guess[i])) {
        result.push({ char: guess[i], status: "present" });
      } else {
        result.push({ char: guess[i], status: "" });
      }
    }
    return result;
  }
</script>
