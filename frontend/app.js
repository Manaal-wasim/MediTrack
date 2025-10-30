// ==================== API CONFIGURATION ====================
const API_BASE_URL = 'http://localhost:5000';

// API Functions for backend communication
async function apiSignup(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('Signup error:', error);
        return { success: false, data: { error: 'Network error. Please try again.' } };
    }
}

async function apiLogin(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, data: { error: 'Network error. Please try again.' } };
    }
}

async function checkAuth() {
    try {
        const response = await fetch(`${API_BASE_URL}/check-auth`);
        const data = await response.json();
        
        if (data.authenticated) {
            return data.user;
        }
        return null;
    } catch (error) {
        console.error('Auth check error:', error);
        return null;
    }
}

// ==================== MEDICATION API FUNCTIONS ====================//

async function apiGetMedications() {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const response = await fetch(`${API_BASE_URL}/api/medications`, {
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${user.user_id}`  // FIXED: user.user_id not user.user
            }
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('Get medications error:', error);
        return { success: false, data: { error: 'Network error. Please try again.' } };
    }
}

async function apiGetMonthlyMedications(year, month) {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const response = await fetch(`${API_BASE_URL}/api/medications/monthly?year=${year}&month=${month}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${user.user_id}`  // FIXED: user.user_id not user.user
            }
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('Get monthly medications error:', error);
        return { success: false, data: { error: 'Network error. Please try again.' } };
    }
}

async function apiGetTodayMedications() {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const response = await fetch(`${API_BASE_URL}/api/medications/today`, {
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${user.user_id}`  // FIXED: user.user_id not user.user
            }
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('Get today medications error:', error);
        return { success: false, data: { error: 'Network error. Please try again.' } };
    }
}
async function apiAddMedication(medicationData) {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        const response = await fetch(`${API_BASE_URL}/api/medications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.user_id}`  // ADD THIS LINE
            },
            body: JSON.stringify(medicationData)
            // Remove credentials: 'include'
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('Add medication error:', error);
        return { success: false, data: { error: 'Network error. Please try again.' } };
    }
}
async function apiUpdateMedication(medicineId, medicationData) {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        const response = await fetch(`${API_BASE_URL}/api/medications/${medicineId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.user_id}`  // ADD THIS LINE
            },
            body: JSON.stringify(medicationData)
            // Remove credentials: 'include'
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('Update medication error:', error);
        return { success: false, data: { error: 'Network error. Please try again.' } };
    }
}
async function apiDeleteMedication(medicationId) {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        const response = await fetch(`${API_BASE_URL}/api/medications/${medicationId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.user_id}`,
                'User-Id': user.user_id,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        return { success: response.ok, data }; // ← ADD THIS RETURN STATEMENT
    } catch (error) {
        console.error('Delete medication API error:', error);
        return { success: false, data: { error: 'Network error. Please try again.' } }; // ← AND THIS ONE
    }
}
async function apiUpdateMedicationStatus(medicineId, status) {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        const response = await fetch(`${API_BASE_URL}/api/medications/${medicineId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.user_id}`  // ADD THIS LINE
            },
            body: JSON.stringify({ status })
            // Remove credentials: 'include'
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('Update medication status error:', error);
        return { success: false, data: { error: 'Network error. Please try again.' } };
    }
}


