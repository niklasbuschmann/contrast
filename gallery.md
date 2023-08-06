---
layout: page
title: Gallery
permalink: /gallery/
---

<style>
  .gallery-title {
    font-size: 36px;
    margin-bottom: 20px;
    color: #fff;
  }

  .gallery-table {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .gallery-image {
    width: 100%;
    border-radius: 10px;
  }

  .gallery-caption {
    font-size: 14px;
    margin-top: 10px;
    color: #ccc;
  }

  .tab-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  .tab {
    padding: 10px 20px;
    background-color: #333;
    color: #fff;
    border: 1px solid #444;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;
  }

  .tab.active {
    background-color: #555;
  }

  .gallery-container {
    display: none;
    margin-top: 20px;
  }

  .gallery-container.active {
    display: block;
  }
</style>

<div class="tab-container">
  <div class="tab active" onclick="showGallery('rabbit')">Rabbit Gallery</div>
  <div class="tab" onclick="showGallery('photography')">Photography Gallery</div>
  <div class="tab" onclick="showGallery('food')">Food Gallery</div>
</div>

<div id="rabbit-gallery" class="gallery-container active">
  <h1 class="gallery-title">Rabbit Gallery</h1>
  <div class="gallery-table">
    <!-- Your rabbit gallery content here -->
  </div>
</div>

<div id="photography-gallery" class="gallery-container">
  <h1 class="gallery-title">Photography Gallery</h1>
  <div class="gallery-table">
    <!-- Your photography gallery content here -->
  </div>
</div>

<div id="food-gallery" class="gallery-container">
  <h1 class="gallery-title">Food Gallery</h1>
  <div class="gallery-table">
    <!-- Your food gallery content here -->
  </div>
</div>

<script>
  function showGallery(galleryName) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    const galleries = document.querySelectorAll('.gallery-container');
    galleries.forEach(gallery => gallery.classList.remove('active'));

    const selectedTab = document.querySelector(`.tab.${galleryName}`);
    const selectedGallery = document.querySelector(`#${galleryName}-gallery`);

    selectedTab.classList.add('active');
    selectedGallery.classList.add('active');
  }
</script>
