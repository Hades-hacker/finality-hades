// ==================== CHAT MODULE ====================
// Handles real-time messaging between users and hosts

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
    
    // Send email notification for new message
    const otherParticipant = currentConversation.participants.find(p => p !== currentUser.id);
    const otherUser = users.find(u => u.id === otherParticipant);
    if (otherUser) {
        sendEmail(otherUser.email, 'New Message', `You have a new message from ${currentUser.name}: "${content}"`);
    }
    if (currentUser.role === 'admin' && document.getElementById('chatMonitor').style.display !== 'none') loadAdminConversations();
}

function closeChatModal() { 
    document.getElementById('chatModal').style.display = 'none'; 
    currentConversation = null; 
}
