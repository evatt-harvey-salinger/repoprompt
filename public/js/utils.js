// public/js/utils.js
// Contains utility helper functions.

/**
 * Determines the programming language based on a file's extension for syntax highlighting.
 * @param {string} fileName - The name of the file.
 * @returns {string} - The language identifier.
 */
export function getLanguage(fileName) {
  if (fileName.endsWith('.py')) return 'py';
  if (fileName.endsWith('.html')) return 'html';
  if (fileName.endsWith('.css')) return 'css';
  if (fileName.endsWith('.js')) return 'js';
  if (fileName.endsWith('.md')) return 'md';
  return '';
}

/**
 * Determines if a file is a text file based on its extension.
 * @param {string} fileName - The name of the file.
 * @returns {boolean} - True if the file is a text file, false otherwise.
 */
export function isTextFile(fileName) {
  const textExtensions = [
    '.txt', '.md', '.json', '.xml', '.html', '.css', '.js', '.py', '.java', '.c', 
    '.cpp', '.h', '.hpp', '.sh', '.bat', '.yml', '.yaml', '.ini', '.cfg', '.conf',
    '.log', '.csv', '.ts', '.jsx', '.tsx', '.php', '.rb', '.go', '.rs', '.swift',
    '.kt', '.kts', '.scala', '.pl', '.pm', '.r', '.sql', '.dart', '.lua'
  ];
  return textExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
}

/**
 * Debounce function to limit the rate at which a function is called.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The wait time in milliseconds.
 * @returns {Function} - The debounced function.
 */
export function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Compares two strings using natural sort order (numbers within strings are compared numerically).
 * @param {string} a - First string to compare.
 * @param {string} b - Second string to compare.
 * @returns {number} - Negative if a < b, positive if a > b, zero if equal.
 */
function naturalCompare(a, b) {
  const re = /(\d+)/g;
  const aParts = a.split(re);
  const bParts = b.split(re);

  for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
    const aPart = aParts[i];
    const bPart = bParts[i];

    // If both parts are numeric, compare as numbers
    if (/\d/.test(aPart) && /\d/.test(bPart)) {
      const aNum = parseInt(aPart, 10);
      const bNum = parseInt(bPart, 10);
      if (aNum !== bNum) {
        return aNum - bNum;
      }
    } else {
      // Otherwise, compare as strings (case-insensitive)
      const comparison = aPart.localeCompare(bPart, undefined, { sensitivity: 'base' });
      if (comparison !== 0) {
        return comparison;
      }
    }
  }

  // If one string is a prefix of the other, the shorter one comes first
  return aParts.length - bParts.length;
}

/**
 * Sorts an array of tree entries with folders first, then files, both in natural sort order.
 * @param {Array<Object>} entries - Array of tree entries where each has a 'type' ('folder' or 'file') and 'name'.
 * @returns {Array<Object>} - Sorted array of entries.
 */
export function sortTreeEntries(entries) {
  // Separate folders and files
  const folders = entries.filter(entry => entry.type === 'folder');
  const files = entries.filter(entry => entry.type === 'file');

  // Sort each group using natural compare
  folders.sort((a, b) => naturalCompare(a.name, b.name));
  files.sort((a, b) => naturalCompare(a.name, b.name));

  // Concatenate folders followed by files
  return [...folders, ...files];
}