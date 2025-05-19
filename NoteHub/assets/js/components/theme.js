'use strict';

const toggleTheme = function () {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

const /*{string || null}*/ storedTheme  = localStorage.getItem('theme');

const /*{boolean}*/ systemThemeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = storedTheme ?? (systemThemeIsDark ? "dark" : "light");
document.documentElement.setAttribute('data-theme', initialTheme);

// toggleTheme initializing

window.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.querySelector('[data-theme-btn]');
  if(themeBtn){
    themeBtn.addEventListener('click', toggleTheme);   
  }
})

