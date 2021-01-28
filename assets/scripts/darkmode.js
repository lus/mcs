if (!localStorage.getItem('dark')) {
    localStorage.setItem('dark', (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches).toString());
}

initializeDarkMode();

function toggleDarkMode() {
    localStorage.setItem('dark', (!(localStorage.getItem('dark') == 'true')).toString());
    initializeDarkMode();
}

function initializeDarkMode() {
    if (localStorage.getItem('dark') == 'true') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
}