async function apiGetMyMedications() {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const response = await fetch(`${API_BASE_URL}/api/my-medications`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${user.user_id}`,
                'User-Id': user.user_id  // Fallback header
            }
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('Get my medications error:', error);
        return { success: false, data: { error: 'Network error. Please try again.' } };
    }
}

async function apiSearchMyMedications(searchTerm) {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const response = await fetch(`${API_BASE_URL}/api/my-medications/search?q=${encodeURIComponent(searchTerm)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${user.user_id}`,
                'User-Id': user.user_id  // Fallback header
            }
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('Search medications error:', error);
        return { success: false, data: { error: 'Network error. Please try again.' } };
    }
}

// ==================== AUTH FORMS ====================
function initAuthForms() {
    console.log("initAuthForms called - setting up form handlers");
    
    // Login Form Handling
    const loginForm = document.querySelector('.auth-form');
    if (loginForm && window.location.pathname.includes('login.html')) {
        console.log("Setting up login form handler");
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Login form submitted");

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!email || !password) {
                alert('Please fill in all fields.');
                return;
            }

            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;

            // Use the API function
            const result = await apiLogin(email, password);
            
            if (result.success) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(result.data.user));
                alert('Login successful!');
                
                // Redirect based on role
                if (result.data.user.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'user dashboard.html';
                }
            } else {
                alert(result.data.error || 'Login failed');
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Signup Form Handling
    if (loginForm && window.location.pathname.includes('signup.html')) {
        console.log("Setting up signup form handler");
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Signup form submitted");

            const fullname = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();
            const age = document.getElementById('age')?.value;
            const gender = document.getElementById('gender')?.value;
            const contact = document.getElementById('contact')?.value;

            if (!fullname || !email || !password || !confirmPassword) {
                alert('Please fill in all required fields.');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creating Account...';
            submitBtn.disabled = true;

            const formData = {
                name: fullname,
                email: email,
                password: password,
                age: age || null,
                gender: gender || null,
                contact: contact || null,
                role: 'client'
            };

            console.log("Sending signup data:", formData);

            // Use the API function
            const result = await apiSignup(formData);
            
            if (result.success) {
                alert('Account created successfully! Please login.');
                window.location.href = 'login.html';
            } else {
                alert(result.data.error || 'Signup failed');
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// ==================== PASSWORD TOGGLE ====================
function initPasswordToggle() {
    // Function to toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const passwordInput = toggle.previousElementSibling;
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggle.innerHTML = '<i class="fas fa-eye-slash" style="top: 74%; "></i>';
            } else {
                passwordInput.type = 'password';
                toggle.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });
}

// ==================== SMOOTH SCROLLING ====================
function initSmoothScrolling() {
    // Function to enable smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Prevent default anchor link behavior
            e.preventDefault();

            // Get the ID of the target section (e.g., '#features')
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Scroll to the target element smoothly
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Optional: Add a subtle effect to the header on scroll
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }
}

// ==================== MEDICINE TRACKER ====================//
let medicines = [];
let editingMedicineId = null;

// DOM Elements - declare them but don't assign yet
let medicineList, emptyState, addMedicineBtn, addMedicineEmptyBtn, medicineModal, closeModalBtn, cancelBtn, medicineForm, notification;

function initMedicineTracker() {
    // Get DOM elements for medicine tracker
    medicineList = document.getElementById('medicineList');
    emptyState = document.getElementById('emptyState');
    addMedicineBtn = document.getElementById('addMedicineBtn');
    addMedicineEmptyBtn = document.getElementById('addMedicineEmptyBtn');
    medicineModal = document.getElementById('medicineModal');
    closeModalBtn = document.getElementById('closeModalBtn');
    cancelBtn = document.getElementById('cancelBtn');
    medicineForm = document.getElementById('medicineForm');
    notification = document.getElementById('notification');

    // Check if we're on a page that has medicine tracker elements
    if (!medicineList) {
        console.log('Medicine tracker not on this page');
        return;
    }

    loadMedications();

    // Event Listeners
    if (addMedicineBtn) addMedicineBtn.addEventListener('click', openModal);
    if (addMedicineEmptyBtn) addMedicineEmptyBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (medicineForm) medicineForm.addEventListener('submit', handleFormSubmit);

    // Close modal when clicking outside
    if (medicineModal) {
        medicineModal.addEventListener('click', function (e) {
            if (e.target === medicineModal) {
                closeModal();
            }
        });
    }
}

async function loadMedications() {
    let result;
    
    // Check if we're on the today's schedule page
    if (window.location.pathname.includes('medicine_schedule') || 
        document.querySelector('.medicine-tracker-body')) {
        console.log(' Loading today medications...');
        // Load only today's medications
        result = await apiGetTodayMedications();
    } else {
        // Load all medications (for other pages)
        console.log('📋 Loading all medications...');
        result = await apiGetMedications();
    }
    console.log('API Response:', result);
    
    if (result.success) {
        medicines = result.data.medications || [];
        console.log(`Loaded ${medicines.length} medications`);
        renderMedicineList();
    } else {
        console.error('API Error:', result.data.error);
        showNotification('Failed to load medications',  + (result.data.error || 'Unknown error'), 'error');
        medicines = [];
        renderMedicineList();
    }
}

function renderMedicineList() {
    // Check if medicineList exists
    if (!medicineList) return;

    // Clear the list
    medicineList.innerHTML = '';

    // Check if there are medicines
    if (medicines.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Sort medicines by time
    const sortedMedicines = [...medicines].sort((a, b) => {
        return a.time.localeCompare(b.time);
    });

    // Create medicine items
    sortedMedicines.forEach(medicine => {
        const li = document.createElement('li');
        li.className = 'medicine-item';

        // Map database status to frontend status
        let statusClass, statusIcon, displayStatus;
        if (medicine.status === 'Completed' || medicine.status === 'taken') {
            statusClass = 'status-taken';
            statusIcon = 'fas fa-check-circle';
            displayStatus = 'Taken';
        } else if (medicine.status === 'Pending' || medicine.status === 'upcoming') {
            statusClass = 'status-upcoming';
            statusIcon = 'far fa-clock';
            displayStatus = 'Upcoming';
        } else {
            statusClass = 'status-missed';
            statusIcon = 'fas fa-exclamation-circle';
            displayStatus = 'Missed';
        }

        li.innerHTML = `
            <div class="medicine-info">
                <div class="medicine-name">
                    <i class="fas fa-capsules"></i> ${medicine.name}
                </div>
                <div class="medicine-details">
                    <span class="dosage-badge">
                        <i class="fas fa-prescription-bottle-alt"></i> ${medicine.dosage}
                    </span>
                    <span class="medicine-time">
                        <i class="far fa-clock"></i> ${formatTime(medicine.time)}
                    </span>
                    <span class="status ${statusClass}">
                        <i class="${statusIcon}"></i>${displayStatus}
                    </span>
                </div>
                ${medicine.notes ? `<div class="medicine-notes">${medicine.notes}</div>` : ''}
            </div>
            <div class="medicine-actions">
                <button class="action-btn mark-taken-btn" data-id="${medicine.id}" title="Mark as taken">
                    <i class="fas fa-check"></i>
                </button>
                <button class="action-btn edit-btn" data-id="${medicine.id}" title="Edit medicine">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${medicine.id}" title="Delete medicine">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        medicineList.appendChild(li);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('.mark-taken-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.getAttribute('data-id'));
            markMedicineAsTaken(id);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.getAttribute('data-id'));
            deleteMedicine(id);
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.getAttribute('data-id'));
            openEditModal(id);
        });
    });
}

