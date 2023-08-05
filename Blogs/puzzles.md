---
title: "Puzzles"
permalink: "/blog/puzzle"
layout: page
---

## Logic Puzzles

WIP

## Visual Puzzles

WIP

## Anime Quiz

WIP

## Make Bill Nye Proud: General Science Knowledge

<div id="science-quiz">
  <!-- The quiz questions will be dynamically added here -->
</div>

<script>
  const quizContainer = document.getElementById('science-quiz');

  fetch('https://opentdb.com/api.php?amount=5&category=17')
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

        // Append the question container to the main quiz container
        quizContainer.appendChild(questionContainer);
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
