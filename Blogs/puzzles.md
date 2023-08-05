---
title: "Puzzles"
permalink: "/blog/puzzle"
layout: page
---

## Logic Puzzles

<!-- Add your logic puzzles here -->

## Visual Puzzles

<!-- Add your visual puzzles here -->

## Anime Quiz

.

## General Science Knowledge Quiz

Make Bill nye proud.

<div id="science-quiz"></div>

<script>
  const quizContainer = document.getElementById('science-quiz');

  fetch('https://opentdb.com/api.php?amount=5&category=17')
    .then(response => response.json())
    .then(data => {
      const questions = data.results;
      let quizHTML = '';

      questions.forEach((question, index) => {
        const options = [...question.incorrect_answers, question.correct_answer];
        options.sort(() => Math.random() - 0.5); // Shuffle the options

        quizHTML += `
          <div class="quiz-question">
            <p>${question.question}</p>
            <ul class="quiz-options">
              ${options.map((option, optionIndex) => `
                <li data-correct="${option === question.correct_answer ? 'true' : 'false'}">${option}</li>
              `).join('')}
            </ul>
            <p class="quiz-feedback"></p>
          </div>
        `;
      });

      quizContainer.innerHTML = quizHTML;

      // Attach click event to options
      const optionElements = document.querySelectorAll('.quiz-options li');
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
    })
    .catch(error => {
      console.error('Error fetching quiz:', error);
    });
</script>

<style>
  .quiz-options li {
    cursor: pointer;
  }
</style>
