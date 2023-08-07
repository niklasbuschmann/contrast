---
title: ""
permalink: "/blog/puzzle"
layout: page
---

<a href="/personal/blog" style="position: fixed; bottom: 20px; right: 20px; background-color: #6495ED; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">← Back</a>


## <span style="color: #89CFF0;">Make Bill Nye Proud: General Science Knowledge</span>

<button id="quiz-toggle-button" onclick="toggleQuizPopup()">Show Quiz</button>

<div id="quiz-popup" style="display: none;">
  <div class="quiz-container">
    <h2>General Science Knowledge Quiz</h2>
    <p>Select the correct answers by clicking on the options. You can start the quiz by pressing "Show Quiz"!</p>
    <div id="science-quiz">
      <!-- The quiz questions will be dynamically added here -->
    </div>
  </div>
</div>

<script>
  let quizPopupVisible = false;

  function toggleQuizPopup() {
    const quizPopup = document.getElementById("quiz-popup");
    const quizToggleButton = document.getElementById("quiz-toggle-button");

    quizPopupVisible = !quizPopupVisible;
    if (quizPopupVisible) {
      quizPopup.style.display = "flex";
      quizToggleButton.textContent = "Close Quiz";
    } else {
      quizPopup.style.display = "none";
      quizToggleButton.textContent = "Show Quiz";
    }
  }

  // Fetch the quiz data and create the questions
  fetch('https://opentdb.com/api.php?amount=5&category=17&difficulty=hard')
    .then(response => response.json())
    .then(data => {
      const questions = data.results;

      questions.forEach((question, index) => {
        const options = [...question.incorrect_answers, question.correct_answer];
        options.sort(() => Math.random() - 0.5); // Shuffle the options

        // Create a container for each question
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('quiz-question');
        questionContainer.innerHTML = `
          <p>${question.question}</p>
          <ul class="quiz-options">
            ${options.map((option, optionIndex) => `
              <li data-correct="${option === question.correct_answer ? 'true' : 'false'}">${option}</li>
            `).join('')}
          </ul>
          <p class="quiz-feedback"></p>
        `;

        // Attach click event to options for this question only
        const optionElements = questionContainer.querySelectorAll('.quiz-options li');
        optionElements.forEach(option => {
          option.addEventListener('click', function() {
            const correct = this.getAttribute('data-correct') === 'true';
            const feedback = this.parentElement.nextElementSibling;
            feedback.textContent = correct ? 'Correct!' : 'Incorrect!';
            feedback.style.color = correct ? 'green' : 'red';

            optionElements.forEach(elem => {
              elem.style.pointerEvents = 'none'; // Disable further clicks
              if (elem.getAttribute('data-correct') === 'true') {
                elem.style.color = 'green';
              }
            });
          });
        });

        // Append the question container to the quiz pop-up container
        const quizContainer = document.getElementById('science-quiz');
        quizContainer.appendChild(questionContainer);
      });
    })
    .catch(error => {
      console.error('Error fetching quiz:', error);
    });
</script>

<style>
  button {
    margin-bottom: 10px;
  }
  .quiz-options li {
    cursor: pointer;
    list-style-type: none;
    padding: 5px;
    border: 1px solid #ccc;
    margin: 5px 0;
  }
  #quiz-popup {
    background-color: rgba(0, 0, 0, 0.5); 
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); 
    max-width: 80%;
    overflow: auto;
  }
  .quiz-question {
    margin: 20px 0;
  }
  .quiz-feedback {
    margin-top: 10px;
  }
</style>

## <span style="color: #89CFF0;">Tetris Puzzles</span>

A surprisingly hard puzzle that may arise from PCO

[Play it yourself!](https://jstris.jezevec10.com/?play=6&map=51132)

![tetris puzzle 1](../assets/images/tetris_puzzle1.png){:width="300px" height="400px"}

<div>
  <button onclick="toggleSpoiler('tetrisSpoiler1')">Show/Hide Hint</button>
  <div id="tetrisSpoiler1" style="display:none;">
    Piece order: O L I Z S. Three of the pieces need to be spun in.
  </div>
</div>

## <span style="color: #89CFF0;">Chess Puzzles</span>

Difficulty: 2100

![chess puzzle 1](../assets/images/chess_puzzle1.png){:width="400px" height="400px"}

<div>
  <button onclick="toggleSpoiler('chessSpoiler1')">Show/Hide Solution</button>
  <div id="chessSpoiler1" style="display:none;">
    1... Bg4 2. Rxe8+ Rxe8 3. h3 Bxh5 4. Bd6 Nf8 5. Bxc5 Rb8 6. Bd5 Rb5 7. d4 Nd7 8. c4 Rb1+ 9. Kh2
  </div>
</div>

<script>
  function toggleSpoiler(id) {
    var spoilerElement = document.getElementById(id);
    if (spoilerElement.style.display === "none") {
      spoilerElement.style.display = "block";
    } else {
      spoilerElement.style.display = "none";
    }
  }
</script>


## <span style="color: #89CFF0;">Logic Puzzles</span>

WIP

## <span style="color: #89CFF0;">Visual Puzzles</span>

WIP

## <span style="color: #89CFF0;">Naruto Quiz</span>

WIP

## <span style="color: #89CFF0;">2 Truths 1 Lie</span>

I am currently trying to come up with lies
