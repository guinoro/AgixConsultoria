// theme.js
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    if (themeToggle) {
        // Set initial button text based on current theme
        const currentTheme = localStorage.getItem('theme') || 'dark';
        themeToggle.textContent = currentTheme === 'light' ? '☀️' : '🌙';

        // Toggle theme on button click
        themeToggle.addEventListener('click', () => {
            const isLight = root.classList.contains('light-mode');
            if (isLight) {
                root.classList.remove('light-mode');
                themeToggle.textContent = '🌙';
                localStorage.setItem('theme', 'dark');
            } else {
                root.classList.add('light-mode');
                themeToggle.textContent = '☀️';
                localStorage.setItem('theme', 'light');
            }
        });
    }
});
