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

Test your anime knowledge with this quiz:

<div id="anime-quiz"></div>

<script>
  const quizContainer = document.getElementById('anime-quiz');

  fetch('https://opentdb.com/api.php?amount=5&category=17')
    .then(response => response.json())
    .then(data => {
      const questions = data.results;
      let quizHTML = '<ol>';

      questions.forEach((question, index) => {
        const options = [...question.incorrect_answers, question.correct_answer];
        options.sort(() => Math.random() - 0.5); // Shuffle the options

        quizHTML += `
          <li>
            <p>${question.question}</p>
            <ul>
              ${options.map((option, optionIndex) => `
                <li>${option}</li>
              `).join('')}
            </ul>
          </li>
        `;
      });

      quizHTML += '</ol>';
      quizContainer.innerHTML = quizHTML;
    })
    .catch(error => {
      console.error('Error fetching anime quiz:', error);
    });
</script>
