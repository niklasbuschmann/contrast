(function () {
  function applyTheme(theme) {
    var html = document.documentElement;
    var meta = document.querySelector('meta[name="color-scheme"]');
    var isLight = theme === "light";
    html.setAttribute("data-theme", isLight ? "light" : "dark");
    if (document.body) {
      document.body.classList.toggle("light-theme", isLight);
    }
    if (meta) {
      meta.setAttribute("content", isLight ? "light" : "dark");
    }
    var toggleButton = document.querySelector("[data-theme-toggle]");
    if (toggleButton) {
      // Don't change button content - use CSS to show/hide icons
    }
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem("site-theme") || "dark";
    } catch (error) {
      return "dark";
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem("site-theme", theme);
    } catch (error) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(getStoredTheme());

    var toggleButton = document.querySelector("[data-theme-toggle]");
    if (!toggleButton) {
      return;
    }

    toggleButton.addEventListener("click", function () {
      var currentTheme = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      var nextTheme = currentTheme === "light" ? "dark" : "light";
      storeTheme(nextTheme);
      applyTheme(nextTheme);
    });
  });
})();
