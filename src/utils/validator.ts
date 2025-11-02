export function isNonEmpty(value: string | undefined | null): value is string {
  return !!value && value.trim().length > 0;
}

export function isPositiveIntegerString(value: string): boolean {
  return /^[0-9]+$/.test(value) && BigInt(value) > 0n;
}

export function isValidFileName(fileName: string): boolean {
  // Check for path traversal attempts and invalid characters
  if (!fileName || fileName.trim().length === 0) return false;
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) return false;
  // Windows invalid characters: < > : " | ? * and control characters
  const invalidChars = /[<>:"|?*\x00-\x1f]/;
  if (invalidChars.test(fileName)) return false;
  // Filename cannot be reserved names (Windows)
  const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)/i;
  if (reservedNames.test(fileName)) return false;
  return fileName.length <= 255;
}

export function sanitizeFileName(fileName: string): string {
  // Remove or replace invalid characters
  let sanitized = fileName.replace(/[<>:"|?*\x00-\x1f]/g, '_');
  sanitized = sanitized.replace(/\.\./g, '');
  sanitized = sanitized.replace(/[\/\\]/g, '_');
  return sanitized.trim() || 'Untitled';
}

export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isValidSolidityIdentifier(name: string): boolean {
  // Solidity identifiers must start with letter or underscore, then letters, numbers, or underscores
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name) && name.length > 0 && name.length <= 256;
}


