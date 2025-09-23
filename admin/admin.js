/**
 * Admin Login and Authentication
 * The Hashemites Lineages Website
 */

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('admin-login-form');
    const loginError = document.getElementById('login-error');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const passwordField = document.getElementById('password');
    
    // Set the copyright year in footer
    const yearElements = document.querySelectorAll('#year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => el.textContent = currentYear);
    
    // Admin credentials (in a real application, these would be stored securely on the server)
    const adminCredentials = {
        username: 'hashemitesAdmin', // Change this to your preferred username
        password: 'SecurePassword2025!' // Change this to your preferred password
    };
    
    // Password visibility toggle
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        
        // Change the eye icon
        const eyeIcon = this.querySelector('i');
        eyeIcon.classList.toggle('fa-eye');
        eyeIcon.classList.toggle('fa-eye-slash');
    });
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Check credentials
        if (username === adminCredentials.username && password === adminCredentials.password) {
            // Set session to indicate logged in state
            sessionStorage.setItem('adminLoggedIn', 'true');
            sessionStorage.setItem('adminUsername', username);
            
            // Redirect to admin dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Show error message
            loginError.classList.remove('d-none');
            
            // Reset form
            loginForm.reset();
            
            // Focus on username field
            document.getElementById('username').focus();
        }
    });
});