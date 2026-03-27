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

document.addEventListener('click', (e) => { 
    if (!e.target.closest('.profile-menu')) closeProfileDropdown(); 
});

function init() {
    renderProperties();
    updateAuthUI();
    updateTransactionHistory();
    updateEmailHistory();
    initTheme();
}

init();
