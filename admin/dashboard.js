/**
 * Admin Dashboard JavaScript
 * The Nobles of Sudan Website
 */

// Global variables
console.log("Dashboard script initializing...");

// This array will hold all certificate data
let certificates = [];

// Check if the browser supports localStorage
const isLocalStorageSupported = (function() {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        console.log("localStorage is supported");
        return true;
    } catch (e) {
        console.error("localStorage is not supported:", e);
        return false;
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing dashboard...");
    
    // Check if user is logged in
    if (!sessionStorage.getItem('adminLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }
    
    // Set admin username
    document.getElementById('admin-username').textContent = sessionStorage.getItem('adminUsername');
    
    // Initialize navigation
    initNavigation();
    
    // Load certificates data
    loadCertificates();
    
    // Event listeners
    document.getElementById('logout-btn').addEventListener('click', logout);
    document.getElementById('save-certificate').addEventListener('click', saveCertificate);
    document.getElementById('confirm-delete').addEventListener('click', deleteCertificate);
    document.getElementById('add-certificate-btn').addEventListener('click', showAddCertificateModal);
    
    // Add event listener for the cancel button in the certificate form
    const cancelButtons = document.querySelectorAll('.modal-cancel-btn');
    cancelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Check if this is the certificate form cancel button
            if (this.closest('.modal').id === 'certificate-modal') {
                clearCertificateForm();
            }
        });
    });
    
    // Prevent form submission when Enter key is pressed
    const certificateForm = document.getElementById('certificate-form');
    certificateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Call saveCertificate function instead
        saveCertificate();
    });
    
    // Add event listeners for form input fields to prevent automatic form submission
    const formFields = certificateForm.querySelectorAll('input');
    formFields.forEach(field => {
        field.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    });
    
    // Set the copyright year in footer
    const yearElements = document.querySelectorAll('#year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => el.textContent = currentYear);
});

/**
 * Initialize the admin navigation
 * This function has been simplified since we no longer use tabs
 */
function initNavigation() {
    // Set up table row event listeners
    setupTableRowListeners();
    
    // We'll add keyboard shortcuts for advanced users
    document.addEventListener('keydown', function(e) {
        // Ctrl+Alt+A to add new certificate
        if (e.ctrlKey && e.altKey && e.key === 'a') {
            showAddCertificateModal();
        }
        // Ctrl+Alt+D to delete certificate
        if (e.ctrlKey && e.altKey && e.key === 'd') {
            showDeleteCertificateModal();
        }
    });
}

/**
 * Load certificates data from the certificates.js file
 */
function loadCertificates() {
    console.log("Loading certificates...");
    
    // Check if certificatesData is defined from certificates.js
    if (typeof certificatesData === 'undefined') {
        console.error("ERROR: certificatesData is not defined! Check if certificates.js is loaded.");
        certificates = [];
    } else {
        console.log("certificatesData from file:", certificatesData);
    }
    
    // Check if we have certificates in localStorage
    const storedCertificates = localStorage.getItem('certificatesData');
    console.log("Found stored certificates in localStorage:", !!storedCertificates);
    
    if (storedCertificates) {
        try {
            // Use the certificates from localStorage
            certificates = JSON.parse(storedCertificates);
            console.log("Using certificates from localStorage:", certificates.length);
        } catch (error) {
            console.error("Error parsing certificates from localStorage:", error);
            certificates = certificatesData || [];
        }
    } else {
        // Use the data from certificatesData defined in certificates.js
        certificates = certificatesData || [];
        console.log("Using certificates from certificates.js:", certificates.length);
        
        // Save it to localStorage for persistence
        localStorage.setItem('certificatesData', JSON.stringify(certificates));
    }
    
    // Update dashboard count
    const totalCertificatesEl = document.getElementById('total-certificates');
    if (totalCertificatesEl) {
        totalCertificatesEl.textContent = certificates.length;
    } else {
        console.error("Could not find total-certificates element!");
    }
    
    // Populate certificates table
    renderCertificatesTable();
    
    console.log("Loaded certificates:", certificates.length);
}

/**
 * Render the certificates table
 */
