let houses = JSON.parse(localStorage.getItem('bhast_houses')) || [];
let currentFilter = { type: 'all', area: 'all' };
let uploadedPhotos = [];

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
        { id: 10, title: "Desert Villa", place: "Kajiado", house_number: "J78", zip_code: "01100", contact_number: "+254801234567", description: "Unique desert oasis", nightly_rate: 70000, photos: ["https://images.unsplash.com/photo-1600585154207-0a98b62f7b6d?w=800"], is_verified: true, host_id: "host_1", type: "villa" },
        { id: 11, title: "Sunset Heights", place: "Karen", house_number: "K90", zip_code: "00100", contact_number: "+254812345678", description: "Beautiful modern house with garden view", nightly_rate: 45000, photos: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"], is_verified: true, host_id: "host_1", type: "house" },
        { id: 12, title: "Green Acres", place: "Lavington", house_number: "L12", zip_code: "00100", contact_number: "+254823456789", description: "Spacious family home", nightly_rate: 38000, photos: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"], is_verified: true, host_id: "host_1", type: "house" }
    ];
    localStorage.setItem('bhast_houses', JSON.stringify(houses));
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
}
