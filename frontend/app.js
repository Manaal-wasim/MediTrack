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
