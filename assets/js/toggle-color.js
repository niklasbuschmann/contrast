function toggleColor() {
  for (var styleSheet of document.styleSheets) {
    for (var rule of styleSheet.cssRules) {
      if (rule.media && rule.media.mediaText.includes('prefers-color-scheme: light')) {
        rule.media.deleteMedium('(prefers-color-scheme: light)');
        rule.media.appendMedium('(prefers-color-scheme: dark)');
      }
      else if (rule.media && rule.media.mediaText.includes('prefers-color-scheme: dark')) {
        rule.media.deleteMedium('(prefers-color-scheme: dark)');
        rule.media.appendMedium('(prefers-color-scheme: light)');
      }
    }
  }
}

function toggle() {
  if (localStorage.getItem('toggle'))
    localStorage.removeItem('toggle');
  else
    localStorage.setItem('toggle', 1);
  toggleColor()
}

if (localStorage.getItem('toggle'))
  toggleColor();

document.head.appendChild(document.createElement('style')).innerHTML = '* {transition: .2s all ease-out}';
