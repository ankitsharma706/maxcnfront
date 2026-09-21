/**
 * OCR Text Parser Utilities
 *
 * Handles common OCR mistakes and extracts structured data from raw OCR text.
 */

/**
 * Common OCR character replacements for numeric fields.
 * Maps frequently misread characters to their correct numeric equivalents.
 */
const ocrCharReplacements: Record<string, string> = {
  'O': '0',
  'o': '0',
  'l': '1',
  'I': '1',
  'S': '5',
  's': '5',
  'B': '8',
  'G': '6',
  'g': '9',
  'Z': '2',
  'z': '2',
  'T': '7',
  'D': '0',
};

/**
 * Fix common OCR mistakes in numeric strings.
 *
 * Examples:
 * - O.99 → 0.99
 * - l35OOO → 135000
 * - 3S.67 → 35.67
 */
export const fixOcrNumber = (raw: string): string => {
  if (!raw || typeof raw !== 'string') return raw;

  let cleaned = raw.trim();

  // Remove any currency symbols, commas, spaces
  cleaned = cleaned.replace(/[₹$€,\s]/g, '');

  // Replace common OCR misreads with correct digits
  let result = '';
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];

    // Keep digits, decimal points, and minus signs as-is
    if (/[0-9.\-]/.test(char)) {
      result += char;
    } else if (ocrCharReplacements[char]) {
      result += ocrCharReplacements[char];
    } else {
      // Skip unrecognized characters
    }
  }

  // Fix multiple decimal points (keep only the first)
  const parts = result.split('.');
  if (parts.length > 2) {
    result = parts[0] + '.' + parts.slice(1).join('');
  }

  return result;
};

/**
 * Parse OCR output number, applying corrections and returning a float.
 */
export const parseOcrNumber = (raw: string): number | null => {
  const fixed = fixOcrNumber(raw);
  const num = parseFloat(fixed);
  return isNaN(num) ? null : num;
};

/**
 * Extract lines from OCR text, filtering empty lines.
 */
export const extractLines = (text: string): string[] => {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

/**
 * Detect if a line likely contains tabular data (multiple whitespace-separated values).
 */
export const isTableRow = (line: string): boolean => {
  // A table row typically has multiple values separated by 2+ spaces or tabs
  const segments = line.split(/\s{2,}|\t/).filter((s) => s.trim().length > 0);
  return segments.length >= 3;
};

/**
 * Split a table row into columns.
 */
export const splitTableRow = (line: string): string[] => {
  return line
    .split(/\s{2,}|\t/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
};

/**
 * Try to identify commodity name from OCR text.
 * Looks for known commodity keywords.
 */
const commodityKeywords: Record<string, string> = {
  'gold mini': 'Gold Mini',
  'goldmini': 'Gold Mini',
  'gold': 'Gold',
  'silver mini': 'Silver Mini',
  'silvermini': 'Silver Mini',
  'silver': 'Silver',
  'crude oil': 'Crude Oil',
  'crudeoil': 'Crude Oil',
  'crude': 'Crude Oil',
  'natural gas': 'Natural Gas',
  'naturalgas': 'Natural Gas',
  'ngas': 'Natural Gas',
  'copper': 'Copper',
  'aluminium': 'Aluminium',
  'aluminum': 'Aluminium',
  'zinc': 'Zinc',
  'lead': 'Lead',
  'nickel': 'Nickel',
  'cotton': 'Cotton',
  'mentha oil': 'Mentha Oil',
};

export const detectCommodity = (text: string): string | null => {
  const lowerText = text.toLowerCase();
  for (const [keyword, commodity] of Object.entries(commodityKeywords)) {
    if (lowerText.includes(keyword)) {
      return commodity;
    }
  }
  return null;
};

/**
 * Extract a number that appears near a keyword (e.g., "LTP 153330").
 */
export const extractNumberNearKeyword = (
  text: string,
  keywords: string[]
): number | null => {
  const lines = extractLines(text);

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    for (const keyword of keywords) {
      if (lowerLine.includes(keyword.toLowerCase())) {
        // Try to find number in same line
        const numbers = line.match(/[\d.,]+/g);
        if (numbers && numbers.length > 0) {
          // Take the largest number (likely the price)
          const parsed = numbers
            .map((n) => parseFloat(n.replace(/,/g, '')))
            .filter((n) => !isNaN(n));
          if (parsed.length > 0) {
            return Math.max(...parsed);
          }
        }
      }
    }
  }
  return null;
};

/**
 * Extract option chain data from structured OCR text.
 * Attempts to identify columns by header detection.
 */
export interface OptionChainRow {
  strike: number;
  callSide: {
    oi?: number;
    volume?: number;
    iv?: number;
    ltp?: number;
    delta?: number;
    gamma?: number;
    theta?: number;
    vega?: number;
    rho?: number;
  };
  putSide: {
    oi?: number;
    volume?: number;
    iv?: number;
    ltp?: number;
    delta?: number;
    gamma?: number;
    theta?: number;
    vega?: number;
    rho?: number;
  };
}

/**
 * Known header aliases for option chain columns.
 */
const headerAliases: Record<string, string> = {
  'oi': 'oi',
  'open interest': 'oi',
  'openinterest': 'oi',
  'vol': 'volume',
  'volume': 'volume',
  'iv': 'iv',
  'implied vol': 'iv',
  'impliedvolatility': 'iv',
  'ltp': 'ltp',
  'last price': 'ltp',
  'lastprice': 'ltp',
  'delta': 'delta',
  'gamma': 'gamma',
  'theta': 'theta',
  'vega': 'vega',
  'rho': 'rho',
  'strike': 'strike',
  'strike price': 'strike',
};

/**
 * Detect column headers from a line of text.
 */
export const detectHeaders = (line: string): string[] => {
  const columns = splitTableRow(line);
  return columns.map((col) => {
    const lower = col.toLowerCase().trim();
    return headerAliases[lower] || lower;
  });
};

/**
 * Parse structured option chain rows using detected headers.
 */
export const parseOptionChainRows = (
  headers: string[],
  rows: string[][]
): OptionChainRow[] => {
  const strikeIdx = headers.indexOf('strike');
  if (strikeIdx === -1) return [];

  const results: OptionChainRow[] = [];

  for (const row of rows) {
    if (row.length < headers.length) continue;

    const strikeVal = parseOcrNumber(row[strikeIdx]);
    if (strikeVal === null) continue;

    const entry: OptionChainRow = {
      strike: strikeVal,
      callSide: {},
      putSide: {},
    };

    // Columns before strike are call-side, after are put-side
    for (let i = 0; i < headers.length; i++) {
      if (i === strikeIdx) continue;
      const header = headers[i];
      const value = parseOcrNumber(row[i]);

      const isCallSide = i < strikeIdx;
      const side = isCallSide ? entry.callSide : entry.putSide;

      if (value !== null && ['oi', 'volume', 'iv', 'ltp', 'delta', 'gamma', 'theta', 'vega', 'rho'].includes(header)) {
        (side as Record<string, number>)[header] = value;
      }
    }

    results.push(entry);
  }

  return results;
};
