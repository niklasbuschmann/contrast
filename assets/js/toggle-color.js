function toggleColor() {
  var meta = document.querySelector('meta[name=color-scheme]');
  var dark = meta.getAttribute('content') == 'light dark' ? matchMedia('(prefers-color-scheme: light)').matches : meta.getAttribute('content') == 'light';
  meta.setAttribute('content', dark ? 'dark' : 'light');
}

function toggle() {
  if (localStorage.getItem('toggle'))
    localStorage.removeItem('toggle');
  else
    localStorage.setItem('toggle', 1);
  toggleColor();
}

if (localStorage.getItem('toggle'))
  toggleColor();