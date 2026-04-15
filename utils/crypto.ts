import CryptoJS from 'crypto-js';

const SECRET_KEY = '0123456789ABCDEF0123456789ABCDEF';

/**
 * Encrypts a string using AES-256-CBC with a zeroed IV.
 * @param password The plain text password to encrypt.
 * @returns The encrypted password in Base64 format.
 */
export const encryptPassword = (password: string): string => {
  // Key must be 32 bytes for AES-256
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  
  // IV must be 16 bytes for AES-CBC. Using the first 16 bytes of the key as IV.
  const iv = CryptoJS.enc.Utf8.parse(SECRET_KEY.substring(0, 16));

  const encrypted = CryptoJS.AES.encrypt(password, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};
