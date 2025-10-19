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

// Login Form Handling
const loginForm = document.querySelector('.auth-form');
if (loginForm && window.location.pathname.includes('login.html')) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault(); // Prevent default form submission

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        // TODO: Replace with actual login API call
    });
}

// Signup Form Handling
if (loginForm && window.location.pathname.includes('signup.html')) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault(); // Prevent default form submission

        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        if (!fullname || !email || !password || !confirmPassword) {
            alert('Please fill in all required fields.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // TODO: Replace with actual signup API call
    });
}
//---------------- MAIN HOMEPAGE SCRIPT----------------
// Function to enable smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
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
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
});
// -------------------- ADMIN DASHBOARD SCRIPT --------------------

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
// -------------user dashboard Script------------------
// Meditrack Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initDashboard();
    
    // Setup navigation
    setupNavigation();
    
    // Setup event listeners
    setupEventListeners();
});

function initDashboard() {
    // Load user data
    const userData = getUserData();
    document.getElementById('welcome-message').textContent = `Welcome back, ${userData.name || 'User'}!`;
    document.getElementById('username').textContent = userData.name || 'User';
    
    // Update avatar with initials
    updateUserAvatar(userData.name);
    
    // Set current date
    updateCurrentDate();
    
    // Load dashboard stats
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
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show section based on data attribute
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to log out?')) {
            // Clear user session and redirect to login
            localStorage.removeItem('meditrack-user');
            window.location.href = 'login.html';
        }
    });
}

function showSection(section) {
    // In a real app, this would load different sections
    // For now, we'll just show a message
    const sections = {
        'dashboard': 'Dashboard content is already visible',
        'medications': 'Loading medications management...',
        'schedule': 'Loading medication schedule...',
        'doctors': 'Loading doctors information...',
        'summary': 'Loading adherence summary...'
    };
    
    showToast(sections[section] || 'Section loading...');
}

function setupEventListeners() {
    // Mark medication as taken
    document.querySelectorAll('.status-btn.pending').forEach(btn => {
        btn.addEventListener('click', function() {
            const medicationName = this.closest('.medication-item').querySelector('h5').textContent;
            this.textContent = 'Taken';
            this.classList.remove('pending');
            this.classList.add('taken');
            this.disabled = true;
            
            // Update adherence stats
            updateAdherenceStats();
            
            showToast(`${medicationName} marked as taken!`);
        });
    });
    
    // Quick action buttons
    document.getElementById('add-medication-btn').addEventListener('click', function() {
        showToast('Add medication feature opening...');
    });
    
    document.getElementById('log-symptoms-btn').addEventListener('click', function() {
        showToast('Symptom logging feature opening...');
    });
    
    document.getElementById('schedule-appointment-btn').addEventListener('click', function() {
        showToast('Appointment scheduling feature opening...');
    });
    
    document.getElementById('view-reports-btn').addEventListener('click', function() {
        showToast('Health reports feature opening...');
    });
    
    document.getElementById('emergency-contact-btn').addEventListener('click', function() {
        showToast('Emergency contacts: Dr. Chen (555-0123)');
    });
    
    document.getElementById('medication-refill-btn').addEventListener('click', function() {
        showToast('Refill request sent to pharmacy!');
    });
    
    // Appointment actions
    document.querySelectorAll('.appointment-action').forEach(btn => {
        btn.addEventListener('click', function() {
            const doctorName = this.closest('.appointment-item').querySelector('h5').textContent;
            showToast(`Viewing details for appointment with ${doctorName}`);
        });
    });
    
    // View all links
    document.querySelectorAll('.view-all').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.closest('.content-card').querySelector('h3').textContent;
            showToast(`Viewing all ${section.toLowerCase()}`);
        });
    });
}

function updateAdherenceStats() {
    // Update adherence rate
    const adherenceRate = document.getElementById('adherence-rate');
    const currentRate = parseInt(adherenceRate.textContent);
    const newRate = Math.min(100, currentRate + 2);
    adherenceRate.textContent = `${newRate}%`;
    
    // Update health score
    const healthScore = document.getElementById('health-score');
    const currentScore = parseInt(healthScore.textContent);
    const newScore = Math.min(100, currentScore + 1);
    healthScore.textContent = newScore;
    
    // Update progress bars
    updateProgressBars();
}

function updateProgressBars() {
    const adherenceRate = parseInt(document.getElementById('adherence-rate').textContent);
    const progressFill = document.querySelector('.progress-fill.excellent');
    if (progressFill) {
        progressFill.style.width = `${adherenceRate}%`;
    }
}

function updateDashboardStats() {
    // This would fetch real data from your backend
    const medications = JSON.parse(localStorage.getItem('meditrack-medications') || '[]');
    
    // Update active medications count
    document.getElementById('active-meds-count').textContent = medications.length || 5;
    
    // Update upcoming doses (simplified logic)
    const upcomingDoses = medications.filter(med => {
        // Simple logic to determine if medication is upcoming today
        return true;
    }).length;
    document.getElementById('upcoming-doses').textContent = upcomingDoses || 3;
}

function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('status-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'status-toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.innerHTML = `<span>${message}</span>`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
// Add random motivational quotes
function loadMotivationalQuotes() {
    const quotes = [
        {
            text: "Your health is an investment, not an expense. Every dose taken is a step toward better days.",
            icon: "💪"
        },
        {
            text: "Consistency is the key to success. You've maintained 92% adherence this week!",
            icon: "🌟"
        },
        {
            text: "Small steps every day lead to big results. Keep going!",
            icon: "🚶‍♂️"
        },
        {
            text: "Your commitment to your health is inspiring. You're doing amazing!",
            icon: "❤️"
        },
        {
            text: "Every medication taken on time is a victory. Celebrate your progress!",
            icon: "🎉"
        }
    ];
    
    // Shuffle quotes and take first 2
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

// Call this in your initDashboard function
function initDashboard() {
    // ... existing code ...
    loadMotivationalQuotes(); // Add this line
}

// Helper function to get user data (replace with actual implementation)
function getUserData() {
    return JSON.parse(localStorage.getItem('meditrack-user') || '{"name": "Sarah Johnson"}');
}

// Initialize progress bars on load
function initializeProgressBars() {
    const progressItems = document.querySelectorAll('.progress-item');
    progressItems.forEach(item => {
        const value = item.querySelector('.progress-value').textContent;
        const fill = item.querySelector('.progress-fill');
        
        if (value.includes('%')) {
            const percentage = parseInt(value);
            fill.style.width = `${percentage}%`;
        }
    });
}

// Call this when the page loads
initializeProgressBars();