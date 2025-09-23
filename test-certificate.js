console.log('Testing certificate creation...');
const newCertificate = {
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
console.log('Certificate created:', newCertificate);
console.log('Certificate would be saved to localStorage and displayed in table');
