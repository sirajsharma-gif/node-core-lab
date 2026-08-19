import crypto from "node:crypto";

const data = "This is the data I want to hash";

// Create a SHA-256 hash and output it as a hexadecimal string
const hash = crypto.createHash("sha256").update(data).digest("hex");

console.log(hash);
// Output: 8a7b... (a fixed 64-character string)
