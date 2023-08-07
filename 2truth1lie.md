---
title: "2 Truths 1 Lie"
permalink: "/2truth1lie/"
layout: page
---

Here are my statements. Pick which one you think is the truth.

<script type="text/javascript">
  // Define your truths and lies here
  var truths = [
    "My favourite KDrama is Business Proposal", 
    "I learned how to juggle accidentally",
    "I almost fell off a roller coaster",
    "I once tuned my piano with chopsticks",
    "I have a family of amongus plushies",
    "I've never eaten pasta while visiting Italy",
    "I've experienced sleep paralysis",
    "I had a positive experience with chef's plate",
    "I've held a snake in my hands",
    "I can circular breathe",
    "My favourite video game is It Takes Two",
    ];
  var lies = [
    "I let my plant die despite being fake",
    "I've solved a puzzle consisting of only white pieces",
    "My bike was stolen on christmas eve",
    "I've grown an 80 kg pumpkin in my backyard",
    "I rode llama when I was 6",
    "I'm a clarinet player in my band",
    "My favourite movie is The Godfather",
  ];

  // Function to start the game
  function startGame() {
    var chosenTruths = [];
    var chosenLies = [];
    
    // Select 2 random truths
    while (chosenTruths.length < 2) {
      var randomTruth = truths[Math.floor(Math.random() * truths.length)];
      if (!chosenTruths.includes(randomTruth)) {
        chosenTruths.push(randomTruth);
      }
    }

    // Select 1 random lie
    chosenLies.push(lies[Math.floor(Math.random() * lies.length)]);

    // Combine and shuffle the statements
    var statements = chosenTruths.concat(chosenLies);
    statements.sort(() => Math.random() - 0.5);

    // Display the statements
    var html = statements.map((s, index) => `<button onclick="checkAnswer(${index})">${s}</button>`).join('<br>');
    document.getElementById("statements").innerHTML = html;
  }

  // Function to check the answer
  function checkAnswer(index) {
    if (index < 2) {
      alert("Correct! That's a truth.");
    } else {
      alert("Sorry, that's a lie.");
    }
  }

  // Start the game when the page loads
  window.onload = startGame;
</script>

<div id="statements"></div>
