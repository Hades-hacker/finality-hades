let users = JSON.parse(localStorage.getItem('bhast_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('bhast_currentUser')) || null;

if (users.length === 0) {
    users.push({ id: 'user_1', name: 'Demo User', username: 'demo', email: 'demo@example.com', password: 'password123', role: 'user' });
    users.push({ id: 'admin_1', name: 'Bhast Admin', username: 'bhast_admin', email: 'admin@bhast.house', password: 'bhast2025', role: 'admin' });
    users.push({ id: 'host_1', name: 'Host Jane', username: 'host', email: 'host@example.com', password: 'host123', role: 'user' });
    localStorage.setItem('bhast_users', JSON.stringify(users));
} else {
    const adminExists = users.some(u => u.username === 'bhast_admin');
    if (!adminExists) {
        users.push({ id: 'admin_' + Date.now(), name: 'Bhast Admin', username: 'bhast_admin', email: 'admin@bhast.house', password: 'bhast2025', role: 'admin' });
        localStorage.setItem('bhast_users', JSON.stringify(users));
    }
}

function updateAuthUI() {
    const authBtns = document.getElementById('authButtons');
    const profileMenu = document.getElementById('profileMenu');
    const adminBtn = document.getElementById('adminBtn');
    const chatMonitorBtn = document.getElementById('chatMonitorBtn');
    
    if (currentUser) {
        authBtns.style.display = 'none';
        profileMenu.style.display = 'block';
        document.getElementById('profileInitials').textContent = currentUser.name?.charAt(0).toUpperCase() || 'G';
        document.getElementById('profileName').textContent = currentUser.name || 'Guest';
        if (currentUser.role === 'admin') { 
            adminBtn.style.display = 'inline-block'; 
            chatMonitorBtn.style.display = 'inline-block'; 
        } else { 
            adminBtn.style.display = 'none'; 
            chatMonitorBtn.style.display = 'none'; 
        }
    } else { 
        authBtns.style.display = 'flex'; 
        profileMenu.style.display = 'none'; 
        adminBtn.style.display = 'none'; 
        chatMonitorBtn.style.display = 'none'; 
    }
}

function login() { 
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const user = users.find(u => (u.username === username || u.email === username) && u.password === password); 
    if (user) { 
        currentUser = { ...user }; 
        delete currentUser.password; 
        localStorage.setItem('bhast_currentUser', JSON.stringify(currentUser)); 
        closeLoginModal(); 
        updateAuthUI(); 
        renderProperties(); 
        if (user.role === 'admin') {
            showToast(`👑 Welcome Admin ${user.name}! You have full access.`);
        } else {
            showToast(`Welcome ${user.name}!`);
        }
    } else { 
        showToast('Invalid credentials. Try: bhast_admin / bhast2025'); 
    } 
}

function logout() { 
    currentUser = null; 
    localStorage.removeItem('bhast_currentUser'); 
    updateAuthUI(); 
    renderProperties(); 
    showToast('Signed out'); 
}

function showMyConversations() { 
    const userConvs = conversations.filter(c => c.participants.includes(currentUser.id)); 
    showToast(userConvs.length === 0 ? 'No conversations' : `You have ${userConvs.length} chats`); 
    closeProfileDropdown(); 
}

function showLoginModal() { 
    document.getElementById('loginModal').style.display = 'flex'; 
}

function closeLoginModal() { 
    document.getElementById('loginModal').style.display = 'none'; 
}

function showSignupModal() { 
    showToast('Use demo: demo/password123 or admin: bhast_admin/bhast2025'); 
    showLoginModal(); 
}

function showProfileEditModal() { 
    showToast('Profile edit coming soon'); 
    closeProfileDropdown(); 
}

function toggleProfileDropdown() { 
    document.getElementById('profileDropdown').classList.toggle('show'); 
}

function closeProfileDropdown() { 
    document.getElementById('profileDropdown').classList.remove('show'); 
}