function formatTime(timeString) {
    // Handle both "HH:MM:SS" and "YYYY-MM-DD HH:MM:SS" formats
    const timePart = timeString.includes(' ') ? timeString.split(' ')[1] : timeString;
    const [hours, minutes] = timePart.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('medicineName').value;
    const dosage = document.getElementById('dosage').value;
    const frequency = document.getElementById('frequency').value;
    const time = document.getElementById('scheduleTime').value;
    const notes = document.getElementById('notes').value;
    // Combine today's date with the selected time
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const fullDateTime = `${year}-${month}-${day} ${time}:00`;

    const medicationData = {
        name,
        dosage,
        time: fullDateTime,
        notes
    };

    let result;
    if (editingMedicineId) {
        // Update existing medication
        result = await apiUpdateMedication(editingMedicineId, medicationData);
    } else {
        // Add new medication
        result = await apiAddMedication(medicationData);
    }

    if (result.success) {
        showNotification(editingMedicineId ? 'Medicine updated successfully!' : 'Medicine added successfully!', 'success');
        await loadMedications(); // Reload medications from server
        closeModal();
    } else {
        showNotification(result.data.error || 'Operation failed', 'error');
    }
} 
async function markMedicineAsTaken(id) {
    const result = await apiUpdateMedicationStatus(id, 'taken');
    
    if (result.success) {
        showNotification('Medicine marked as taken!', 'success');
        await loadMedications(); // Reload medications from server
    } else {
        showNotification(result.data.error || 'Failed to update status', 'error');
    }
}

async function deleteMedicine(id) {
    if (confirm('Are you sure you want to delete this medicine?')) {
        const result = await apiDeleteMedication(id);
        
        if (result.success) {
            showNotification('Medicine deleted successfully!', 'success');
            await loadMedications(); // Reload medications from server
        } else {
            showNotification(result.data.error || 'Failed to delete medicine', 'error');
        }
    }
}

function openEditModal(id) {
    const medicine = medicines.find(m => m.id === id);
    if (!medicine) return;

    editingMedicineId = id;

    // Open the modal
    openModal();

    // Change the modal title and button text
    document.getElementById('modalTitle').textContent = 'Edit Medicine';
    document.getElementById('submitBtn').textContent = 'Update Medicine';

    // Pre-fill the form
    document.getElementById('medicineName').value = medicine.name;
    document.getElementById('dosage').value = medicine.dosage;
    document.getElementById('frequency').value = 'once'; // Default since your schema doesn't have frequency
    // Extract just the time part for the time input
    const timePart = medicine.time.split(' ')[1].substring(0, 5); // Gets "HH:MM"
    document.getElementById('scheduleTime').value = timePart;
    document.getElementById('notes').value = medicine.notes;
}

function openModal() {
    if (medicineModal) medicineModal.style.display = 'flex';
    editingMedicineId = null;
    document.getElementById('modalTitle').textContent = 'Add New Medicine';
    document.getElementById('submitBtn').textContent = 'Add Medicine';
}

function closeModal() {
    if (medicineModal) medicineModal.style.display = 'none';
    if (medicineForm) medicineForm.reset();
    editingMedicineId = null;
}

