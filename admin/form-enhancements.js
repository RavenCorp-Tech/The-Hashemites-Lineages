/**
 * Form Enhancement JavaScript
 * Adds interactive effects to make forms more modern
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add focus effects to form inputs
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
        // Focus effect - add focus class to parent form-group
        input.addEventListener('focus', function() {
            this.closest('.form-group').classList.add('focused');
        });
        
        // Remove focus class when input loses focus
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.closest('.form-group').classList.remove('focused');
            }
        });
        
        // Check if input already has value on page load
        if (input.value) {
            input.closest('.form-group').classList.add('focused');
        }
    });
    
    // Add fade-in animation to modal when shown
    const certificateModal = document.getElementById('certificate-modal');
    if (certificateModal) {
        certificateModal.addEventListener('show.bs.modal', function() {
            setTimeout(() => {
                document.querySelector('.certificate-form').classList.add('show');
            }, 150);
        });
    }
    
    // Add animation to modal buttons
    const modalButtons = document.querySelectorAll('.modal-footer .admin-action-btn');
    modalButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});