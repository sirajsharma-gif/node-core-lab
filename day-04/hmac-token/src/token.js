import { Buffer } from "node:buffer";
import { createHmac, timingSafeEqual } from "node:crypto";

const secretKey = "secret_key";

export function sign(message) {
  const json = JSON.stringify(message);
  const encodedPayload = Buffer.from(json).toString("base64url");
  const signature = createHmac("sha256", secretKey)
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function verify(token) {
  const parts = token.split(".");

  if (parts.length !== 2) {
    throw new Error("Invalid token format");
  }

  const [payload, signature] = parts;

  const expectedSignature = createHmac("sha256", secretKey)
    .update(payload)
    .digest();

  let recievedSignatureBuffer;

  try {
    recievedSignatureBuffer = Buffer.from(signature, "base64url");
  } catch {
    throw new Error("Invalid signature");
  }

  if (recievedSignatureBuffer.length !== expectedSignature.length) {
    throw new Error("Invalid signature");
  }

  if (!timingSafeEqual(recievedSignatureBuffer, expectedSignature)) {
    throw new Error("Invalid signature");
  }

  try {
    const json = Buffer.from(payload, "base64url").toString("utf8");
    return JSON.parse(json);
  } catch {
    throw new Error("Invalid payload");
  }
}