function showNotification(message, type) {
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ==================== MY MEDICATIONS PAGE FUNCTIONALITY ====================//
function initMyMedicationsPage() {
    // Check if we're on the my_medications page
    if (!window.location.pathname.includes('my_medications.html')) {
        return;
    }

    console.log("Initializing My Medications page...");
    
    // Update user info
    const userData = getUserData();
    const userName = userData.name || 'User';
    
    // Update username display
    const usernameElement = document.getElementById('username');
    if (usernameElement) {
        usernameElement.textContent = `${userName}`;
    }
    
    loadMyMedications();
    setupSearchFunctionality();
    setupAddMedicationButton();
}
async function loadMyMedications(searchTerm = '') {
    let result;
    
    if (searchTerm) {
        result = await apiSearchMyMedications(searchTerm);
    } else {
        result = await apiGetMyMedications();
    }
    
    console.log('My Medications API Response:', result);
    
    if (result.success) {
        const medications = result.data.medications || [];
        console.log(`Loaded ${medications.length} medications`);
        renderMyMedications(medications);
    } else {
        console.error(' API Error:', result.data.error);
        showNotification('Failed to load medications: ' + (result.data.error || 'Unknown error'), 'error');
        renderMyMedications([]);
    }
}

function renderMyMedications(medications) {
    const grid = document.getElementById('medicationsGrid');
    if (!grid) return;

    // Clear the list
    grid.innerHTML = '';

    // Check if there are medicines
    if (medications.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No medications found matching your search.</p>
            </div>
        `;
        return;
    }

    // Create medication cards
    medications.forEach(med => {
        const card = document.createElement('div');
        card.className = 'medication-card';
        
        card.innerHTML = `
            <div class="medication-header">
                <h3 class="medication-name">${med.name}</h3>
                <span class="medication-dosage">${med.dosage}</span>
            </div>
            <div class="medication-details">
                <div class="detail-item">
                    <span class="detail-label">Frequency:</span>
                    <span class="detail-value">${med.frequency}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Purpose:</span>
                    <span class="detail-value">${med.purpose}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Prescriber:</span>
                    <span class="detail-value">${med.prescriber}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Start Date:</span>
                    <span class="detail-value">${med.startDate}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Refills:</span>
                    <span class="detail-value">${med.refills} remaining</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value status-badge status-${med.status.toLowerCase()}">${med.status}</span>
                </div>
                ${med.notes ? `
                <div class="detail-item">
                    <span class="detail-label">Notes:</span>
                    <span class="detail-value">${med.notes}</span>
                </div>` : ''}
            </div>
            <div class="medication-actions">
                <button class="action-btn edit-btn" data-id="${med.id}" title="Edit medication">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete-btn" data-id="${med.id}" title="Delete medication">
                    <i class="fas fa-trash-alt"></i> Delete
                </button>
            </div>
        `;

        grid.appendChild(card);
    });

    // Add event listeners to action buttons
    attachMedicationActionListeners();
}

function setupSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            loadMyMedications(searchTerm);
        });
        
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                loadMyMedications(searchTerm);
            }
        });
    }
}

function setupAddMedicationButton() {
    const addBtn = document.querySelector('.add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            // Redirect to add medication page or open modal
            window.location.href = 'medicine_schedule.html?action=add';
        });
    }
}

function attachMedicationActionListeners() {
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const medicineId = this.getAttribute('data-id');
            editMedication(medicineId);
        });
    });

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const medicineId = this.getAttribute('data-id');
            deleteMedication(medicineId);
        });
    });
}

async function editMedication(medicineId) {
    // Redirect to edit page or open edit modal
    window.location.href = `medicine_schedule.html?action=edit&id=${medicineId}`;
}

async function deleteMedication(medicineId) {
    if (!confirm('Are you sure you want to delete this medication?')) {
        return;
    }

    try {
        const result = await apiDeleteMedication(medicineId); // This should now work
        
        if (result.success) {
            showNotification('Medication deleted successfully!', 'success');
            loadMyMedications(); // Reload the list
        } else {
            showNotification(result.data.error || 'Failed to delete medication', 'error');
        }
    } catch (error) {
        console.error('Delete medication error:', error);
        showNotification('Error deleting medication', 'error');
    }
}
// ==================== USER DASHBOARD ====================
function getUserData() {
    return JSON.parse(localStorage.getItem('user') || '{}');
}

async function initDashboard() {
    const userData = getUserData();
    const userName = userData.name || 'User';

    // Safe updates for user info
    safeUpdateElement('welcome-message', `Welcome back, ${userName}!`);
    safeUpdateElement('username', userName);
    
    document.getElementById('welcome-message').textContent = `Welcome back, ${userName}!`;
    document.getElementById('username').textContent = userName;
    updateUserAvatar(userName);
    updateCurrentDate();
    
    // Load real data from API
    await updateDashboardStats();
    await loadTodayMedications();
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a[data-section]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Don't prevent default for actual page links
            const href = this.getAttribute('href');
            if (href === '#' || !href.includes('.html')) {
                e.preventDefault();
            }
            
            const section = this.getAttribute('data-section');
            console.log('Navigation clicked:', section, '->', href);
            
            // If it's a hash link, handle the section switching
            if (href === '#') {
                navLinks.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                showSection(section);
            }
            // Otherwise, let the browser handle the page navigation
        });
    });

    // Add logout button if it exists
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (confirm('Are you sure you want to log out?')) {
                localStorage.removeItem('user');
                window.location.href = 'login.html';
            }
        });
    }
}

function updateCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date-display').textContent = `Today is ${now.toLocaleDateString('en-US', options)}`;
}

function updateUserAvatar(name) {
    const avatar = document.querySelector('.avatar-placeholder');
    if (name) {
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
        avatar.textContent = initials;
    }
}

async function updateDashboardStats() {
    try {
        console.log("🔄 Updating dashboard stats...");
        
        // Get all medications for active count
        const medsResult = await apiGetMedications();
        const allMedications = medsResult.success ? medsResult.data.medications || [] : [];
        
        // Get today's medications for upcoming doses
        const todayResult = await apiGetTodayMedications();
        const todayMedications = todayResult.success ? todayResult.data.medications || [] : [];
        
        // Calculate stats
        const activeMedsCount = allMedications.length;
        const upcomingDosesCount = todayMedications.filter(med => 
            med.status === 'Pending' || med.status === 'upcoming'
        ).length;
        
        // Get next medication time
        const nextMedTime = getNextMedicationTime(todayMedications);
        
        // Safe DOM updates with null checks
        safeUpdateElement('active-meds-count', activeMedsCount);
        safeUpdateElement('upcoming-doses-count', upcomingDosesCount);
        safeUpdateElement('next-dose-time', nextMedTime || 'None');
        
        // Update adherence
        const adherenceRate = calculateAdherenceRate(allMedications);
        safeUpdateElement('adherence-rate', `${adherenceRate}%`);
        
        // Hide doctors count section if it exists
        const doctorsSection = document.querySelector('.stat-card:has(#doctors-count)');
        if (doctorsSection) {
            doctorsSection.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Error updating dashboard stats:', error);
    }
}

// Helper function for safe DOM updates
function safeUpdateElement(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = content;
    } else {
        console.warn(`Element with id '${elementId}' not found`);
    }
}

function getNextMedicationTime(medications) {
    const now = new Date();
    const pendingMeds = medications.filter(med => 
        (med.status === 'Pending' || med.status === 'upcoming') && med.time
    );
    
    if (pendingMeds.length === 0) return 'None';
    
    // Find the next medication time
    const nextMed = pendingMeds.sort((a, b) => new Date(a.time) - new Date(b.time))[0];
    const medTime = new Date(nextMed.time);
    
    const diffMs = medTime - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
        return `In ${diffHours}h ${diffMinutes}m`;
    } else if (diffMinutes > 0) {
        return `In ${diffMinutes}m`;
    } else {
        return 'Now';
    }
}

function calculateAdherenceRate(medications) {
    // Simple calculation - you might want to use your Log table data
    const takenMeds = medications.filter(med => 
        med.status === 'Completed' || med.status === 'taken'
    ).length;
    
    if (medications.length === 0) return 0;
    
    return Math.round((takenMeds / medications.length) * 100);
}

async function loadTodayMedications() {
    try {
        const result = await apiGetTodayMedications();
        if (result.success) {
            const todayMeds = result.data.medications || [];
            renderTodayMedications(todayMeds);
        }
    } catch (error) {
        console.error('Error loading today medications:', error);
    }
}

function renderTodayMedications(medications) {
    const container = document.getElementById('today-medications');
    if (!container) {
        console.error('❌ Container #today-medications not found!');
        return;
    }
    
    console.log('📦 Medications received:', medications);
    
    // Group by time of day with debugging
    const morningMeds = medications.filter(med => {
        const isMorning = isMorningTime(med.time);
        console.log(`🌅 ${med.name} at ${med.time} -> Morning: ${isMorning}`);
        return isMorning;
    });
    
    const afternoonMeds = medications.filter(med => {
        const isAfternoon = isAfternoonTime(med.time);
        console.log(`☀️ ${med.name} at ${med.time} -> Afternoon: ${isAfternoon}`);
        return isAfternoon;
    });
    
    const eveningMeds = medications.filter(med => {
        const isEvening = isEveningTime(med.time);
        console.log(`🌙 ${med.name} at ${med.time} -> Evening: ${isEvening}`);
        return isEvening;
    });
    
    console.log('⏰ Grouped medications:', {
        morning: morningMeds.length,
        afternoon: afternoonMeds.length, 
        evening: eveningMeds.length
    });
    
    container.innerHTML = `
        ${renderTimeSlot('Morning', morningMeds)}
        ${renderTimeSlot('Afternoon', afternoonMeds)}
        ${renderTimeSlot('Evening', eveningMeds)}
    `;
    
    console.log('✅ HTML updated, attaching event listeners...');
    attachMedicationActionListeners();
}

function renderTimeSlot(timeOfDay, medications) {
    if (medications.length === 0) {
        return `
            <div class="medication-time-group">
                <h4>${timeOfDay}</h4>
                <div class="no-medications">No medications scheduled</div>
            </div>
        `;
    }
    
    return `
        <div class="medication-time-group">
            <h4>${timeOfDay}</h4>
            ${medications.map(med => {
                // Format the actual time from the database
                const medTime = new Date(med.time);
                const displayTime = medTime.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                });
                
                const isTaken = med.status === 'completed' || med.status === 'taken';
                const buttonText = isTaken ? 'Taken' : 'Mark Taken';
                const buttonClass = isTaken ? 'taken' : 'pending';
                
                return `
                <div class="medication-item">
                    <div class="med-info">
                        <div class="med-icon"></div>
                        <div>
                            <h5>${med.name}</h5>
                            <p>${med.dosage} · ${displayTime}</p>
                            ${med.notes ? `<span class="med-notes">${med.notes}</span>` : ''}
                        </div>
                    </div>
                    <button class="status-btn ${buttonClass}" 
                            data-id="${med.id}">
                        ${buttonText}
                    </button>
                </div>
                `;
            }).join('')}
        </div>
    `;
}
function isMorningTime(timeString) {
    try {
        const time = new Date(timeString);
        const hour = time.getHours();
        console.log(`🌅 ${timeString} -> hour: ${hour}, isMorning: ${hour >= 6 && hour < 12}`);
        return hour >= 6 && hour < 12;
    } catch (e) {
        console.error('Error parsing morning time:', timeString, e);
        return false;
    }
}

function isAfternoonTime(timeString) {
    try {
        const time = new Date(timeString);
        const hour = time.getHours();
        console.log(`☀️ ${timeString} -> hour: ${hour}, isAfternoon: ${hour >= 12 && hour < 17}`);
        return hour >= 12 && hour < 17;
    } catch (e) {
        console.error('Error parsing afternoon time:', timeString, e);
        return false;
    }
}

function isEveningTime(timeString) {
    try {
        const time = new Date(timeString);
        const hour = time.getHours();
        console.log(`🌙 ${timeString} -> hour: ${hour}, isEvening: ${hour >= 17 || hour < 6}`);
        return hour >= 17 || hour < 6;
    } catch (e) {
        console.error('Error parsing evening time:', timeString, e);
        return false;
    }
}

// Update your existing setupEventListeners to handle real data
function setupEventListeners() {
    // Mark medication as taken
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('status-btn') && e.target.classList.contains('pending')) {
            const medicineId = e.target.getAttribute('data-id');
            markMedicationAsTaken(medicineId, e.target);
        }
    });

    // ... rest of your existing event listeners
}

async function markMedicationAsTaken(medicineId, button) {
    try {
        console.log('🔄 Marking medication as taken:', medicineId);
        const result = await apiUpdateMedicationStatus(medicineId, 'taken');
        console.log('📊 API response:', result);
        
        if (result.success) {
            button.textContent = 'Taken';
            button.classList.remove('pending');
            button.classList.add('taken');
            button.disabled = true;
            
            // Update dashboard stats
            await updateDashboardStats();
            showToast('Medication marked as taken!');
        } else {
            console.error('❌ API returned error:', result.error);
            showToast('Error updating medication status', 'error');
        }
    } catch (error) {
        console.error('💥 Error marking medication as taken:', error);
        showToast('Error updating medication status', 'error');
    }
}

function attachMedicationActionListeners() {
    const markTakenButtons = document.querySelectorAll('.status-btn.pending');
    console.log(`🎯 Found ${markTakenButtons.length} pending buttons to attach listeners to`);
    
    markTakenButtons.forEach(button => {
        // Remove existing listeners to prevent duplicates
        button.replaceWith(button.cloneNode(true));
    });
    
    // Re-select after cloning
    const newButtons = document.querySelectorAll('.status-btn.pending');
    newButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const medicineId = this.getAttribute('data-id');
            console.log('🖱️ Mark as taken clicked for medicine:', medicineId);
            if (medicineId) {
                markMedicationAsTaken(medicineId, this);
            }
        });
    });
}

// ==================== ADMIN DASHBOARD ====================
// Only run this code on the admin dashboard page
if (window.location.pathname.includes("admin.html")) {

    // Sidebar navigation handling
    const navLinks = document.querySelectorAll('.sidebar ul li');
    const sections = document.querySelectorAll('.main-content section');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active state from all links
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show corresponding section
            const targetId = link.dataset.target;
            sections.forEach(section => {
                section.style.display = (section.id === targetId) ? 'block' : 'none';
            });
        });
    });

    // Example: Delete user (just for frontend demo)
    document.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const row = btn.closest('tr');
            if (confirm("Are you sure you want to delete this user?")) {
                row.remove();
                alert("User deleted!");
            }
        });
    });

    // Example: Add advertisement
    const adForm = document.getElementById('ad-form');
    if (adForm) {
        adForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const adTitle = document.getElementById('ad-title').value.trim();
            const adDesc = document.getElementById('ad-desc').value.trim();

            if (!adTitle || !adDesc) {
                alert("Please fill out all fields.");
                return;
            }

            alert(`Advertisement "${adTitle}" added successfully!`);
            adForm.reset();
        });
    }

    // Example: Display simple stats dynamically
    const totalUsers = document.getElementById('total-users');
    const activeAds = document.getElementById('active-ads');
    const dbEntries = document.getElementById('db-entries');

    if (totalUsers && activeAds && dbEntries) {
        totalUsers.textContent = "126";
        activeAds.textContent = "18";
        dbEntries.textContent = "547";
    }
}
// ==================== MY DOCTORS PAGE FUNCTIONALITY ====================
function initMyDoctorsPage() {
    if (!window.location.pathname.includes('doctors.html')) {
        return;
    }

    console.log("Initializing My Doctors page...");
    
    // Simple user info update
    const userData = getUserData();
    const userName = userData.name || 'User';
    
    const usernameElement = document.getElementById('username');
    if (usernameElement) {
        usernameElement.textContent = userName;
    }
    
    // Update avatar if exists
    const avatar = document.querySelector('.avatar-placeholder');
    if (avatar && userName) {
        const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
        avatar.textContent = initials;
    }
     console.log("📋 Loading doctors...");
    loadDoctors();
    
    console.log("🔄 Setting up modal...");
    setupDoctorModal();
    
    console.log("✅ My Doctors page initialized");

    loadDoctors();
    setupDoctorModal();
}

let doctors = [];
let editingDoctorId = null;

async function loadDoctors() {
   console.log("📥 Loading doctors from localStorage...");
    
    const savedDoctors = localStorage.getItem('meditrack-doctors');
    console.log("📄 Raw saved data:", savedDoctors);
    
    doctors = savedDoctors ? JSON.parse(savedDoctors) : [];
    
    console.log(`✅ Loaded ${doctors.length} doctors:`, doctors);
    renderDoctors();
}


function renderDoctors() {
    const doctorsGrid = document.getElementById('doctorsGrid');
    if (!doctorsGrid) return;

    doctorsGrid.innerHTML = '';

    if (doctors.length === 0) {
        doctorsGrid.innerHTML = `
            <div class="no-doctors">
                <i class="fas fa-user-md"></i>
                <p>No doctors added yet. Add your first doctor to get started!</p>
                <button class="add-doctor-main-btn" id="addDoctorEmptyBtn">
                    <i class="fas fa-plus"></i> Add Your First Doctor
                </button>
            </div>
        `;
        
        // Add event listener to the empty state button
        const addBtn = document.getElementById('addDoctorEmptyBtn');
        if (addBtn) {
            addBtn.addEventListener('click', openDoctorModal);
        }
    } else {
        doctors.forEach(doctor => {
            const card = document.createElement('div');
            card.className = 'doctor-card';
            
            card.innerHTML = `
                <div class="doctor-header">
                    <h3 class="doctor-name">${doctor.name}</h3>
                    <span class="doctor-specialty">${doctor.specialty || 'General Practitioner'}</span>
                </div>
                <div class="doctor-contact">
                    ${doctor.phone ? `
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <span>${doctor.phone}</span>
                    </div>` : ''}
                    ${doctor.email ? `
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>${doctor.email}</span>
                    </div>` : ''}
                    ${doctor.address ? `
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${doctor.address}</span>
                    </div>` : ''}
                </div>
                <div class="doctor-actions">
                    <button class="doctor-action-btn edit-doctor-btn" data-id="${doctor.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="doctor-action-btn delete-doctor-btn" data-id="${doctor.id}">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </div>
            `;

            doctorsGrid.appendChild(card);
        });
    }

    updateDoctorsStats();
    attachDoctorActionListeners();
}

function updateDoctorsStats() {
  
    // Update doctors count
    const doctorsCount = document.getElementById('doctorsCount');
    const totalDoctors = document.getElementById('totalDoctors');
    const specialtiesCount = document.getElementById('specialtiesCount');
    
    if (doctorsCount) doctorsCount.textContent = `${doctors.length} doctor${doctors.length !== 1 ? 's' : ''}`;
    if (totalDoctors) totalDoctors.textContent = doctors.length;
    
    // Count unique specialties and update tooltip
    const specialties = new Set(doctors.map(doctor => doctor.specialty).filter(Boolean));
    if (specialtiesCount) {
        specialtiesCount.textContent = specialties.size;
        // Add title for better UX
        specialtiesCount.title = `Unique specialties: ${Array.from(specialties).join(', ') || 'None'}`;
    }
    
    // Update recent activity
    updateRecentActivity();
    
    console.log(`📊 Stats: ${doctors.length} doctors, ${specialties.size} specialties`);
}


function updateRecentActivity() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    if (doctors.length === 0) {
        activityList.innerHTML = `
            <div class="activity-item">
                <i class="fas fa-info-circle"></i>
                <span>No recent activity</span>
            </div>
        `;
        return;
    }
    
    // Show last 3 doctors added as recent activity
    const recentDoctors = doctors.slice(-3).reverse();
    activityList.innerHTML = recentDoctors.map(doctor => `
        <div class="activity-item">
            <i class="fas fa-user-plus"></i>
            <span>Added ${doctor.name}</span>
        </div>
    `).join('');
}

function setupDoctorModal() {
    console.log("Setting up doctor modal...");
    
    const modal = document.getElementById('doctorModal');
    const closeBtn = document.getElementById('closeDoctorModal');
    const cancelBtn = document.getElementById('cancelModalDoctorBtn');
    const openBtn = document.getElementById('openDoctorModal');
    const form = document.getElementById('doctorModalForm');

    console.log("Modal elements:", { modal, openBtn, form });

    if (openBtn) {
        console.log("Adding click listener to open button");
        openBtn.addEventListener('click', openDoctorModal);
    } else {
        console.error("Open button not found!");
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeDoctorModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeDoctorModal);
    }

    if (form) {
        form.addEventListener('submit', handleDoctorFormSubmit);
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeDoctorModal();
            }
        });
    }
}

function openDoctorModal() {
    const modal = document.getElementById('doctorModal');
    const modalTitle = document.getElementById('doctorModalTitle');
    const submitBtn = document.getElementById('submitModalDoctorBtn');
    
    if (modal) {
        modal.style.display = 'flex';
        editingDoctorId = null;
        modalTitle.textContent = 'Add New Doctor';
        submitBtn.textContent = 'Add Doctor';
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Doctor';
        
        // Reset form
        const form = document.getElementById('doctorModalForm');
        if (form) form.reset();
    }
}

function closeDoctorModal() {
    const modal = document.getElementById('doctorModal');
    if (modal) {
        modal.style.display = 'none';
    }
    editingDoctorId = null;
}

function handleDoctorFormSubmit(e) {
    e.preventDefault();
    console.log("📋 Form submitted!");

    const name = document.getElementById('modalDoctorName').value.trim();
    const specialty = document.getElementById('modalDoctorSpecialty').value.trim();
    const phone = document.getElementById('modalDoctorPhone').value.trim();
    const email = document.getElementById('modalDoctorEmail').value.trim();
    const address = document.getElementById('modalDoctorAddress').value.trim();

    console.log("Form data:", { name, specialty, phone, email, address });

    if (!name) {
        alert('Please enter doctor name');
        return;
    }

    const doctorData = {
        name,
        specialty: specialty || 'General Practitioner',
        phone,
        email,
        address
    };

    console.log("Processing doctor data:", doctorData);

    if (editingDoctorId) {
        console.log("Updating existing doctor:", editingDoctorId);
        updateDoctor(editingDoctorId, doctorData);
    } else {
        console.log("Adding new doctor");
        addDoctor(doctorData);
    }
}

function addDoctor(doctorData) {
    console.log("📝 Adding new doctor:", doctorData);
    
    const newDoctor = {
        id: Date.now(),
        ...doctorData,
        createdAt: new Date().toISOString()
    };

    doctors.push(newDoctor);
    console.log("💾 Saving doctors to localStorage:", doctors);
    saveDoctors();
    
    console.log("🔄 Re-rendering doctors list");
    renderDoctors();
    closeDoctorModal();
    
    showNotification('Doctor added successfully!', 'success');
}

function updateDoctor(doctorId, doctorData) {
    const doctorIndex = doctors.findIndex(d => d.id === doctorId);
    if (doctorIndex !== -1) {
        doctors[doctorIndex] = { ...doctors[doctorIndex], ...doctorData };
        saveDoctors();
        renderDoctors();
        closeDoctorModal();
        
        showNotification('Doctor updated successfully!', 'success');
    }
}

function deleteDoctor(doctorId) {
    if (confirm('Are you sure you want to delete this doctor?')) {
        doctors = doctors.filter(d => d.id !== doctorId);
        saveDoctors();
        renderDoctors();
        
        showNotification('Doctor deleted successfully!', 'success');
    }
}

function editDoctor(doctorId) {
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) return;

    editingDoctorId = doctorId;

    const modal = document.getElementById('doctorModal');
    const modalTitle = document.getElementById('doctorModalTitle');
    const submitBtn = document.getElementById('submitModalDoctorBtn');
    
    if (modal) {
        modal.style.display = 'flex';
        modalTitle.textContent = 'Edit Doctor';
        submitBtn.textContent = 'Update Doctor';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Doctor';

        // Pre-fill the form
        document.getElementById('modalDoctorName').value = doctor.name;
        document.getElementById('modalDoctorSpecialty').value = doctor.specialty || '';
        document.getElementById('modalDoctorPhone').value = doctor.phone || '';
        document.getElementById('modalDoctorEmail').value = doctor.email || '';
        document.getElementById('modalDoctorAddress').value = doctor.address || '';
    }
}

function saveDoctors() {
    console.log("💾 Saving doctors:", doctors);
    localStorage.setItem('meditrack-doctors', JSON.stringify(doctors));
    
    // Verify it was saved
    const saved = localStorage.getItem('meditrack-doctors');
    console.log("✅ Verified saved data:", saved);
}


function attachDoctorActionListeners() {
    // Edit buttons
    document.querySelectorAll('.edit-doctor-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const doctorId = parseInt(this.getAttribute('data-id'));
            editDoctor(doctorId);
        });
    });

    // Delete buttons
    document.querySelectorAll('.delete-doctor-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const doctorId = parseInt(this.getAttribute('data-id'));
            deleteDoctor(doctorId);
        });
    });
}


// ==================== MAIN INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    console.log("=== DEBUG: Page loaded ===");
    console.log("Current page:", window.location.pathname);
    
    // Initialize everything
    initMedicineTracker();
    initPasswordToggle();
    initAuthForms();
    initSmoothScrolling();
    initMyMedicationsPage();
    initMyDoctorsPage();


    // User Dashboard Initialization
    if (window.location.pathname.includes("dashboard.html")) {
        initDashboard().then(() => {
            console.log("Dashboard initialized");
            setupNavigation();
            setupEventListeners();
        }
        ).catch(err => {
            console.error("Error initializing dashboard:", err);
        });
    }

    // Schedule Links
    const scheduleLinks = document.querySelectorAll('a[data-section="schedule"], a.view-all[data-section="schedule"]');
    scheduleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'medicine_schedule_overall.html';
        });
    });
    // Today's Schedule Links - For the "View All" in Today's Medications box
    const todayLinks = document.querySelectorAll('a.view-all[data-section="today"]');
    todayLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'medicine_schedule.html';
        });
    });
});
