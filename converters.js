/**
 * Converts hex string to regular text
 * @param {string} hex - hex string to convert
 * @returns {string} - converted text
 */
export function hexToString(hex) {
  if (!hex) return '';
  
  // Remove '0x' prefix if present
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  
  // If after removing prefix we have empty string or '0', return '0'
  if (cleanHex === '' || cleanHex === '0') {
    return '0';
  }
  
  // Check if hex string has even length
  if (cleanHex.length % 2 !== 0) {
    throw new Error('Invalid hex string length');
  }
  
  let str = '';
  for (let i = 0; i < cleanHex.length; i += 2) {
    const byte = parseInt(cleanHex.substr(i, 2), 16);
    str += String.fromCharCode(byte);
  }
  
  return str;
}

/**
 * Converts hex string to decimal number
 * @param {string} hex - hex string to convert
 * @returns {number} - decimal number
 */
export function hexToDecimal(hex) {
  if (!hex) return 0;
  
  // Remove '0x' prefix if present
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  
  // If after removing prefix we have empty string or '0', return 0
  if (cleanHex === '' || cleanHex === '0') {
    return 0;
  }
  
  // Convert hex to decimal number
  const decimal = parseInt(cleanHex, 16);
  
  // Check if conversion was successful
  if (isNaN(decimal)) {
    throw new Error('Invalid hex string');
  }
  
  return decimal;
}

/**
 * Converts Unix timestamp to ISO date format
 * @param {number|string} timestamp - Unix timestamp in seconds
 * @returns {string} - date in ISO format (e.g.: 2025-04-16T18:46:59+00:00)
 */
export function unixToISOString(timestamp) {
  if (!timestamp) return '';
  
  // Convert timestamp to number if it's passed as string
  const numericTimestamp = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
  
  // Check if timestamp is a valid number
  if (isNaN(numericTimestamp)) {
    throw new Error('Invalid timestamp');
  }
  
  // Create Date object from timestamp (multiply by 1000 because JavaScript works with milliseconds)
  const date = new Date(numericTimestamp * 1000);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }
  
  // Get date components
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  // Format date in ISO format without milliseconds
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+00:00`;
} 