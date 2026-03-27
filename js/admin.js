function showAdminPanel() { 
    if (currentUser?.role !== 'admin') { 
        showToast('Admin access only. Please log in with admin credentials.'); 
        showLoginModal();
        return; 
    } 
    document.getElementById('adminPanel').style.display = 'block'; 
    document.getElementById('uploadForm').style.display = 'none'; 
    document.getElementById('chatMonitor').style.display = 'none'; 
    document.getElementById('adminNameDisplay').textContent = currentUser.name || 'Admin';
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
        showToast('Admin access only'); 
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
}
