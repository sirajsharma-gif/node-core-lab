import crypto from "node:crypto";

// 1. Generate a key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

const secretMessage = "Only the private key can read this";

// 2. Encrypt with the Public Key
const encryptedData = crypto.publicEncrypt(
  publicKey,
  Buffer.from(secretMessage),
);

// 3. Decrypt with the Private Key
const decryptedData = crypto.privateDecrypt(privateKey, encryptedData);

console.log(decryptedData.toString("utf8"));
