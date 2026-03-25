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
// ==================== MAIN ENTRY POINT ====================

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
}

// Start the application
init();   // ==================== ADMIN MODULE ====================

function showAdminPanel() { 
    if (currentUser?.role !== 'admin') { 
        showToast('Admin access only'); 
        return; 
    } 
    document.getElementById('adminPanel').style.display = 'block'; 
    document.getElementById('uploadForm').style.display = 'none'; 
    document.getElementById('chatMonitor').style.display = 'none'; 
    loadPendingHouses(); 
}

function loadPendingHouses() { 
    const pending = houses.filter(h => !h.is_verified); 
    document.getElementById('pendingHousesList').innerHTML = pending.map(h => `
        <div class="pending-house-card">
            <img src="${h.photos?.[0] || 'https://via.placeholder.com/80'}">
            <div><strong>${h.title}</strong><br>${h.place}<br>KES ${h.nightly_rate}</div>
            <div><button class="approve-btn" onclick="approveHouse(${h.id})">✓ Approve</button><button class="reject-btn" onclick="rejectHouse(${h.id})">✗ Reject</button></div>
        </div>
    `).join(''); 
}

function approveHouse(id) { 
    const index = houses.findIndex(h => h.id === id); 
    if (index !== -1) { 
        houses[index].is_verified = true; 
        localStorage.setItem('bhast_houses', JSON.stringify(houses)); 
        loadPendingHouses(); 
        renderProperties(); 
        showToast('✅ House approved!'); 
    } 
}

function rejectHouse(id) { 
    houses = houses.filter(h => h.id !== id); 
    localStorage.setItem('bhast_houses', JSON.stringify(houses)); 
    loadPendingHouses(); 
    renderProperties(); 
    showToast('❌ House rejected'); 
}

function showChatMonitor() { 
    if (currentUser?.role !== 'admin') { 
        showToast('Admin only'); 
        return; 
    } 
    document.getElementById('chatMonitor').style.display = 'block'; 
    document.getElementById('adminPanel').style.display = 'none'; 
    document.getElementById('uploadForm').style.display = 'none'; 
    loadAdminConversations(); 
}

function loadAdminConversations() {
    const convList = document.getElementById('conversationList');
    convList.innerHTML = conversations.map(conv => { 
        const house = houses.find(h => h.id === conv.house_id); 
        return `<div class="conversation-item" onclick="loadAdminMessages('${conv.id}')">
            <img src="${house?.photos?.[0] || 'https://via.placeholder.com/50'}" class="conv-thumbnail">
            <div class="conv-info">
                <div class="conv-title">${house?.title || 'Unknown'}</div>
                <div class="conv-participants">👥 ${conv.participants.map(p => users.find(u => u.id === p)?.name).join(', ')}</div>
            </div>
        </div>`; 
    }).join('');
}

function loadAdminMessages(convId) { 
    const convMessages = messages.filter(m => m.conversation_id === convId).sort((a,b) => new Date(a.created_at) - new Date(b.created_at)); 
    document.getElementById('messageView').innerHTML = convMessages.map(msg => `
        <div class="admin-message">
            <strong>${users.find(u => u.id === msg.sender_id)?.name || 'Unknown'}</strong>
            <small>${new Date(msg.created_at).toLocaleString()}</small>
            <p>${escapeHtml(msg.content)}</p>
        </div>
    `).join('') || '<p>No messages</p>'; 
}         // ==================== PAYMENT MODULE ====================

const stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
let transactions = JSON.parse(localStorage.getItem('bhast_transactions')) || [];
let emailLog = JSON.parse(localStorage.getItem('bhast_emails')) || [];
let currentBooking = null;
let selectedMethod = 'mpesa';

function openPaymentModal(houseId) {
    if (!currentUser) { showToast('Please login to book'); showLoginModal(); return; }
    const house = houses.find(h => h.id === houseId);
    if (!house) return;
    currentBooking = { houseId: house.id, property: house.title, area: house.place, price: house.nightly_rate, guests: 2 };
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('checkInDate').valueAsDate = new Date();
    document.getElementById('checkOutDate').valueAsDate = tomorrow;
    updateBookingSummary();
    updatePaymentForm();
    document.getElementById('paymentModal').style.display = 'flex';
}

function closePaymentModal() { 
    document.getElementById('paymentModal').style.display = 'none'; 
    document.getElementById('paymentStatus').style.display = 'none'; 
}

function selectPaymentMethod(method) { 
    selectedMethod = method; 
    document.querySelectorAll('.payment-method-btn').forEach(btn => btn.classList.remove('active')); 
    event.currentTarget.classList.add('active'); 
    updatePaymentForm(); 
}

