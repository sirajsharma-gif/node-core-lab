import crypto from "node:crypto";

// Simulated inputs (must be converted to Buffers)
const userProvidedSignature = Buffer.from(
  "03e8171ad7af539544d82af170ef1042139990a55aecfd56b64d68933efaba4b",
  "hex",
);
const serverGeneratedSignature = Buffer.from(
  "03e8171ad7af539544d82af170ef1042139990a55aecfd56b64d68933efaba4b",
  "hex",
);

// 1. Length Check
// timingSafeEqual will throw a fatal error if the buffers are different lengths.
if (userProvidedSignature.length !== serverGeneratedSignature.length) {
  console.log("Authentication failed!");
}
// 2. Safe Comparison
else if (
  crypto.timingSafeEqual(userProvidedSignature, serverGeneratedSignature)
) {
  console.log("Authentication successful! The signatures match.");
} else {
  console.log("Authentication failed!");
}
