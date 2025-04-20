import CryptoJs from 'crypto-js';

/**
 * Encrypt data using AES encryption
 * @param data - Data to encrypt
 * @param key - Encryption key
 * @returns Encrypted string
 */
export const encrypter = async (data: any, key: string): Promise<string> => 
    await CryptoJs.AES.encrypt(JSON.stringify(data), key).toString();

/**
 * Decrypt data using AES encryption
 * @param data - Data to decrypt
 * @param key - Decryption key
 * @returns Decrypted object
 */
export const decrypter = async (data: any, key: string): Promise<any> => {
    if (!data) return {};
    return await JSON.parse(CryptoJs.AES.decrypt(data, key).toString(CryptoJs.enc.Utf8));
};

/**
 * Synchronous version of decrypter
 * @param data - Data to decrypt
 * @param key - Decryption key
 * @returns Decrypted object
 */
export const decrypterSync = (data: any, key: string): any => {
    if (!data) return {};
    return JSON.parse(CryptoJs.AES.decrypt(data, key).toString(CryptoJs.enc.Utf8));
}; 