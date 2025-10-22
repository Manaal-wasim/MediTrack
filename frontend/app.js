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

async function apiLogout() {
    try {
        await fetch(`${API_BASE_URL}/logout`, { method: 'POST' });
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
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

// ==================== MEDICINE TRACKER ====================
// Mock data - This would come from your Python backend in a real application
let medicines = [
    {
        id: 1,
        name: "Aspirin",
        dosage: "100mg",
        time: "08:00",
        frequency: "once",
        notes: "Take after breakfast",
        status: "taken"
    },
    {
        id: 2,
        name: "Vitamin D",
        dosage: "1000 IU",
        time: "12:00",
        frequency: "once",
        notes: "With lunch",
        status: "upcoming"
    },
    {
        id: 3,
        name: "Blood Pressure Medication",
        dosage: "10mg",
        time: "20:00",
        frequency: "once",
        notes: "",
        status: "upcoming"
    }
];

// DOM Elements - declare them but don't assign yet
let medicineList, emptyState, addMedicineBtn, addMedicineEmptyBtn, medicineModal, closeModalBtn, cancelBtn, medicineForm, notification;
let editingMedicineId = null;

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

    renderMedicineList();

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

        // Determine status indicator and class
        let statusClass, statusIcon;
        if (medicine.status === 'taken') {
            statusClass = 'status-taken';
            statusIcon = 'fas fa-check-circle';
        } else if (medicine.status === 'upcoming') {
            statusClass = 'status-upcoming';
            statusIcon = 'far fa-clock';
        } else {
            statusClass = 'status-missed';
            statusIcon = 'fas fa-exclamation-circle';
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
                        <i class="${statusIcon}"></i>${medicine.status.charAt(0).toUpperCase() + medicine.status.slice(1)}
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
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function openModal() {
    if (medicineModal) medicineModal.style.display = 'flex';
}

function closeModal() {
    if (medicineModal) medicineModal.style.display = 'none';
    if (medicineForm) medicineForm.reset();
}

function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('medicineName').value;
    const dosage = document.getElementById('dosage').value;
    const frequency = document.getElementById('frequency').value;
    const time = document.getElementById('scheduleTime').value;
    const notes = document.getElementById('notes').value;

    // Create new medicine object
    const newMedicine = {
        id: Date.now(), // Simple ID generation - would be handled by backend in real app
        name,
        dosage,
        frequency,
        time,
        notes,
        status: 'upcoming'
    };

    // In a real application, you would send this to your Python backend
    // Example: fetch('/api/medicines', { method: 'POST', body: JSON.stringify(newMedicine) })

    // For now, we'll just add it to our local array
    medicines.push(newMedicine);

    // Re-render the list
    renderMedicineList();

    // Show success notification
    showNotification('Medicine added successfully!', 'success');

    // Close the modal
    closeModal();
}

function markMedicineAsTaken(id) {
    const medicine = medicines.find(m => m.id === id);
    if (medicine) {
        medicine.status = 'taken';
        renderMedicineList();
        showNotification('Medicine marked as taken!', 'success');
    }
}

function deleteMedicine(id) {
    if (confirm('Are you sure you want to delete this medicine?')) {
        // In a real application, you would send a DELETE request to your Python backend
        // Example: fetch(`/api/medicines/${id}`, { method: 'DELETE' })

        medicines = medicines.filter(m => m.id !== id);
        renderMedicineList();
        showNotification('Medicine deleted successfully!', 'success');
    }
}

function showNotification(message, type) {
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
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
    document.getElementById('frequency').value = medicine.frequency;
    document.getElementById('scheduleTime').value = medicine.time;
    document.getElementById('notes').value = medicine.notes;
}

// ==================== USER DASHBOARD ====================
function getUserData() {
    return JSON.parse(localStorage.getItem('user') || '{}');
}

function initDashboard() {
    const userData = getUserData();
    const userName = userData.name || 'User';
    
    document.getElementById('welcome-message').textContent = `Welcome back, ${userName}!`;
    document.getElementById('username').textContent = userName;
    updateUserAvatar(userName);
    updateCurrentDate();
    updateDashboardStats();
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

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a[data-section]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    document.getElementById('logout-btn').addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        }
    });
}

