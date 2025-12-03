import { ERROR_MESSAGES } from 'public/src/consts/pyodide';
import { PyodideInterface } from 'pyodide';

export const extractCsv = async (
  filePath: string,
  sampleRows: number,
  pyodide: PyodideInterface
): Promise<{ columns: string[]; rows: string[][]; rowCount: number }> => {
  if (!pyodide) {
    throw new Error(ERROR_MESSAGES.NOT_INITIALIZED);
  }

  await pyodide.loadPackage('pandas');

  const escapedPath = filePath.replace(/'/g, "\\'");
  const script = `
import pandas as pd
import json

def mask_value(value):
    """
    Masks sensitive data while preserving structure.
    - Uppercase letters → 'A'
    - Lowercase letters → 'a'
    - Digits → '#'
    - Punctuation/symbols → kept as-is
    """
    result = []
    for char in str(value):
        if char.isupper():
            result.append('A')
        elif char.islower():
            result.append('a')
        elif char.isdigit():
            result.append('#')
        else:
            result.append(char)
    return ''.join(result)

df = pd.read_csv('${escapedPath}')
columns = df.columns.tolist()
sample_df = df.head(${sampleRows})

# Mask the data
masked_rows = [[mask_value(cell) for cell in row] for row in sample_df.astype(str).values.tolist()]
row_count = len(df)

json.dumps({
  "columns": columns,
  "rows": masked_rows,
  "rowCount": row_count
})
  `.trim();

  const resultJson = await pyodide.runPythonAsync(script);
  return JSON.parse(resultJson);
};