function updatePaymentForm() {
    const formDiv = document.getElementById('paymentForm');
    if (selectedMethod === 'mpesa') formDiv.innerHTML = `<input type="tel" id="mpesaPhone" placeholder="M-PESA Phone Number (e.g., 254712345678)" value="254712345678"><div style="font-size:0.8rem;">You will receive an STK push</div>`;
    else if (selectedMethod === 'card') formDiv.innerHTML = `<input type="text" id="cardHolderName" placeholder="Cardholder Name"><div id="card-element"></div><div id="card-errors"></div>`;
    else if (selectedMethod === 'paypal') formDiv.innerHTML = `<input type="email" id="paypalEmail" placeholder="PayPal Email">`;
    else formDiv.innerHTML = `<div style="text-align:center;"><i class="fas fa-university" style="font-size:3rem;"></i><p>Bank details will be sent to your email</p></div>`;
    if (selectedMethod === 'card') { const elements = stripe.elements(); const cardElement = elements.create('card', { style: { base: { color: '#e0e0e0', fontSize: '16px' } } }); cardElement.mount('#card-element'); }
}

function updateBookingSummary() {
    const checkIn = new Date(document.getElementById('checkInDate').value);
    const checkOut = new Date(document.getElementById('checkOutDate').value);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const total = currentBooking.price * nights;
    document.getElementById('bookingSummary').innerHTML = `
        <div class="summary-row"><span>${currentBooking.property}</span><span>${currentBooking.area}</span></div>
        <div class="summary-row"><span>Nights</span><span>${nights}</span></div>
        <div class="summary-row"><span>Guests</span><span>${currentBooking.guests}</span></div>
        <div class="summary-row summary-total"><span>Total</span><span>KES ${total.toLocaleString()}</span></div>
    `;
    return { nights, total };
}

async function processPayment() {
    const checkIn = document.getElementById('checkInDate').value, checkOut = document.getElementById('checkOutDate').value;
    if (!checkIn || !checkOut) { showToast('Select dates'); return; }
    const update = updateBookingSummary();
    const statusDiv = document.getElementById('paymentStatus');
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Processing...';
    setTimeout(() => {
        const transaction = { id: 'TXN_' + Date.now(), method: selectedMethod.toUpperCase(), amount: update.total, status: 'completed', property: currentBooking.property, timestamp: new Date().toLocaleString() };
        transactions.unshift(transaction);
        localStorage.setItem('bhast_transactions', JSON.stringify(transactions));
        emailLog.unshift({ to: currentUser.email, subject: `Booking confirmed: ${currentBooking.property}`, time: new Date().toLocaleString() });
        localStorage.setItem('bhast_emails', JSON.stringify(emailLog));
        statusDiv.innerHTML = `<i class="fas fa-check-circle"></i> Payment successful! Booking confirmed.`;
        statusDiv.style.background = '#1a3a2a';
        updateTransactionHistory(); updateEmailHistory();
        showToast('✅ Booking confirmed!');
        setTimeout(closePaymentModal, 2000);
    }, 1500);
}

function updateTransactionHistory() { 
    const div = document.getElementById('transactionHistory'); 
    div.innerHTML = transactions.slice(0,5).map(t => `<div class="transaction-item"><strong>${t.property}</strong> · KES ${t.amount}<div style="font-size:0.7rem;">${t.date}</div></div>`).join('') || '<div>No bookings</div>'; 
}

function updateEmailHistory() { 
    const div = document.getElementById('emailHistory'); 
    div.innerHTML = emailLog.slice(0,5).map(e => `<div class="email-item"><strong>To: ${e.to}</strong><div>${e.subject}</div><div style="font-size:0.7rem;">${e.time}</div></div>`).join('') || '<div>No emails</div>'; 
}    // ==================== CHAT MODULE ====================

let conversations = JSON.parse(localStorage.getItem('bhast_conversations')) || [];
let messages = JSON.parse(localStorage.getItem('bhast_messages')) || [];
let currentConversation = null;

function startChat(houseId) {
    if (!currentUser) { showToast('Please login to chat'); showLoginModal(); return; }
    const house = houses.find(h => h.id === houseId);
    let conversation = conversations.find(c => c.house_id === houseId && c.participants.includes(currentUser.id));
    if (!conversation) { 
        conversation = { id: 'conv_' + Date.now(), house_id: houseId, participants: [currentUser.id, house.host_id], created_at: new Date().toISOString() }; 
        conversations.push(conversation); 
        localStorage.setItem('bhast_conversations', JSON.stringify(conversations)); 
    }
    currentConversation = conversation;
    document.getElementById('chatTitle').innerHTML = `Chat about ${house.title}`;
    loadChatMessages(conversation.id);
    document.getElementById('chatModal').style.display = 'flex';
}