function renderCertificatesTable() {
    console.log("=== RENDERING CERTIFICATES TABLE ===");
    console.log("Certificates array length:", certificates ? certificates.length : "undefined");
    console.log("Current certificates array:", JSON.stringify(certificates, null, 2));
    
    // Get the table body element
    const tableBody = document.getElementById('certificates-table-body');
    if (!tableBody) {
        console.error("CRITICAL ERROR: certificates-table-body element not found!");
        alert("Error: Could not find the certificates table. Please refresh the page.");
        return;
    }
    
    // Clear the existing table content
    tableBody.innerHTML = '';
    console.log("Table cleared, now rebuilding...");
    
    // Check if we have certificates to display
    if (!certificates || !Array.isArray(certificates) || certificates.length === 0) {
        console.log("No certificates to display, showing empty state");
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="7" class="text-center">
                <div class="py-4">
                    <span class="content-en">No certificates found. Add your first certificate using the button above.</span>
                    <span class="content-ar">لم يتم العثور على شهادات. أضف شهادتك الأولى باستخدام الزر أعلاه.</span>
                </div>
            </td>
        `;
        tableBody.appendChild(emptyRow);
        return;
    }
    
    // Add each certificate to the table
    certificates.forEach((cert, index) => {
        try {
            console.log(`Adding certificate ${index}: ${cert.serialNumber} - ${cert.nameEn}`);
            
            // Create a new row
            const row = document.createElement('tr');
            
            // Add each cell
            row.innerHTML = `
                <td>${cert.serialNumber || 'N/A'}</td>
                <td>${cert.nameEn || 'N/A'}</td>
                <td dir="rtl">${cert.nameAr || 'N/A'}</td>
                <td>${cert.certificateTypeEn || 'N/A'}</td>
                <td>${cert.dateEn || 'N/A'}</td>
                <td>
                    <span class="badge bg-success">
                        <span class="content-en">${cert.statusEn || 'Valid'}</span>
                        <span class="content-ar">${cert.statusAr || 'صالحة'}</span>
                    </span>
                </td>
                <td>
                    <button class="btn-circle admin-action-btn edit-certificate" data-index="${index}" title="Edit Certificate">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-circle admin-action-btn delete-certificate" data-index="${index}" title="Delete Certificate">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            // Add row to table
            tableBody.appendChild(row);
            console.log(`Successfully added row for certificate ${cert.serialNumber}`);
        } catch (error) {
            console.error(`Error rendering certificate at index ${index}:`, error);
        }
    });
    
    console.log(`Table rendering complete. Added ${certificates.length} rows.`);
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-certificate').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            showEditCertificateModal(index);
        });
    });
    
    document.querySelectorAll('.delete-certificate').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            showDeleteCertificateModal(index);
        });
    });
}

/**
 * Show the modal for adding a new certificate
 */
function showAddCertificateModal() {
    // Reset the form
    document.getElementById('certificate-form').reset();
    document.getElementById('certificate-id').value = '';
    
    // Update modal title
    document.getElementById('modal-title').textContent = 'Add New Certificate';
    
    // Set the current date in the correct format (DD/MM/YYYY)
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    document.getElementById('date').value = `${day}/${month}/${year}`;
    
    // Generate next serial number
    generateNextSerialNumber();
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('certificate-modal'));
    modal.show();
}

/**
 * Generate the next available serial number
 */
function generateNextSerialNumber() {
    const currentYear = new Date().getFullYear();
    let maxNumber = 0;
    
    // Find the highest serial number
    certificates.forEach(cert => {
        if (cert.serialNumber.startsWith(`NS-${currentYear}`)) {
            const number = parseInt(cert.serialNumber.split('-')[2]);
            if (number > maxNumber) {
                maxNumber = number;
            }
        }
    });
    
    // Create the next serial number
    const nextNumber = maxNumber + 1;
    const serialNumber = `NS-${currentYear}-${String(nextNumber).padStart(4, '0')}`;
    
    document.getElementById('serialNumber').value = serialNumber;
}

/**
 * Show the modal for editing a certificate
 * @param {number} index - The index of the certificate to edit
 */
function showEditCertificateModal(index) {
    const certificate = certificates[index];
    
    // Set form values
    document.getElementById('serialNumber').value = certificate.serialNumber;
    document.getElementById('nameEn').value = certificate.nameEn;
    document.getElementById('nameAr').value = certificate.nameAr;
    document.getElementById('certificateTypeEn').value = certificate.certificateTypeEn;
    document.getElementById('certificateTypeAr').value = certificate.certificateTypeAr;
    document.getElementById('date').value = certificate.dateEn;
    document.getElementById('certificate-id').value = index;
    
    // Update modal title
    document.getElementById('modal-title').textContent = 'Edit Certificate';
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('certificate-modal'));
    modal.show();
}

/**
 * Show the modal for confirming certificate deletion
 * @param {number} index - The index of the certificate to delete (optional)
 */
