import CryptoJS from 'crypto-js';

// A hardcoded secret for obfuscation (in a real high-security app this would be more complex, 
// but for preventing plain text devtools snooping, this is perfect)
const SECRET_KEY = 'm@kuma_secure_admin_key_2026';

export const secureStorage = {
  setItem: (key, value) => {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      const encrypted = CryptoJS.AES.encrypt(stringValue, SECRET_KEY).toString();
      localStorage.setItem(key, encrypted);
    } catch (err) {
      console.error('Error encrypting storage item', err);
    }
  },

  getItem: (key) => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      const decryptedBytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) return null; // Decryption failed or empty

      try {
        return JSON.parse(decryptedString);
      } catch (e) {
        return decryptedString; // It was a plain string
      }
    } catch (err) {
      console.error('Error decrypting storage item', err);
      return null;
    }
  },

  removeItem: (key) => {
    localStorage.removeItem(key);
  }
};
