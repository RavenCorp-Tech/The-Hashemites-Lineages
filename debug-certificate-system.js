/**
 * Debug script to test the certificate management system
 */
console.log('=== CERTIFICATE MANAGEMENT SYSTEM DEBUG TOOL ===');

// Step 1: Ensure localStorage is working
console.log('\n=== TESTING LOCAL STORAGE ===');
try {
  const testKey = '__test_cert__';
  localStorage.setItem(testKey, JSON.stringify({test: 'value'}));
  const retrieved = localStorage.getItem(testKey);
  localStorage.removeItem(testKey);
  console.log('localStorage test:', retrieved ? 'PASSED' : 'FAILED');
} catch (error) {
  console.error('localStorage test FAILED with error:', error);
}

// Step 2: Mock certificate data
console.log('\n=== MOCK CERTIFICATE DATA ===');
const testCertificate = {
  serialNumber: 'NS-2025-0016',
  nameEn: 'Adil Hasan',
  nameAr: 'عادل حسن',
  certificateTypeEn: 'Certificate of Appreciation',
  certificateTypeAr: 'شهادة شكر وتقدير',
  dateEn: '24/09/2025',
  dateAr: '24/09/2025',
  statusEn: 'Valid and Certified',
  statusAr: 'صالحة ومُعتمدة',
  qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=NS-2025-0016'
};
console.log('Test certificate data:', testCertificate);

// Step 3: Save to localStorage
console.log('\n=== SAVING TO LOCALSTORAGE ===');
try {
  // Get existing certificates or start with empty array
  const existingJSON = localStorage.getItem('certificatesData');
  let certificates = [];
  
  if (existingJSON) {
    certificates = JSON.parse(existingJSON);
    console.log('Found existing certificates:', certificates.length);
  }
  
  // Add new certificate
  certificates.push(testCertificate);
  console.log('New certificate array length:', certificates.length);
  
  // Save back to localStorage
  localStorage.setItem('certificatesData', JSON.stringify(certificates));
  console.log('Saved to localStorage');
} catch (error) {
  console.error('Save to localStorage FAILED with error:', error);
}

// Step 4: Retrieve and verify
console.log('\n=== VERIFYING LOCALSTORAGE DATA ===');
try {
  const savedJSON = localStorage.getItem('certificatesData');
  if (!savedJSON) {
    console.error('No data found in localStorage!');
  } else {
    const savedCertificates = JSON.parse(savedJSON);
    console.log('Retrieved certificates count:', savedCertificates.length);
    
    // Try to find our test certificate
    const foundCert = savedCertificates.find(
      cert => cert.serialNumber === 'NS-2025-0016'
    );
    
    console.log('Test certificate found:', foundCert ? 'YES' : 'NO');
    if (foundCert) {
      console.log('Certificate data matches:', 
        foundCert.nameEn === 'Adil Hasan' && 
        foundCert.nameAr === 'عادل حسن' ? 'YES' : 'NO');
    }
  }
} catch (error) {
  console.error('Verification FAILED with error:', error);
}

console.log('\n=== CERTIFICATE SYSTEM DEBUG COMPLETE ===');