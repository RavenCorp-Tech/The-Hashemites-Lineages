/**
 * Profiles Management System
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize profiles grid
    loadProfiles();
    
    // Initialize Bootstrap modals
    const profilePreviewModal = new bootstrap.Modal(document.getElementById('profilePreviewModal'));
});

/**
 * Load all profiles into the grid
 */
function loadProfiles() {
    const profilesGrid = document.querySelector('.profiles-grid');
    if (!profilesGrid) return;
    
    // Get certificates data (either from localStorage or built-in data)
    const storedCertificates = localStorage.getItem('certificatesData');
    const certificates = storedCertificates ? JSON.parse(storedCertificates) : certificatesData;
    
    // Create profile cards
    certificates.forEach(cert => {
        const profileCard = createProfileCard(cert);
        profilesGrid.appendChild(profileCard);
    });
}

/**
 * Create a profile card element
 * @param {Object} certificate - The certificate data
 * @returns {HTMLElement} The profile card element
 */
function createProfileCard(certificate) {
    const card = document.createElement('div');
    card.className = 'profile-card';
    
    // Generate secure profile URL with token
    const profileToken = btoa(certificate.serialNumber);
    const profileUrl = `${window.location.origin}/profile/${profileToken}`;
    
    // Create QR code URL with enhanced data
    const qrData = {
        profileUrl: profileUrl,
        certificate: {
            serialNumber: certificate.serialNumber,
            ar: {
                name: certificate.nameAr,
                certificateType: certificate.certificateTypeAr,
                date: certificate.dateAr,
                status: certificate.statusAr
            },
            en: {
                name: certificate.nameEn,
                certificateType: certificate.certificateTypeEn,
                date: certificate.dateEn,
                status: certificate.statusEn
            }
        }
    };
    
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(qrData))}`;
    
    card.innerHTML = `
        <div class="profile-header">
            <h3 class="content-en">${certificate.nameEn}</h3>
            <h3 class="content-ar">${certificate.nameAr}</h3>
        </div>
        
        <div class="profile-content">
            <div class="profile-info">
                <p><strong>Serial Number:</strong> ${certificate.serialNumber}</p>
                <p><strong>Certificate Type:</strong> ${certificate.certificateTypeEn}</p>
                <p><strong>Date:</strong> ${certificate.dateEn}</p>
                <p class="profile-status status-valid">${certificate.statusEn}</p>
            </div>
            
            <div class="qr-preview">
                <img src="${qrCodeUrl}" alt="Profile QR Code">
                <p class="small text-muted">
                    <span class="content-en">Scan to view secure profile</span>
                    <span class="content-ar">امسح للوصول إلى الملف الشخصي</span>
                </p>
            </div>
        </div>
        
        <div class="profile-actions">
            <a href="/profile/${profileToken}" target="_blank" class="btn btn-primary btn-sm">
                <span class="content-en">View Profile</span>
                <span class="content-ar">عرض الملف</span>
            </a>
            <button class="btn btn-secondary btn-sm" onclick="downloadQR('${qrCodeUrl}', '${certificate.serialNumber}')">
                <i class="fas fa-download"></i>
                <span class="content-en">Download QR</span>
                <span class="content-ar">تحميل QR</span>
            </button>
        </div>
    `;
    
    return card;
}

/**
 * Preview a profile by redirecting to the profile page
 * @param {string} serialNumber - The certificate serial number
 */
function previewProfile(serialNumber) {
    // Generate the profile token and URL
    const profileToken = btoa(serialNumber);
    const profileUrl = `${window.location.origin}/profile/${profileToken}`;
    
    // Open the profile page in a new tab
    window.open(profileUrl, '_blank');
}

/**
 * Download the QR code image
 * @param {string} qrUrl - The URL of the QR code image
 * @param {string} serialNumber - The certificate serial number
 */
function downloadQR(qrUrl, serialNumber) {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `profile-qr-${serialNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Update the profiles view when certificates data changes
 */
window.addEventListener('storage', function(e) {
    if (e.key === 'certificatesData') {
        // Reload profiles when data changes
        const profilesGrid = document.querySelector('.profiles-grid');
        if (profilesGrid) {
            profilesGrid.innerHTML = '';
            loadProfiles();
        }
    }
});