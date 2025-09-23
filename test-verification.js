console.log('Testing certificate verification...');
// Mock certificate data
const certificatesData = [
  {
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
  }
];
function findCertificate(serialNumber) {
  const searchTerm = serialNumber.toUpperCase();
  return certificatesData.find(cert => cert.serialNumber.toUpperCase() === searchTerm) || null;
}

const cert = findCertificate('NS-2025-0016');
console.log('Certificate found:', cert ? 'Yes' : 'No');
