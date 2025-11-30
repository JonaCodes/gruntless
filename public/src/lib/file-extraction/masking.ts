/**
 * Masks sensitive data while preserving structure.
 *
 * Rules:
 * - Uppercase letters → 'A'
 * - Lowercase letters → 'a'
 * - Digits → '#'
 * - Punctuation/symbols → kept as-is
 *
 * Examples:
 * - "PROD-194211" → "AAAA-######"
 * - "John Smith" → "Aaaa Aaaaa"
 * - "john.smith@acme.com" → "aaaa.aaaaa@aaaa.aaa"
 * - "2024-01-15" → "####-##-##"
 * - "$1,234.56" → "$#,###.##"
 */
export const maskValue = (value: string): string => {
  return value
    .replace(/[A-Z]/g, 'A')
    .replace(/[a-z]/g, 'a')
    .replace(/[0-9]/g, '#');
};

export const maskRow = (row: string[]): string[] => {
  return row.map(maskValue);
};

export const maskRows = (rows: string[][]): string[][] => {
  return rows.map(maskRow);
};
