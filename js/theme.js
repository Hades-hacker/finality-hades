// ==================== THEME MODULE ====================
// Handles dark/light mode switching with persistent storage

function initTheme() {
    const savedTheme = localStorage.getItem('bhast_theme');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light';
        }
    } else {
        document.body.classList.remove('light-theme');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark';
        }
    }
}

function toggleTheme() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    
    if (document.body.classList.contains('light-theme')) {
        document.body.classList.remove('light-theme');
        localStorage.setItem('bhast_theme', 'dark');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark';
        }
        showToast('🌙 Dark mode activated');
    } else {
        document.body.classList.add('light-theme');
        localStorage.setItem('bhast_theme', 'light');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light';
        }
        showToast('☀️ Light mode activated');
    }
}
