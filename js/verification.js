/**
 * Certificate Verification System
 * The Nobles of Sudan Website
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
    console.log("Searching for certificate with serial number:", serialNumber);
    
    // Convert to uppercase to make the search case-insensitive
    const searchTerm = serialNumber.toUpperCase();
    
    // Check if we have certificates in localStorage (for the latest data)
    const storedCertificates = localStorage.getItem('certificatesData');
    console.log("Found stored certificates in localStorage:", !!storedCertificates);
    
    // Start with the built-in certificates data
    let certsToSearch = certificatesData || [];
    console.log("Built-in certificates count:", certsToSearch.length);
    
    if (storedCertificates) {
        try {
            // Use the latest certificates from localStorage
            certsToSearch = JSON.parse(storedCertificates);
            console.log("Using certificates from localStorage. Count:", certsToSearch.length);
        } catch (error) {
            console.error("Error parsing certificates from localStorage:", error);
            // Fall back to the built-in data
            certsToSearch = certificatesData || [];
        }
    }
    
    // Search for the certificate in our data
    const certificate = certsToSearch.find(cert => cert.serialNumber.toUpperCase() === searchTerm) || null;
    console.log("Certificate found:", certificate ? "Yes" : "No");
    
    return certificate;
}

/**
 * Display success message and certificate details
 * @param {Object} certificate - The certificate data
 * @param {HTMLElement} resultDiv - The results container
 */
function displaySuccess(certificate, resultDiv) {
    // Generate the enhanced QR code with certificate details and profile link
    const qrCodeUrl = generateQRCode(certificate);
    
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
                
                <div class="qr-code-container mt-4">
                    <div class="content-ar">امسح رمز QR للتحقق من تفاصيل الشهادة</div>
                    <div class="content-en">Scan the QR code to verify certificate details</div>
                    <img src="${qrCodeUrl}" alt="QR Code" class="qr-code-img mt-2">
                    <div class="qr-info mt-2">
                        <div class="content-ar small">يحتوي رمز QR على معلومات الشهادة باللغتين العربية والإنجليزية</div>
                        <div class="content-en small">QR code contains certificate information in both Arabic and English</div>
                    </div>
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