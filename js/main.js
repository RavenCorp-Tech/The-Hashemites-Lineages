/**
 * The Hashemites Lineages - Main JavaScript File
 * Handles language toggling, navigation, and interactive elements
 * Created: September 22, 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize language preference
    initLanguagePreference();
    
    // Setup mobile navigation
    setupMobileNav();
    
    // Setup tabs functionality
    setupTabs();
    
    // Setup verification form if it exists
    if (document.querySelector('.verification-form')) {
        setupVerificationForm();
    }
});

/**
 * Initialize language preference based on saved setting or browser default
 */
function initLanguagePreference() {
    // Check for saved language preference
    const savedLang = localStorage.getItem('language') || 'ar'; // Default to Arabic
    
    // Apply the language preference
    setLanguage(savedLang);
    
    // Add event listeners to language toggle buttons
    document.querySelectorAll('.lang-btn').forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
}

/**
 * Set the language for the site
 * @param {string} lang - Language code ('ar' or 'en')
 */
function setLanguage(lang) {
    // Save preference to localStorage
    localStorage.setItem('language', lang);
    
    // Update active state on buttons
    document.querySelectorAll('.lang-btn').forEach(button => {
        if (button.getAttribute('data-lang') === lang) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Show/hide content based on language
    document.querySelectorAll('.content-ar, .content-en').forEach(element => {
        if (element.classList.contains(`content-${lang}`)) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
    
    // Set RTL/LTR direction for the body
    if (lang === 'ar') {
        document.body.classList.add('rtl');
        document.body.classList.remove('ltr');
        document.dir = 'rtl';
    } else {
        document.body.classList.add('ltr');
        document.body.classList.remove('rtl');
        document.dir = 'ltr';
    }
    
    // Update document language
    document.documentElement.lang = lang;
}

/**
 * Setup mobile navigation functionality
 */
function setupMobileNav() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (mobileNavToggle && navList) {
        mobileNavToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            
            // Change button icon based on menu state
            const isOpen = navList.classList.contains('active');
            this.innerHTML = isOpen ? '&times;' : '&#9776;';
        });
        
        // Close mobile menu when a link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navList.classList.remove('active');
                mobileNavToggle.innerHTML = '&#9776;';
            });
        });
    }
}

/**
 * Setup tabs functionality for content sections
 */
function setupTabs() {
    // For each tab container in the page
    document.querySelectorAll('.tabs').forEach(tabContainer => {
        const tabItems = tabContainer.querySelectorAll('.tab-item');
        
        // Get the associated content container
        const contentContainer = tabContainer.nextElementSibling;
        if (!contentContainer || !contentContainer.classList.contains('tab-contents')) return;
        
        const contents = contentContainer.querySelectorAll('.tab-content');
        
        // Add click event to each tab
        tabItems.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabItems.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Hide all content
                contents.forEach(c => c.classList.remove('active'));
                // Show corresponding content
                if (contents[index]) {
                    contents[index].classList.add('active');
                }
            });
        });
        
        // Activate first tab by default if none is active
        if (!Array.from(tabItems).some(tab => tab.classList.contains('active'))) {
            tabItems[0]?.classList.add('active');
            contents[0]?.classList.add('active');
        }
    });
}

/**
 * Setup verification form functionality
 */
function setupVerificationForm() {
    const form = document.querySelector('.verification-form');
    const resultContainer = document.querySelector('.verification-result');
    
    if (form && resultContainer) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const serialNumber = form.querySelector('input[name="serial-number"]').value;
            const name = form.querySelector('input[name="name"]').value;
            
            // In a real application, this would be an API call
            // For demo purposes, we'll simulate a verification result
            verifyRecord(serialNumber, name)
                .then(result => {
                    // Update UI based on result
                    if (result.valid) {
                        resultContainer.classList.remove('result-invalid');
                        resultContainer.classList.add('result-valid');
                        resultContainer.innerHTML = `
                            <h3 class="content-ar">✓ تم التحقق بنجاح</h3>
                            <h3 class="content-en">✓ Verification Successful</h3>
                            <p class="content-ar">هذا السجل صحيح ومعتمد من قبل نقابة الأشراف</p>
                            <p class="content-en">This record is valid and certified by the Hashemite Union</p>
                        `;
                    } else {
                        resultContainer.classList.remove('result-valid');
                        resultContainer.classList.add('result-invalid');
                        resultContainer.innerHTML = `
                            <h3 class="content-ar">✗ فشل التحقق</h3>
                            <h3 class="content-en">✗ Verification Failed</h3>
                            <p class="content-ar">هذا السجل غير موجود في قاعدة البيانات</p>
                            <p class="content-en">This record does not exist in our database</p>
                        `;
                    }
                    
                    // Apply current language setting
                    const currentLang = localStorage.getItem('language') || 'ar';
                    setLanguage(currentLang);
                    
                    // Show result
                    resultContainer.style.display = 'block';
                });
        });
    }
}

/**
 * Simulate verification API call
 * In a real application, this would be a fetch to a backend API
 */
function verifyRecord(serialNumber, name) {
    return new Promise(resolve => {
        setTimeout(() => {
            // Demo validation - in real app this would check against a database
            // For demo, let's say NSC-2025-001 is a valid record
            const valid = serialNumber === 'NSC-2025-001';
            resolve({ valid });
        }, 1000);
    });
}

/**
 * Generate QR code for verification
 * Note: This would require a QR code library in production
 */
function generateQRCode(data) {
    // This is a placeholder for actual QR code generation
    console.log('Generating QR code for:', data);
    // In a real application, this would use a library like qrcode.js
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(data))}`;
}
