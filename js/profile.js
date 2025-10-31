/**
 * Secure Profile Access System
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the profile token from URL
    const pathParts = window.location.pathname.split('/');
    const profileToken = pathParts[pathParts.indexOf('profile') + 1];
    
    if (!profileToken) {
        showError('Invalid profile access');
        return;
    }
    
    try {
        // Decode the profile token (use proper decryption in production)
        const serialNumber = atob(profileToken);
        loadProfile(serialNumber);
    } catch (error) {
        showError('Invalid profile access');
    }
});

/**
 * Load profile data based on serial number
 * @param {string} serialNumber - The certificate serial number
 */
function loadProfile(serialNumber) {
    const certificate = findCertificate(serialNumber);
    
    if (!certificate) {
        showError('Profile not found');
        return;
    }
    
    displayProfile(certificate);
}

/**
 * Display the profile data
 * @param {Object} certificate - The certificate data
 */
function displayProfile(certificate) {
    const profileContent = document.getElementById('profile-content');
    if (!profileContent) return;
    
    profileContent.innerHTML = `
        <div class="profile-header">
            <div class="content-ar rtl">
                <h1>${certificate.nameAr}</h1>
                <div class="certificate-details">
                    <p><strong>الرقم التسلسلي:</strong> ${certificate.serialNumber}</p>
                    <p><strong>نوع الشهادة:</strong> ${certificate.certificateTypeAr}</p>
                    <p><strong>التاريخ:</strong> ${certificate.dateAr}</p>
                    <p><strong>الحالة:</strong> ${certificate.statusAr}</p>
                </div>
            </div>
            
            <div class="content-en ltr">
                <h1>${certificate.nameEn}</h1>
                <div class="certificate-details">
                    <p><strong>Serial Number:</strong> ${certificate.serialNumber}</p>
                    <p><strong>Certificate Type:</strong> ${certificate.certificateTypeEn}</p>
                    <p><strong>Date:</strong> ${certificate.dateEn}</p>
                    <p><strong>Status:</strong> ${certificate.statusEn}</p>
                </div>
            </div>
        </div>
    `;
    
    // Add animation classes
    profileContent.classList.add('reveal-fade');
}

/**
 * Display error message
 * @param {string} message - The error message to display
 */
function showError(message) {
    const profileContent = document.getElementById('profile-content');
    if (!profileContent) return;
    
    profileContent.innerHTML = `
        <div class="error-message">
            <div class="content-ar rtl">
                <h2>خطأ في الوصول</h2>
                <p>عذراً، لا يمكن الوصول إلى هذا الملف الشخصي.</p>
            </div>
            <div class="content-en ltr">
                <h2>Access Error</h2>
                <p>Sorry, this profile cannot be accessed.</p>
            </div>
        </div>
    `;
}