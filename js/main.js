// ==================== MAIN MODULE ====================
// Entry point, utility functions, and global initialization

// Initialize EmailJS
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
})();

// Send email function using EmailJS
async function sendEmail(to, subject, message, userName = '') {
    try {
        const templateParams = {
            to_email: to,
            subject: subject,
            message: message,
            user_name: userName || currentUser?.name || 'Guest',
            site_name: 'BHAST HOUSE'
        };
        
        const response = await emailjs.send('service_bhast', 'template_bhast', templateParams);
        console.log('Email sent successfully:', response);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        emailLog.unshift({ to: to, subject: subject, message: message, time: new Date().toLocaleString() });
        localStorage.setItem('bhast_emails', JSON.stringify(emailLog));
        return false;
    }
}

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
