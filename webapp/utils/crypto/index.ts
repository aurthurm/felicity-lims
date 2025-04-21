import CryptoJS from 'crypto-js';

/**
 * Encrypts data using AES-CBC with random IV, returns base64(IV + ciphertext)
 */
export const encrypter = async (data: any, key: string): Promise<string> => {
    if (!key) throw new Error('Encryption key is required');

    const jsonStr = JSON.stringify(data);
    const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
    const iv = CryptoJS.lib.WordArray.random(16);

    const encrypted = CryptoJS.AES.encrypt(jsonStr, keyUtf8, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    const ciphertext = encrypted.ciphertext;

    // Prepend IV to ciphertext and base64-encode
    const combined = iv.clone().concat(ciphertext);
    return CryptoJS.enc.Base64.stringify(combined);
};

/**
 * AES Decryptor (async)
 * @param encryptedBase64 - Encrypted Base64 string (IV + ciphertext)
 * @param key - String key
 * @returns Original decrypted object
 */
export const decrypter = async (encryptedBase64: string, key: string): Promise<any> => {
    if (!key) throw new Error('Decryption key is required');
    if (!encryptedBase64) return {};

    try {
        const encryptedData = CryptoJS.enc.Base64.parse(encryptedBase64);
        const iv = CryptoJS.lib.WordArray.create(encryptedData.words.slice(0, 4)); // 16 bytes
        const ciphertext = CryptoJS.lib.WordArray.create(encryptedData.words.slice(4), encryptedData.sigBytes - 16);
        const keyUtf8 = CryptoJS.enc.Utf8.parse(key);

        const decrypted = CryptoJS.AES.decrypt({ ciphertext }, keyUtf8, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedStr);
    } catch (err) {
        console.error('Decryption failed:', err);
        return {};
    }
};

/**
 * Decrypts base64(IV + ciphertext) using AES-CBC
 */
export const decrypterSync = (encryptedBase64: string, key: string): any => {
    if (!key) throw new Error('Decryption key is required');
    if (!encryptedBase64) return {};

    try {
        const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
        const combined = CryptoJS.enc.Base64.parse(encryptedBase64);

        const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4), 16);
        const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4), combined.sigBytes - 16);

        const decrypted = CryptoJS.AES.decrypt({ ciphertext }, keyUtf8, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedStr);
    } catch (err) {
        console.error('Synchronous decryption failed:', err);
        return {};
    }
};