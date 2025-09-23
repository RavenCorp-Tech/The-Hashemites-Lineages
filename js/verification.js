/**
 * Certificate Verification System
 * The Hashemites Lineages Website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.verification-form');
    const resultDiv = document.querySelector('.verification-result');

    // Add event listener to the form
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get the serial number from the input
        const serialNumber = document.getElementById('serial-number').value.trim();
        
        // Display the results div
        resultDiv.style.display = 'block';
        
        // Check if the serial number exists in our database
        const certificate = findCertificate(serialNumber);
        
        if (certificate) {
            // Certificate found - display success message and details
            displaySuccess(certificate, resultDiv);
        } else {
            // Certificate not found - display error message
            displayError(resultDiv);
        }
        
        // Scroll to results
        setTimeout(() => {
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    });
});

/**
 * Find a certificate by its serial number
 * @param {string} serialNumber - The serial number to search for
 * @returns {Object|null} - The certificate object or null if not found
 */
function findCertificate(serialNumber) {
    // Convert to uppercase to make the search case-insensitive
    const searchTerm = serialNumber.toUpperCase();
    
    // Search for the certificate in our data
    return certificatesData.find(cert => cert.serialNumber.toUpperCase() === searchTerm) || null;
}

/**
 * Display success message and certificate details
 * @param {Object} certificate - The certificate data
 * @param {HTMLElement} resultDiv - The results container
 */
function displaySuccess(certificate, resultDiv) {
    resultDiv.innerHTML = `
        <div class="verification-success">
            <i class="fas fa-check-circle"></i>
            <div class="content-ar">تم التحقق بنجاح. الوثيقة صحيحة.</div>
            <div class="content-en">Verification successful. The document is authentic.</div>
            
            <div class="certificate-details mt-3">
                <div class="content-ar rtl">
                    <h4>تفاصيل الشهادة</h4>
                    <p><strong>الرقم التسلسلي:</strong> ${certificate.serialNumber}</p>
                    <p><strong>الاسم:</strong> ${certificate.nameAr}</p>
                    <p><strong>نوع الشهادة:</strong> ${certificate.certificateTypeAr}</p>
                    <p><strong>التاريخ:</strong> ${certificate.dateAr}</p>
                    <p><strong>الحالة:</strong> ${certificate.statusAr}</p>
                </div>
                
                <div class="content-en ltr">
                    <h4>Certificate Details</h4>
                    <p><strong>Serial Number:</strong> ${certificate.serialNumber}</p>
                    <p><strong>Name:</strong> ${certificate.nameEn}</p>
                    <p><strong>Certificate Type:</strong> ${certificate.certificateTypeEn}</p>
                    <p><strong>Date:</strong> ${certificate.dateEn}</p>
                    <p><strong>Status:</strong> ${certificate.statusEn}</p>
                </div>
            </div>
        </div>
    `;
    
    // Add animation class
    resultDiv.classList.add('reveal-fade');
}

/**
 * Display error message when certificate is not found
 * @param {HTMLElement} resultDiv - The results container
 */
function displayError(resultDiv) {
    resultDiv.innerHTML = `
        <div class="verification-failure">
            <i class="fas fa-times-circle"></i>
            <div class="content-ar">فشل التحقق. لم يتم العثور على الوثيقة.</div>
            <div class="content-en">Verification failed. Document not found.</div>
        </div>
    `;
    
    // Add animation class
    resultDiv.classList.add('reveal-fade');
}