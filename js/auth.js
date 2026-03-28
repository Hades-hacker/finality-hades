// ==================== AUTH MODULE ====================
// Handles user authentication, login, signup, and session management

let users = JSON.parse(localStorage.getItem('bhast_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('bhast_currentUser')) || null;

// Initialize demo users
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
        sendEmail(currentUser.email, 'Welcome to BHAST HOUSE!', `Hi ${currentUser.name}, welcome back to BHAST HOUSE! Start exploring amazing properties today.`);
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

function signup() {
    const name = document.getElementById('signupName')?.value;
    const username = document.getElementById('signupUsername')?.value;
    const email = document.getElementById('signupEmail')?.value;
    const password = document.getElementById('signupPassword')?.value;
    const confirmPassword = document.getElementById('signupConfirmPassword')?.value;
    
    if (!name || !username || !email || !password) {
        showToast('Please fill all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match');
        return;
    }
    
    if (users.some(u => u.username === username)) {
        showToast('Username already exists');
        return;
    }
    
    if (users.some(u => u.email === email)) {
        showToast('Email already registered');
        return;
    }
    
    const newUser = {
        id: 'user_' + Date.now(),
        name: name,
        username: username,
        email: email,
        password: password,
        role: 'user',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('bhast_users', JSON.stringify(users));
    currentUser = { ...newUser };
    delete currentUser.password;
    localStorage.setItem('bhast_currentUser', JSON.stringify(currentUser));
    closeSignupModal();
    updateAuthUI();
    sendEmail(currentUser.email, 'Welcome to BHAST HOUSE!', `Hi ${currentUser.name}, thank you for joining BHAST HOUSE! Start exploring amazing properties today.`);
    showToast(`✅ Welcome to BHAST HOUSE, ${name}!`);
}

function showLoginModal() { 
    document.getElementById('loginModal').style.display = 'flex'; 
}

function closeLoginModal() { 
    document.getElementById('loginModal').style.display = 'none'; 
}

function showSignupModal() { 
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:2000; display:flex; justify-content:center; align-items:center;';
    modal.innerHTML = `
        <div style="background:#1a1a24; padding:2rem; border-radius:16px; max-width:400px; width:90%; border:2px solid #b77dff;">
            <h3 style="color:#b77dff;"><i class="fas fa-user-plus"></i> Sign Up</h3>
            <input type="text" id="signupName" placeholder="Full Name" style="width:100%; margin:0.5rem 0; padding:0.8rem; background:#2a2a35; border:1px solid #3a3a48; border-radius:8px; color:white;">
            <input type="text" id="signupUsername" placeholder="Username" style="width:100%; margin:0.5rem 0; padding:0.8rem; background:#2a2a35; border:1px solid #3a3a48; border-radius:8px; color:white;">
            <input type="email" id="signupEmail" placeholder="Email" style="width:100%; margin:0.5rem 0; padding:0.8rem; background:#2a2a35; border:1px solid #3a3a48; border-radius:8px; color:white;">
            <input type="password" id="signupPassword" placeholder="Password" style="width:100%; margin:0.5rem 0; padding:0.8rem; background:#2a2a35; border:1px solid #3a3a48; border-radius:8px; color:white;">
            <input type="password" id="signupConfirmPassword" placeholder="Confirm Password" style="width:100%; margin:0.5rem 0; padding:0.8rem; background:#2a2a35; border:1px solid #3a3a48; border-radius:8px; color:white;">
            <button onclick="signup(); this.closest('div').parentElement.remove();" style="width:100%; padding:0.8rem; background:#b77dff; border:none; border-radius:8px; font-weight:600; cursor:pointer; margin-top:1rem;">Create Account</button>
            <button onclick="this.closest('div').parentElement.remove()" style="margin-top:1rem; width:100%; padding:0.5rem; background:#2a2a35; border:none; border-radius:8px; cursor:pointer;">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
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

function showMyConversations() { 
    const userConvs = conversations.filter(c => c.participants.includes(currentUser.id)); 
    showToast(userConvs.length === 0 ? 'No conversations' : `You have ${userConvs.length} chats`); 
    closeProfileDropdown(); 
}
