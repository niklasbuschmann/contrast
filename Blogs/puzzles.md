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

<div id="anime-quiz"></div>

<script>
  const quizContainer = document.getElementById('anime-quiz');

  fetch('https://opentdb.com/api.php?amount=3&category=31')
    .then(response => response.json())
    .then(data => {
      const questions = data.results;
      let quizHTML = '<ol>';

      questions.forEach((question, index) => {
        const options = [...question.incorrect_answers, question.correct_answer];
        options.sort(() => Math.random() - 0.5); 

        quizHTML += `
          <li>
            <p>${question.question}</p>
            <ol type="A">
              ${options.map((option, optionIndex) => `
                <li>${String.fromCharCode(65 + optionIndex)}) ${option}</li>
              `).join('')}
            </ol>
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
