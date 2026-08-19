import crypto from "node:crypto";

const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32); // 256-bit secret key
const iv = crypto.randomBytes(16); // 128-bit initialization vector

const message = "Top secret information";

// --- ENCRYPTION ---
const cipher = crypto.createCipheriv(algorithm, key, iv);
let encryptedData = cipher.update(message, "utf8", "hex");
encryptedData += cipher.final("hex");

console.log("Encrypted:", encryptedData);

// --- DECRYPTION ---
const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decryptedData = decipher.update(encryptedData, "hex", "utf8");
decryptedData += decipher.final("utf8");

console.log("Decrypted:", decryptedData);
