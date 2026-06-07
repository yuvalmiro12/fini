"use node";
// AES-256-GCM helpers for bank credentials at rest.
// Imported ONLY by the Node-runtime action file (bank.ts), so `node:crypto`
// is available. Never import this from a query/mutation (V8 runtime) file.
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGO = "aes-256-gcm";

function getKey(): Buffer {
  const raw = process.env.BANK_CREDS_KEY;
  if (!raw) {
    throw new Error(
      "BANK_CREDS_KEY is not set. Generate one with: openssl rand -base64 32, " +
        "then `npx convex env set BANK_CREDS_KEY <value>`.",
    );
  }
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error("BANK_CREDS_KEY must be a base64-encoded 32-byte key.");
  }
  return key;
}

/** Encrypt a plaintext string → "base64(iv).base64(authTag).base64(ciphertext)". */
export function encryptCreds(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("base64"), tag.toString("base64"), enc.toString("base64")].join(".");
}

/** Decrypt a value produced by `encryptCreds`. Throws if tampered / wrong key. */
export function decryptCreds(payload: string): string {
  const key = getKey();
  const [ivB64, tagB64, dataB64] = payload.split(".");
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error("Malformed credentials cipher.");
  }
  const decipher = createDecipheriv(ALGO, key, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const dec = Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64")),
    decipher.final(),
  ]);
  return dec.toString("utf8");
}
