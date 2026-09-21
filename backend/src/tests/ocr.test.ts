import {
  fixOcrNumber,
  parseOcrNumber,
  extractLines,
  isTableRow,
  splitTableRow,
  detectCommodity,
  extractNumberNearKeyword,
  detectHeaders,
} from '../utils/parser';

describe('OCR Parser Utilities', () => {
  describe('fixOcrNumber', () => {
    it('should fix O to 0', () => {
      expect(fixOcrNumber('O.99')).toBe('0.99');
    });

    it('should fix l to 1', () => {
      expect(fixOcrNumber('l35000')).toBe('135000');
    });

    it('should fix S to 5', () => {
      expect(fixOcrNumber('3S.67')).toBe('35.67');
    });

    it('should fix mixed OCR mistakes', () => {
      expect(fixOcrNumber('l3SOOO')).toBe('135000');
    });

    it('should remove currency symbols', () => {
      expect(fixOcrNumber('₹153,330')).toBe('153330');
    });

    it('should handle clean numbers', () => {
      expect(fixOcrNumber('153330')).toBe('153330');
    });

    it('should handle decimals', () => {
      expect(fixOcrNumber('0.42')).toBe('0.42');
    });

    it('should handle negative numbers', () => {
      expect(fixOcrNumber('-34.52')).toBe('-34.52');
    });

    it('should handle null/undefined input', () => {
      expect(fixOcrNumber('')).toBe('');
      expect(fixOcrNumber(null as any)).toBe(null);
    });

    it('should handle multiple decimal points', () => {
      expect(fixOcrNumber('12.34.56')).toBe('12.3456');
    });
  });

  describe('parseOcrNumber', () => {
    it('should parse corrected OCR numbers', () => {
      expect(parseOcrNumber('O.99')).toBe(0.99);
      expect(parseOcrNumber('l35OOO')).toBe(135000);
      expect(parseOcrNumber('3S.67')).toBe(35.67);
    });

    it('should return null for non-numeric input', () => {
      expect(parseOcrNumber('abc')).toBeNull();
    });

    it('should parse normal numbers', () => {
      expect(parseOcrNumber('153330')).toBe(153330);
      expect(parseOcrNumber('0.42')).toBe(0.42);
    });
  });

  describe('extractLines', () => {
    it('should split text into non-empty lines', () => {
      const text = 'Line 1\n\nLine 2\n  \nLine 3';
      const lines = extractLines(text);
      expect(lines).toEqual(['Line 1', 'Line 2', 'Line 3']);
    });

    it('should trim lines', () => {
      const text = '  Hello  \n  World  ';
      const lines = extractLines(text);
      expect(lines).toEqual(['Hello', 'World']);
    });
  });

  describe('isTableRow', () => {
    it('should detect rows with multiple whitespace-separated values', () => {
      expect(isTableRow('100    200    300')).toBe(true);
      expect(isTableRow('100\t200\t300')).toBe(true);
    });

    it('should reject rows with fewer than 3 segments', () => {
      expect(isTableRow('100    200')).toBe(false);
      expect(isTableRow('single value')).toBe(false);
    });
  });

  describe('splitTableRow', () => {
    it('should split by multiple spaces', () => {
      const cols = splitTableRow('100    200    300');
      expect(cols).toEqual(['100', '200', '300']);
    });

    it('should split by tabs', () => {
      const cols = splitTableRow('100\t200\t300');
      expect(cols).toEqual(['100', '200', '300']);
    });
  });

  describe('detectCommodity', () => {
    it('should detect Gold Mini', () => {
      expect(detectCommodity('Gold Mini 153330')).toBe('Gold Mini');
    });

    it('should detect Crude Oil', () => {
      expect(detectCommodity('CRUDE OIL 5500')).toBe('Crude Oil');
    });

    it('should detect Silver', () => {
      expect(detectCommodity('silver mini futures')).toBe('Silver Mini');
    });

    it('should detect Natural Gas', () => {
      expect(detectCommodity('Natural Gas Futures')).toBe('Natural Gas');
    });

    it('should return null for unknown commodities', () => {
      expect(detectCommodity('Random text here')).toBeNull();
    });
  });

  describe('extractNumberNearKeyword', () => {
    it('should extract number near LTP keyword', () => {
      const text = 'LTP 153330\nHigh 154000';
      const result = extractNumberNearKeyword(text, ['ltp']);
      expect(result).toBe(153330);
    });

    it('should extract number near price keyword', () => {
      const text = 'Current Price: 153,330.50';
      const result = extractNumberNearKeyword(text, ['price']);
      expect(result).toBe(153330.50);
    });

    it('should return null when keyword not found', () => {
      const text = 'No relevant data';
      const result = extractNumberNearKeyword(text, ['ltp']);
      expect(result).toBeNull();
    });
  });

  describe('detectHeaders', () => {
    it('should detect standard option chain headers', () => {
      const line = 'OI    Volume    IV    LTP    Strike    LTP    IV    Volume    OI';
      const headers = detectHeaders(line);
      expect(headers).toContain('oi');
      expect(headers).toContain('volume');
      expect(headers).toContain('iv');
      expect(headers).toContain('ltp');
      expect(headers).toContain('strike');
    });
  });
});
