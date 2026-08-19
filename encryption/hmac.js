import crypto from "node:crypto";

const message = "Process refund for Order #1234";
const secretKey = "super_secret_api_key";

// Create the HMAC using SHA-256 and the secret key
const hmac = crypto
  .createHmac("sha256", secretKey)
  .update(message)
  .digest("hex");

console.log(hmac);
