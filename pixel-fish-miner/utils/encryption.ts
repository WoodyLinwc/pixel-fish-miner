// Simple XOR-based encryption for save data
// This prevents casual editing but isn't military-grade encryption
// Good enough to stop users from easily modifying save files in text editors

const ENCRYPTION_KEY = "PixelFishMiner2026_WoodyLin_SecretKey_DoNotShare";

// Convert string to bytes
function stringToBytes(str: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
}

// Convert bytes to string
function bytesToString(bytes: number[]): string {
  return String.fromCharCode(...bytes);
}

// XOR encryption/decryption (same operation for both)
function xorCipher(data: number[], key: number[]): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    result.push(data[i] ^ key[i % key.length]);
  }
  return result;
}

// Encode to Base64
function encodeBase64(bytes: number[]): string {
  const binary = bytesToString(bytes);
  return btoa(binary);
}

// Decode from Base64
function decodeBase64(base64: string): number[] {
  try {
    const binary = atob(base64);
    return stringToBytes(binary);
  } catch (error) {
    console.error("Base64 decode error:", error);
    throw new Error("Invalid base64");
  }
}

// Add checksum to detect tampering
function addChecksum(data: string): string {
  let checksum = 0;
  for (let i = 0; i < data.length; i++) {
    checksum = (checksum + data.charCodeAt(i)) % 65536;
  }
  const checksumHex = checksum.toString(16).padStart(4, "0");
  return `${checksumHex}:${data}`;
}

// Verify checksum
function verifyChecksum(data: string): string | null {
  const colonIndex = data.indexOf(":");
  if (colonIndex === -1) {
    console.error("No checksum separator found");
    return null;
  }

  const checksumHex = data.substring(0, colonIndex);
  const content = data.substring(colonIndex + 1);

  if (checksumHex.length !== 4) {
    console.error("Invalid checksum length:", checksumHex.length);
    return null;
  }

  const expectedChecksum = parseInt(checksumHex, 16);
  if (isNaN(expectedChecksum)) {
    console.error("Invalid checksum hex:", checksumHex);
    return null;
  }

  let actualChecksum = 0;
  for (let i = 0; i < content.length; i++) {
    actualChecksum = (actualChecksum + content.charCodeAt(i)) % 65536;
  }

  if (actualChecksum !== expectedChecksum) {
    console.error(
      "Checksum mismatch. Expected:",
      expectedChecksum,
      "Got:",
      actualChecksum,
    );
    return null; // Checksum mismatch - data was tampered with
  }

  return content;
}

/**
 * Encrypt save data
 * @param data - The JSON string to encrypt
 * @returns Encrypted and base64-encoded string
 */
export function encryptSaveData(data: string): string {
  try {
    console.log("Encrypting save data, length:", data.length);

    // Add checksum to detect tampering
    const dataWithChecksum = addChecksum(data);
    console.log("Added checksum, new length:", dataWithChecksum.length);

    // Convert to bytes
    const dataBytes = stringToBytes(dataWithChecksum);
    const keyBytes = stringToBytes(ENCRYPTION_KEY);

    // Encrypt with XOR
    const encrypted = xorCipher(dataBytes, keyBytes);

    // Encode to base64
    const base64 = encodeBase64(encrypted);
    console.log("Encryption complete, base64 length:", base64.length);

    return base64;
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
}

/**
 * Decrypt save data
 * @param encryptedData - The encrypted base64 string
 * @returns Decrypted JSON string, or null if invalid/corrupted
 */
export function decryptSaveData(encryptedData: string): string | null {
  try {
    console.log("Decrypting save data, length:", encryptedData.length);

    // Remove any whitespace that might have been added
    const cleanData = encryptedData.trim();

    // Decode from base64
    const encrypted = decodeBase64(cleanData);
    console.log("Decoded from base64, bytes:", encrypted.length);

    // Decrypt with XOR (same operation)
    const keyBytes = stringToBytes(ENCRYPTION_KEY);
    const decrypted = xorCipher(encrypted, keyBytes);
    console.log("XOR decryption complete");

    // Convert back to string
    const decryptedString = bytesToString(decrypted);
    console.log("Converted to string, length:", decryptedString.length);

    // Verify checksum
    const data = verifyChecksum(decryptedString);
    if (data === null) {
      console.error("Checksum verification failed");
      return null;
    }
    console.log("Checksum verified, data length:", data.length);

    // Verify it's valid JSON
    try {
      const parsed = JSON.parse(data);
      console.log("JSON parse successful, keys:", Object.keys(parsed).length);
    } catch (jsonError) {
      console.error("JSON parse failed:", jsonError);
      return null;
    }

    console.log("Decryption successful!");
    return data;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}

/**
 * Create a downloadable file from encrypted data
 * @param encryptedData - The encrypted save data
 * @param filename - The filename (default: pixel-fish-miner-save.fishsave)
 */
export function downloadSaveFile(
  encryptedData: string,
  filename: string = "pixel-fish-miner-save.fishsave",
): void {
  const blob = new Blob([encryptedData], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
}
