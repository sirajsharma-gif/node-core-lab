import crypto from "node:crypto";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${derivedKey}`;
}

function verifyPassword(typedPassword, storedDatabaseString) {
  const [salt, storedKey] = storedDatabaseString.split(":");
  const storedKeyBuffer = Buffer.from(storedKey, "hex");
  const derivedKeyBuffer = crypto.scryptSync(typedPassword, salt, 64);

  return crypto.timingSafeEqual(storedKeyBuffer, derivedKeyBuffer);
}

const myPassword = "CorrectHorseBatteryStaple";

const dbHash = hashPassword(myPassword);

const isMatch = verifyPassword("CorrectHorseBatteryStaple", dbHash);
const isHacker = verifyPassword("password123", dbHash);

console.log("Matched: ", isMatch);
console.log("Hacker: ", isHacker);