function showSection(section) {
    const sections = {
        'dashboard': 'Dashboard overview with today\'s medications and adherence',
        'medications': 'Manage your medications - add, edit, or remove',
        'schedule': 'View and manage your medication schedule',
        'doctors': 'Manage your doctors and their contact information',
        'adherence': 'View detailed medication adherence reports',
        'upcoming': 'See all upcoming medications for the week'
    };
    showToast(`Loading ${sections[section] || 'section'}...`);
}

function setupEventListeners() {
    // Mark medication as taken/missed
    document.querySelectorAll('.status-btn.pending').forEach(btn => {
        btn.addEventListener('click', function () {
            const medicationName = this.closest('.medication-item').querySelector('h5').textContent;
            this.textContent = 'Taken';
            this.classList.remove('pending');
            this.classList.add('taken');
            this.disabled = true;
            updateAdherenceStats();
            showToast(`${medicationName} marked as taken!`);
        });
    });

    // Quick actions
    document.getElementById('add-medication-btn').addEventListener('click', function () {
        showToast('Add medication feature opening...');
    });

    document.getElementById('add-doctor-btn').addEventListener('click', function () {
        showToast('Add doctor feature opening...');
    });

    document.getElementById('search-medications-btn').addEventListener('click', function () {
        showToast('Search medications by name or filter by time');
    });

    // Doctor actions
    document.querySelectorAll('.appointment-action').forEach(btn => {
        btn.addEventListener('click', function () {
            const doctorName = this.closest('.appointment-item').querySelector('h5').textContent;
            showToast(`Editing ${doctorName}'s information`);
        });
    });

    // View all links
    document.querySelectorAll('.view-all').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
}

function updateAdherenceStats() {
    const adherenceRate = document.getElementById('adherence-rate');
    const currentRate = parseInt(adherenceRate.textContent);
    const newRate = Math.min(100, currentRate + 2);
    adherenceRate.textContent = `${newRate}%`;
    updateProgressBars();
}

function updateProgressBars() {
    const adherenceRate = parseInt(document.getElementById('adherence-rate').textContent);
    document.querySelector('.progress-fill.excellent').style.width = `${adherenceRate}%`;
}

function updateDashboardStats() {
    const medications = JSON.parse(localStorage.getItem('meditrack-medications') || '[]');
    document.getElementById('active-meds-count').textContent = medications.length || 5;

    const doctors = JSON.parse(localStorage.getItem('meditrack-doctors') || '[]');
    document.getElementById('doctors-count').textContent = doctors.length || 2;
}

function loadMotivationalQuotes() {
    const quotes = [
        { text: "Your health is an investment, not an expense. Every dose taken is a step toward better days.", icon: "💪" },
        { text: "Consistency is the key to success. You've maintained 92% adherence this week!", icon: "🌟" },
        { text: "Small steps every day lead to big results. Keep going!", icon: "🚶‍♂️" },
        { text: "Your commitment to your health is inspiring. You're doing amazing!", icon: "❤️" }
    ];

    const shuffledQuotes = quotes.sort(() => 0.5 - Math.random()).slice(0, 2);
    const quoteContainer = document.querySelector('.motivational-quotes');

    if (quoteContainer) {
        quoteContainer.innerHTML = shuffledQuotes.map(quote => `
            <div class="quote-item">
                <div class="quote-icon">${quote.icon}</div>
                <div class="quote-content">
                    <p>"${quote.text}"</p>
                </div>
            </div>
        `).join('');
    }
}

function showToast(message) {
    let toast = document.getElementById('status-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'status-toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.innerHTML = `<span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => toast.classList.remove('show'), 3000);
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

// ==================== MAIN INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    console.log("=== DEBUG: Page loaded ===");
    console.log("Current page:", window.location.pathname);
    
    // Initialize everything
    initMedicineTracker();
    initPasswordToggle();
    initAuthForms();
    initSmoothScrolling();

    // User Dashboard Initialization
    if (window.location.pathname.includes("dashboard.html")) {
        initDashboard();
        setupNavigation();
        setupEventListeners();
        loadMotivationalQuotes();
    }

    // Schedule Links
    const scheduleLinks = document.querySelectorAll('a[data-section="schedule"], a.view-all[data-section="schedule"]');
    scheduleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'medicine_schedule_overall.html';
        });
    });
});