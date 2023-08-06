---
layout: page
title: TestPage
permalink: /testpage/
---

<style>

  #gallery-container {
    width: 100%;
    max-width: 800px;
    margin: 40px auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .gallery-item {
    width: 200px;
    height: 200px;
    margin: 10px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }

  .gallery-item:hover {
    transform: scale(1.1);
  }

  .gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .gallery-item:hover img {
    transform: scale(1.2);
  }

  .gallery-item .description {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 10px;
    box-sizing: border-box;
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }

  .gallery-item:hover .description {
    transform: translateY(0);
  }
</style>

<div id="gallery-container">
  <!-- Gallery items go here -->
</div>

<script>
  const galleryData = [
    { src: 'https://placekitten.com/200/300', description: 'Cute Kitten 1' },
    { src: 'https://placekitten.com/200/301', description: 'Cute Kitten 2' },
    { src: 'https://placekitten.com/200/302', description: 'Cute Kitten 3' },
    { src: 'https://placekitten.com/200/303', description: 'Cute Kitten 4' },
    { src: 'https://placekitten.com/200/304', description: 'Cute Kitten 5' },
    { src: 'https://placekitten.com/200/305', description: 'Cute Kitten 6' },
    { src: 'https://placekitten.com/200/306', description: 'Cute Kitten 7' },
    { src: 'https://placekitten.com/200/307', description: 'Cute Kitten 8' },
    { src: 'https://placekitten.com/200/308', description: 'Cute Kitten 9' },
    { src: 'https://placekitten.com/200/309', description: 'Cute Kitten 10' },
    { src: 'https://placekitten.com/200/310', description: 'Cute Kitten 11' },
    { src: 'https://placekitten.com/200/311', description: 'Cute Kitten 12' },
    // Add more items here
  ];

  const galleryContainer = document.getElementById('gallery-container');
  galleryData.forEach(item => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    const img = document.createElement('img');
    img.src = item.src;
    galleryItem.appendChild(img);

    const description = document.createElement('div');
    description.className = 'description';
    description.textContent = item.description;
    galleryItem.appendChild(description);

    galleryContainer.appendChild(galleryItem);
  });
</script>
