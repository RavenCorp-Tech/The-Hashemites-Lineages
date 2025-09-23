/**
 * Translation functionality for certificate form
 * Enables auto-translation between English and Arabic fields
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize translation buttons
    initTranslationButtons();
});

/**
 * Initialize the translation buttons
 */
function initTranslationButtons() {
    const translateButtons = document.querySelectorAll('.translate-btn');
    
    translateButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the source and target fields
            const fromLang = this.getAttribute('data-from');
            const toLang = this.getAttribute('data-to');
            const targetId = this.getAttribute('data-target');
            
            // Get the source field
            let sourceField;
            if (fromLang === 'en') {
                if (this.closest('.form-group').querySelector('#nameEn')) {
                    sourceField = document.getElementById('nameEn');
                } else {
                    sourceField = document.getElementById('certificateTypeEn');
                }
            } else {
                if (this.closest('.form-group').querySelector('#nameAr')) {
                    sourceField = document.getElementById('nameAr');
                } else {
                    sourceField = document.getElementById('certificateTypeAr');
                }
            }
            
            // Get the target field
            const targetField = document.getElementById(targetId);
            
            // Get the source text
            const sourceText = sourceField.value.trim();
            
            if (!sourceText) {
                showToast('Warning', 'Please enter text to translate.');
                return;
            }
            
            // Show loading state
            this.classList.add('loading');
            const icon = this.querySelector('i');
            const originalIconClass = icon.className;
            icon.className = 'fas fa-spinner';
            
            // Simulate translation (in a real app, you would call a translation API)
            simulateTranslation(sourceText, fromLang, toLang)
                .then(translatedText => {
                    // Update the target field
                    targetField.value = translatedText;
                    
                    // Reset the button state
                    this.classList.remove('loading');
                    icon.className = originalIconClass;
                })
                .catch(error => {
                    console.error('Translation error:', error);
                    showToast('Error', 'Failed to translate text. Please try again.');
                    
                    // Reset the button state
                    this.classList.remove('loading');
                    icon.className = originalIconClass;
                });
        });
    });
}

/**
 * Simulate translation (in production, replace with actual API call)
 * @param {string} text - The text to translate
 * @param {string} fromLang - The source language (en/ar)
 * @param {string} toLang - The target language (en/ar)
 * @returns {Promise<string>} - The translated text
 */
function simulateTranslation(text, fromLang, toLang) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // This is a simple simulation - in reality, you'd call a translation API
            // For certificate types, use predefined translations
            if (text.toLowerCase().includes('certificate of appreciation') && toLang === 'ar') {
                resolve('شهادة شكر وتقدير');
            } else if (text.includes('شهادة شكر وتقدير') && toLang === 'en') {
                resolve('Certificate of Appreciation');
            } else if (text.toLowerCase().includes('certificate of participation') && toLang === 'ar') {
                resolve('شهادة مشاركة');
            } else if (text.includes('شهادة مشاركة') && toLang === 'en') {
                resolve('Certificate of Participation');
            } else {
                // For names, simulate transliteration
                if (fromLang === 'en' && toLang === 'ar') {
                    // Basic English to Arabic transliteration simulation
                    const transliterated = text
                        .replace(/a/gi, 'ا')
                        .replace(/b/gi, 'ب')
                        .replace(/t/gi, 'ت')
                        .replace(/th/gi, 'ث')
                        .replace(/j/gi, 'ج')
                        .replace(/h/gi, 'ح')
                        .replace(/kh/gi, 'خ')
                        .replace(/d/gi, 'د')
                        .replace(/r/gi, 'ر')
                        .replace(/z/gi, 'ز')
                        .replace(/s/gi, 'س')
                        .replace(/sh/gi, 'ش')
                        .replace(/m/gi, 'م')
                        .replace(/n/gi, 'ن')
                        .replace(/w/gi, 'و')
                        .replace(/y/gi, 'ي');
                    
                    resolve(transliterated);
                } else if (fromLang === 'ar' && toLang === 'en') {
                    // Basic Arabic to English transliteration simulation
                    const transliterated = text
                        .replace(/ا/g, 'a')
                        .replace(/ب/g, 'b')
                        .replace(/ت/g, 't')
                        .replace(/ث/g, 'th')
                        .replace(/ج/g, 'j')
                        .replace(/ح/g, 'h')
                        .replace(/خ/g, 'kh')
                        .replace(/د/g, 'd')
                        .replace(/ر/g, 'r')
                        .replace(/ز/g, 'z')
                        .replace(/س/g, 's')
                        .replace(/ش/g, 'sh')
                        .replace(/م/g, 'm')
                        .replace(/ن/g, 'n')
                        .replace(/و/g, 'w')
                        .replace(/ي/g, 'y');
                    
                    resolve(transliterated);
                } else {
                    // Just return the original text if languages are the same
                    resolve(text);
                }
            }
        }, 800); // Simulate API delay
    });
}