function loadChatMessages(convId) {
    const convMessages = messages.filter(m => m.conversation_id === convId).sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
    document.getElementById('chatMessages').innerHTML = convMessages.map(m => `
        <div class="message ${m.sender_id === currentUser?.id ? 'own' : ''}">
            <div class="message-content">${escapeHtml(m.content)}<div style="font-size:0.7rem;">${new Date(m.created_at).toLocaleTimeString()}</div></div>
        </div>
    `).join('');
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const content = input.value.trim();
    if (!content || !currentConversation) return;
    const newMsg = { id: 'msg_' + Date.now(), content, sender_id: currentUser.id, conversation_id: currentConversation.id, created_at: new Date().toISOString() };
    messages.push(newMsg);
    localStorage.setItem('bhast_messages', JSON.stringify(messages));
    loadChatMessages(currentConversation.id);
    input.value = '';
    if (currentUser.role === 'admin' && document.getElementById('chatMonitor').style.display !== 'none') loadAdminConversations();
}

function closeChatModal() { 
    document.getElementById('chatModal').style.display = 'none'; 
    currentConversation = null; 
}     // ==================== PROPERTIES MODULE ====================

let houses = JSON.parse(localStorage.getItem('bhast_houses')) || [];
let currentFilter = { type: 'all', area: 'all' };
let uploadedPhotos = [];