function showDeleteCertificateModal(index) {
    // Clear the input field
    document.getElementById('delete-serial-input').value = '';
    
    // If an index is provided, pre-fill the serial number
    if (index !== undefined) {
        const certificate = certificates[index];
        document.getElementById('delete-serial-input').value = certificate.serialNumber;
        document.getElementById('certificate-id').value = index;
    } else {
        document.getElementById('certificate-id').value = '';
    }
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('delete-modal'));
    modal.show();
}

/**
 * Save a certificate (add new or update existing)
 */
function saveCertificate() {
    console.log("=== SAVE CERTIFICATE FUNCTION CALLED ===");
    
    // Step 1: Get form values
    console.log("Step 1: Getting form values");
    
    const serialNumberEl = document.getElementById('serialNumber');
    const nameEnEl = document.getElementById('nameEn');
    const nameArEl = document.getElementById('nameAr');
    const typeEnEl = document.getElementById('certificateTypeEn');
    const typeArEl = document.getElementById('certificateTypeAr');
    const dateEl = document.getElementById('date');
    const idEl = document.getElementById('certificate-id');
    
    // Check if all elements exist
    if (!serialNumberEl || !nameEnEl || !nameArEl || !typeEnEl || !typeArEl || !dateEl || !idEl) {
        console.error("Error: One or more form elements not found!");
        showToast('Error', 'System Error: Form elements not found', 'error');
        return;
    }
    
    // Get values and trim whitespace
    const serialNumber = serialNumberEl.value.trim();
    const nameEn = nameEnEl.value.trim();
    const nameAr = nameArEl.value.trim();
    const certificateTypeEn = typeEnEl.value.trim();
    const certificateTypeAr = typeArEl.value.trim();
    const date = dateEl.value.trim();
    const certificateId = idEl.value;
    
    console.log("Form values:", { serialNumber, nameEn, nameAr, certificateTypeEn, certificateTypeAr, date, certificateId });
    
    // Step 2: Validate form
    console.log("Step 2: Validating form");
    if (!serialNumber || !nameEn || !nameAr || !certificateTypeEn || !certificateTypeAr || !date) {
        console.error("Form validation failed: Missing required fields");
        showToast('Error', 'Please fill in all required fields', 'error');
        return;
    }
    
    // Step 3: Create certificate object
    console.log("Step 3: Creating certificate object");
    const certificate = {
        serialNumber: serialNumber,
        nameEn: nameEn,
        nameAr: nameAr,
        certificateTypeEn: certificateTypeEn,
        certificateTypeAr: certificateTypeAr,
        dateEn: date,
        dateAr: date,
        statusEn: 'Valid and Certified',
        statusAr: 'صالحة ومُعتمدة',
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${serialNumber}`
    };
    
    // Ensure the certificates array exists
    if (!certificates) {
        console.log("Certificates array is undefined, initializing new array");
        certificates = [];
    }
    
    // Step 4: Add or update the certificate
    console.log("Step 4: Adding or updating certificate");
    if (certificateId === '') {
        // This is a new certificate
        console.log("Adding new certificate");
        
        // Check for duplicate serial numbers
        const existingCert = certificates.find(cert => cert.serialNumber === serialNumber);
        if (existingCert) {
            console.error("Duplicate serial number found:", serialNumber);
            showToast('Error', 'This serial number already exists', 'error');
            return;
        }
        
        // Add new certificate
        certificates.push(certificate);
        console.log("New certificate added. New array length:", certificates.length);
        showToast('Success', 'Certificate added successfully', 'success');
    } else {
        // This is an update to an existing certificate
        console.log("Updating existing certificate at index:", certificateId);
        const index = parseInt(certificateId);
        
        // Check for duplicate serial numbers (excluding the current one)
        const existingCert = certificates.find((cert, i) => i !== index && cert.serialNumber === serialNumber);
        if (existingCert) {
            console.error("Duplicate serial number found:", serialNumber);
            showToast('Error', 'This serial number already exists', 'error');
            return;
        }
        
        // Update existing certificate
        certificates[index] = certificate;
        console.log("Certificate updated at index", index);
        showToast('Success', 'Certificate updated successfully', 'success');
    }
    
    // Step 5: Save to localStorage
    console.log("Step 5: Saving to localStorage");
    try {
        const certificatesJSON = JSON.stringify(certificates);
        localStorage.setItem('certificatesData', certificatesJSON); // Fixed duplicate JSON.stringify
        console.log("Successfully saved to localStorage:", certificatesJSON.substring(0, 100) + "...");
        
        // Double-check that the data was saved
        const savedData = localStorage.getItem('certificatesData');
        if (!savedData) {
            console.error("Critical error: Data was not saved to localStorage!");
            showToast('Error', 'Failed to save data to storage', 'error');
        }
    } catch (error) {
        console.error("Error saving to localStorage:", error);
        showToast('Error', 'Failed to save data to storage', 'error');
    }
    
    // Step 6: Update UI
    console.log("Step 6: Updating UI");
    try {
        // Instead of using renderCertificatesTable, let's manually update the table for better reliability
        const tableBody = document.getElementById('certificates-table-body');
        
        if (tableBody) {
            // Clear the existing table
            tableBody.innerHTML = '';
            console.log("Cleared table body");
            
            if (certificates.length === 0) {
                // Show empty state
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td colspan="7" class="text-center">
                        <div class="py-4">
                            <span class="content-en">No certificates found. Add your first certificate using the button above.</span>
                            <span class="content-ar">لم يتم العثور على شهادات. أضف شهادتك الأولى باستخدام الزر أعلاه.</span>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
                console.log("Added empty state row");
            } else {
                // Add each certificate to the table
                certificates.forEach((cert, idx) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${cert.serialNumber}</td>
                        <td>${cert.nameEn}</td>
                        <td dir="rtl">${cert.nameAr}</td>
                        <td>${cert.certificateTypeEn}</td>
                        <td>${cert.dateEn}</td>
                        <td>
                            <span class="badge bg-success">
                                <span class="content-en">${cert.statusEn}</span>
                                <span class="content-ar">${cert.statusAr}</span>
                            </span>
                        </td>
                        <td>
                            <button class="btn-circle admin-action-btn edit-certificate" data-index="${idx}" title="Edit Certificate">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-circle admin-action-btn delete-certificate" data-index="${idx}" title="Delete Certificate">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;
                    tableBody.appendChild(tr);
                    console.log(`Added row for certificate: ${cert.serialNumber}`);
                });
            }
            
            // Update the event listeners for the new buttons
            setupTableRowListeners();
        } else {
            console.error("Could not find certificates-table-body element!");
        }
        
        // Update the total count
        const totalEl = document.getElementById('total-certificates');
        if (totalEl) {
            totalEl.textContent = certificates.length;
            console.log("Total certificates count updated:", certificates.length);
        } else {
            console.error("Could not find total-certificates element!");
        }
    } catch (error) {
        console.error("Error updating UI:", error);
    }
    
    // Step 7: Close the modal
    console.log("Step 7: Closing the modal");
    try {
        const modalEl = document.getElementById('certificate-modal');
        if (!modalEl) {
            console.error("Modal element not found!");
            return;
        }
        
        // Attempt to close using Bootstrap Modal API
        try {
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) {
                modalInstance.hide();
                console.log("Modal closed using Bootstrap API");
            } else {
                // Fallback to jQuery if Bootstrap API fails
                console.log("Bootstrap modal instance not found, trying jQuery fallback");
                if (typeof $ !== 'undefined') {
                    $(modalEl).modal('hide');
                    console.log("Modal closed using jQuery");
                } else {
                    // Last resort fallback
                    modalEl.style.display = 'none';
                    modalEl.classList.remove('show');
                    document.querySelector('.modal-backdrop')?.remove();
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                    console.log("Modal closed using direct DOM manipulation");
                }
            }
        } catch (err) {
            console.error("Error closing modal:", err);
            // Try fallback method
            modalEl.style.display = 'none';
            modalEl.classList.remove('show');
            document.querySelector('.modal-backdrop')?.remove();
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            console.log("Modal closed using fallback method after error");
        }
    } catch (error) {
        console.error("Critical error when closing modal:", error);
        alert("There was an error closing the form. Please refresh the page.");
    }
    
    // Export the updated data
    exportCertificatesData();
}

/**
 * Delete a certificate
 */
function deleteCertificate() {
    const serialNumber = document.getElementById('delete-serial-input').value.trim();
    
    if (!serialNumber) {
        showToast('Error', 'Please enter a serial number', 'error');
        return;
    }
    
    // Find the certificate by serial number
    const index = certificates.findIndex(cert => cert.serialNumber.toUpperCase() === serialNumber.toUpperCase());
    
    if (index === -1) {
        showToast('Error', 'Certificate not found with this serial number', 'error');
        return;
    }
    
    // Remove the certificate
    certificates.splice(index, 1);
    
    // Save to localStorage
    localStorage.setItem('certificatesData', JSON.stringify(certificates));
    
    // Update UI
    renderCertificatesTable();
    document.getElementById('total-certificates').textContent = certificates.length;
    
    // Close the modal
    bootstrap.Modal.getInstance(document.getElementById('delete-modal')).hide();
    
    // Show success message
    showToast('Success', 'Certificate deleted successfully', 'success');
    
    // Export the updated data
    exportCertificatesData();
}

/**
 * Export the certificates data to a JavaScript file
 * In a real application, this would be done server-side
 * Here we're generating the code that would need to be copied manually
 */
function exportCertificatesData() {
    console.log("=== EXPORT CERTIFICATES DATA ===");
    console.log("Current certificates count:", certificates.length);
    
    // Format the certificates array as a string with proper indentation
    let certificatesString = '/**\n * Certificates Database for Verification System\n * The Hashemites Lineages Website\n * \n * This file contains the master data for all certificates.\n * It\'s also used by the admin interface to manage certificates.\n */\n\n// Load certificates from localStorage if available (for admin interface)\nlet certificatesData = [\n';
    
    certificates.forEach((cert, index) => {
        certificatesString += '    {\n';
        certificatesString += `        serialNumber: "${cert.serialNumber}",\n`;
        certificatesString += `        nameAr: "${cert.nameAr}",\n`;
        certificatesString += `        nameEn: "${cert.nameEn}",\n`;
        certificatesString += `        certificateTypeAr: "${cert.certificateTypeAr}",\n`;
        certificatesString += `        certificateTypeEn: "${cert.certificateTypeEn}",\n`;
        certificatesString += `        dateAr: "${cert.dateAr}",\n`;
        certificatesString += `        dateEn: "${cert.dateEn}",\n`;
        certificatesString += `        statusAr: "${cert.statusAr}",\n`;
        certificatesString += `        statusEn: "${cert.statusEn}",\n`;
        certificatesString += `        qrCode: "${cert.qrCode}"\n`;
        certificatesString += '    }' + (index < certificates.length - 1 ? ',' : '') + '\n';
    });
    
    certificatesString += '];\n\n// Set the certificates in localStorage if not already there\nif (!localStorage.getItem(\'certificatesData\')) {\n    localStorage.setItem(\'certificatesData\', JSON.stringify(certificatesData));\n}';
    
    console.log("Generated certificates data string");
    
    // Add a clear message for the Admin
    showToast('Success', 'Certificate data updated successfully! Your new certificate has been added to the database and is now available for verification.', 'success');
    
    // Verify that the data is in localStorage
    const storedData = localStorage.getItem('certificatesData');
    if (storedData) {
        try {
            const parsedData = JSON.parse(storedData);
            console.log(`Verified localStorage data: Found ${parsedData.length} certificates`);
        } catch (error) {
            console.error("Error parsing localStorage data:", error);
        }
    } else {
        console.error("No data found in localStorage after save!");
    }
    
    exportModal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <span class="content-en">Export Certificates Data</span>
                        <span class="content-ar">تصدير بيانات الشهادات</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="content-en">Copy the following code and replace the content of your certificates.js file:</p>
                    <p class="content-ar">انسخ الرمز التالي واستبدل محتوى ملف certificates.js:</p>
                    <div class="admin-code-container">
                        <pre style="white-space: pre-wrap; max-height: 400px; overflow-y: auto; padding: 15px; border-radius: 8px; background-color: #f8f9fa; border: 1px solid #dee2e6;"><code>${certificatesString}</code></pre>
                    </div>
                    <button class="admin-action-btn admin-btn-primary mt-3" id="copy-export-btn">
                        <i class="fas fa-copy"></i> 
                        <span class="content-en">Copy to Clipboard</span>
                        <span class="content-ar">نسخ إلى الحافظة</span>
                    </button>
                </div>
                <div class="modal-footer">
                    <button type="button" class="admin-action-btn" data-bs-dismiss="modal">
                        <span class="content-en">Close</span>
                        <span class="content-ar">إغلاق</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(exportModal);
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('export-modal'));
    modal.show();
    
    // Handle copy button
    document.getElementById('copy-export-btn').addEventListener('click', function() {
        navigator.clipboard.writeText(certificatesString)
            .then(() => {
                const originalContent = this.innerHTML;
                this.innerHTML = `
                    <i class="fas fa-check"></i> 
                    <span class="content-en">Copied!</span>
                    <span class="content-ar">تم النسخ!</span>
                `;
                setTimeout(() => {
                    this.innerHTML = originalContent;
                }, 2000);
            });
    });
    
    // Remove the modal from DOM when it's closed
    document.getElementById('export-modal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

/**
 * Show a toast notification
 * @param {string} title - The title of the toast
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (success or error)
 */
function showToast(title, message, type) {
    const toastElement = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    // Set bilingual toast message
    let messageContent = '';
    
    if (type === 'success') {
        if (message.includes('added')) {
            messageContent = `
                <span class="content-en">${message}</span>
                <span class="content-ar">تمت إضافة الشهادة بنجاح</span>
            `;
        } else if (message.includes('updated')) {
            messageContent = `
                <span class="content-en">${message}</span>
                <span class="content-ar">تم تحديث الشهادة بنجاح</span>
            `;
        } else if (message.includes('deleted')) {
            messageContent = `
                <span class="content-en">${message}</span>
                <span class="content-ar">تم حذف الشهادة بنجاح</span>
            `;
        } else {
            messageContent = `
                <span class="content-en">${message}</span>
                <span class="content-ar">تمت العملية بنجاح</span>
            `;
        }
    } else {
        if (message.includes('serial number')) {
            messageContent = `
                <span class="content-en">${message}</span>
                <span class="content-ar">الرقم التسلسلي موجود بالفعل</span>
            `;
        } else if (message.includes('required fields')) {
            messageContent = `
                <span class="content-en">${message}</span>
                <span class="content-ar">يرجى ملء جميع الحقول المطلوبة</span>
            `;
        } else if (message.includes('Please enter a serial number')) {
            messageContent = `
                <span class="content-en">${message}</span>
                <span class="content-ar">الرجاء إدخال الرقم التسلسلي</span>
            `;
        } else if (message.includes('Certificate not found')) {
            messageContent = `
                <span class="content-en">${message}</span>
                <span class="content-ar">لم يتم العثور على شهادة بهذا الرقم التسلسلي</span>
            `;
        } else {
            messageContent = `
                <span class="content-en">${message}</span>
                <span class="content-ar">حدث خطأ ما</span>
            `;
        }
    }
    
    toastMessage.innerHTML = messageContent;
    
    // Set toast type
    toastElement.className = 'toast';
    if (type === 'error') {
        toastElement.classList.add('bg-danger', 'text-white');
    } else {
        toastElement.classList.add('bg-success', 'text-white');
    }
    
    // Show the toast
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
}

/**
 * Log out of the admin panel
 */
function logout() {
    // Clear session storage
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUsername');
    
    // Redirect to login page
    window.location.href = 'index.html';
}

/**
 * Set up event listeners for table rows
 */
function setupTableRowListeners() {
    console.log("Setting up table row event listeners");
    
    // Remove any existing click event listener to avoid duplicates
    document.removeEventListener('click', handleTableRowActions);
    
    // Add event delegation for edit and delete buttons
    document.addEventListener('click', handleTableRowActions);
    
    console.log("Table row listeners set up successfully");
}

/**
 * Handle clicks on table row action buttons
 * @param {Event} e - The click event
 */
function handleTableRowActions(e) {
    // Check if it's an edit button
    if (e.target.closest('.edit-certificate')) {
        const button = e.target.closest('.edit-certificate');
        const index = button.dataset.index;
        console.log("Edit certificate button clicked for index:", index);
        showEditCertificateModal(parseInt(index));
    }
    
    // Check if it's a delete button
    if (e.target.closest('.delete-certificate')) {
        const button = e.target.closest('.delete-certificate');
        const index = button.dataset.index;
        console.log("Delete certificate button clicked for index:", index);
        showDeleteCertificateModal(parseInt(index));
    }
}

/**
 * Clear all fields in the certificate form
 */
function clearCertificateForm() {
    // Reset the form
    document.getElementById('certificate-form').reset();
    
    // Clear specific fields that might not be reset by form.reset()
    document.getElementById('certificate-id').value = '';
    document.getElementById('serialNumber').value = '';
    document.getElementById('nameEn').value = '';
    document.getElementById('nameAr').value = '';
    document.getElementById('certificateTypeEn').value = '';
    document.getElementById('certificateTypeAr').value = '';
    
    // Set the current date in the correct format (DD/MM/YYYY)
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    document.getElementById('date').value = `${day}/${month}/${year}`;
    
    // Generate a new serial number
    generateNextSerialNumber();
}