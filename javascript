// ==================== THEME MANAGEMENT MODULE ====================

// Check for saved theme preference
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

// Toggle between light and dark mode
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

// Initialize theme on page load
initTheme();               // ==================== MAIN ENTRY POINT ====================

function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    toast.style.display = 'flex';
    setTimeout(() => toast.style.display = 'none', 3000);
}

function escapeHtml(text) { 
    return text.replace(/[&<>]/g, function(m){
        if(m==='&') return '&amp;'; 
        if(m==='<') return '&lt;'; 
        if(m==='>') return '&gt;'; 
        return m;
    }); 
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => { 
    if (!e.target.closest('.profile-menu')) closeProfileDropdown(); 
});

// Initialize all modules
function init() {
    renderProperties();
    updateAuthUI();
    updateTransactionHistory();
    updateEmailHistory();
    initTheme(); // Initialize theme on load
}

// Start the application
init();          