// Initialize properties
if (houses.length === 0) {
    houses = [
        { id: 1, title: "Skyline Penthouse", place: "Karen", house_number: "A12", zip_code: "00100", contact_number: "+254712345678", description: "Stunning penthouse with panoramic views", nightly_rate: 63000, photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], is_verified: true, host_id: "host_1", type: "penthouse" },
        { id: 2, title: "Modern Glass Villa", place: "Westlands", house_number: "B45", zip_code: "00100", contact_number: "+254723456789", description: "Contemporary glass villa with city views", nightly_rate: 120000, photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"], is_verified: true, host_id: "host_1", type: "villa" },
        { id: 3, title: "Royal Garden Mansion", place: "Runda", house_number: "C78", zip_code: "00100", contact_number: "+254734567890", description: "Luxurious mansion with private gardens", nightly_rate: 250000, photos: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"], is_verified: true, host_id: "host_1", type: "mansion" },
        { id: 4, title: "Lake Cottage", place: "Naivasha", house_number: "D23", zip_code: "20117", contact_number: "+254745678901", description: "Peaceful cottage by the lake", nightly_rate: 28000, photos: ["https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800"], is_verified: true, host_id: "host_1", type: "cottage" },
        { id: 5, title: "Luxury City Penthouse", place: "Kilimani", house_number: "E56", zip_code: "00100", contact_number: "+254756789012", description: "Modern penthouse in the heart of the city", nightly_rate: 95000, photos: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"], is_verified: true, host_id: "host_1", type: "penthouse" },
        { id: 6, title: "Mountain Cabin", place: "Nanyuki", house_number: "F89", zip_code: "10400", contact_number: "+254767890123", description: "Cozy cabin with mountain views", nightly_rate: 35000, photos: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"], is_verified: true, host_id: "host_1", type: "cottage" },
        { id: 7, title: "Beachfront Villa", place: "Diani", house_number: "G12", zip_code: "80401", contact_number: "+254778901234", description: "Stunning villa right on the beach", nightly_rate: 180000, photos: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"], is_verified: true, host_id: "host_1", type: "villa" },
        { id: 8, title: "Minimalist Smart Home", place: "Lavington", house_number: "H34", zip_code: "00100", contact_number: "+254789012345", description: "Tech-enabled modern home", nightly_rate: 52000, photos: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"], is_verified: true, host_id: "host_1", type: "house" },
        { id: 9, title: "Classic Mansion", place: "Karen", house_number: "I56", zip_code: "00100", contact_number: "+254790123456", description: "Elegant classic mansion", nightly_rate: 300000, photos: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"], is_verified: true, host_id: "host_1", type: "mansion" },
        { id: 10, title: "Desert Villa", place: "Kajiado", house_number: "J78", zip_code: "01100", contact_number: "+254801234567", description: "Unique desert oasis", nightly_rate: 70000, photos: ["https://images.unsplash.com/photo-1600585154207-0a98b62f7b6d?w=800"], is_verified: true, host_id: "host_1", type: "villa" }
    ];
    localStorage.setItem('bhast_houses', JSON.stringify(houses));
}

function renderProperties() {
    let filtered = houses.filter(h => h.is_verified);
    if (currentFilter.type !== 'all') filtered = filtered.filter(h => h.type === currentFilter.type);
    if (currentFilter.area !== 'all') filtered = filtered.filter(h => h.place === currentFilter.area);
    const grid = document.getElementById('propertyGrid');
    grid.innerHTML = filtered.map(h => `
        <div class="property-card">
            <div class="card-image" style="background-image: url('${h.photos && h.photos[0] ? h.photos[0] : 'https://via.placeholder.com/300'}');">
                <span class="verified-badge">✓ Verified</span>
                ${h.photos && h.photos.length > 1 ? `<span class="multiple-photos-badge"><i class="fas fa-images"></i> ${h.photos.length}</span>` : ''}
            </div>
            <div class="card-content">
                <div class="property-name">${h.title}</div>
                <div class="property-location"><i class="fas fa-map-marker-alt"></i> ${h.place}, ${h.place === 'Naivasha' || h.place === 'Nanyuki' || h.place === 'Diani' || h.place === 'Kajiado' ? 'Kenya' : 'Nairobi'} (${h.zip_code})</div>
                <div class="contact-info"><i class="fas fa-phone"></i> ${h.contact_number}</div>
                <div class="price">KES ${h.nightly_rate.toLocaleString()} <small>/night</small></div>
                <div class="button-group">
                    <button class="book-btn" onclick="openPaymentModal(${h.id})">Book Now</button>
                    <button class="chat-btn" onclick="startChat(${h.id})"><i class="fas fa-comment"></i> Contact Host</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterByType(type) { 
    currentFilter.type = type; 
    renderProperties(); 
}

function filterByArea(area) { 
    currentFilter.area = area; 
    renderProperties(); 
}

function searchProperties() { 
    renderProperties(); 
    showToast('Search updated'); 
}

function previewPhotos(input) {
    const preview = document.getElementById('photoPreview');
    preview.innerHTML = '';
    uploadedPhotos = [];
    for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedPhotos.push(e.target.result);
            const div = document.createElement('div');
            div.className = 'photo-preview-item';
            div.innerHTML = `<img src="${e.target.result}"><span class="remove-photo" onclick="this.parentElement.remove(); uploadedPhotos.splice(${uploadedPhotos.indexOf(e.target.result)}, 1);">×</span>`;
            preview.appendChild(div);
        };
        reader.readAsDataURL(file);
    }
}

function uploadHouse() {
    if (!currentUser) { showToast('Login first'); return; }
    const newHouse = {
        id: Date.now(),
        title: document.getElementById('houseTitle').value,
        place: document.getElementById('housePlace').value,
        house_number: document.getElementById('houseNumber').value,
        zip_code: document.getElementById('zipCode').value,
        contact_number: document.getElementById('contactNumber').value,
        description: document.getElementById('houseDescription').value,
        nightly_rate: parseFloat(document.getElementById('nightlyRate').value),
        photos: uploadedPhotos.length > 0 ? uploadedPhotos : ['https://via.placeholder.com/300'],
        is_verified: false,
        host_id: currentUser.id,
        type: document.getElementById('houseType').value
    };
    if (!newHouse.title) { showToast('Please fill title'); return; }
    houses.push(newHouse);
    localStorage.setItem('bhast_houses', JSON.stringify(houses));
    showToast('✅ House submitted for approval!');
    document.getElementById('uploadForm').style.display = 'none';
    uploadedPhotos = [];
    document.getElementById('photoPreview').innerHTML = '';
    if (currentUser.role === 'admin') loadPendingHouses();
}

function showUploadForm() { 
    if (!currentUser) { showToast('Login first'); showLoginModal(); return; } 
    document.getElementById('uploadForm').style.display = 'block'; 
    document.getElementById('adminPanel').style.display = 'none'; 
    document.getElementById('chatMonitor').style.display = 'none'; 
}      // ==================== AUTHENTICATION MODULE ====================

let users = JSON.parse(localStorage.getItem('bhast_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('bhast_currentUser')) || null;

// Initialize demo users
if (users.length === 0) {
    users.push({ id: 'user_1', name: 'Demo User', username: 'demo', email: 'demo@example.com', password: 'password123', role: 'user' });
    users.push({ id: 'admin_1', name: 'Bhast Admin', username: 'admin', email: 'admin@bhast.house', password: 'admin123', role: 'admin' });
    users.push({ id: 'host_1', name: 'Host Jane', username: 'host', email: 'host@example.com', password: 'host123', role: 'user' });
    localStorage.setItem('bhast_users', JSON.stringify(users));
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
        showToast(`Welcome ${user.name}!`); 
    } else { 
        showToast('Invalid credentials'); 
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
    showToast('Use demo: demo/password123'); 
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
// ==================== MAIN ENTRY POINT ====================

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
init();                   // ==================== THEME MANAGEMENT MODULE ====================

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
initTheme();             
