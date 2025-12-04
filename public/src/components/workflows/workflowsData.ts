import { MIME_TYPES } from '@mantine/dropzone';

export const workflows: any[] = [
  {
    metadata: {
      id: 'csv-merger-v1',
      name: 'User Data Merger',
      description: 'Merges Age and City data based on User ID.',
      category: 'Sales',
      lastRun: new Date(Date.now() - 24 * 7 * 60 * 60 * 1000),
      numRuns: 104,
      numSaved: 12,
    },
    fields: [
      {
        id: 'source_files',
        type: 'multi_file_upload',
        label: 'Upload CSV Files',
        accept: [MIME_TYPES.csv],
        min_files: 2,
        max_files: 2,
      },
    ],
    actionButton: {
      label: 'Merge Files',
    },
    execution: {
      engine: 'pyodide',
      dependencies: ['pandas'],
      outputFilename: 'merged_user_data.csv',
      script:
        "import pandas as pd\nimport os\n\n# Files are now organized by field ID\n# The 'source_files' field contains the CSV files to merge\nFIELD_DIR = '/input_files/source_files'\n\n# Find the CSV files in the field directory\nfiles = [f for f in os.listdir(FIELD_DIR) if f.endswith('.csv')]\n\nif len(files) < 2:\n    raise ValueError('Please upload at least 2 CSV files')\n\n# Load Dataframes\ndf1 = pd.read_csv(os.path.join(FIELD_DIR, files[0]))\ndf2 = pd.read_csv(os.path.join(FIELD_DIR, files[1]))\n\nprint(f'Loaded {files[0]} with columns: {list(df1.columns)}')\nprint(f'Loaded {files[1]} with columns: {list(df2.columns)}')\n\n# Intelligent Merge - find common key\ncommon_cols = list(set(df1.columns) & set(df2.columns))\n\nif 'user_id' not in common_cols:\n     raise ValueError('Both files must contain a \"user_id\" column')\n\nmerged_df = pd.merge(df1, df2, on='user_id', how='inner')\n\n# Write output\noutput_path = '/output/merged_user_data.csv'\nmerged_df.to_csv(output_path, index=False)\nprint(f'Successfully merged {len(merged_df)} rows.')",
    },
  },
  {
    metadata: {
      id: 'invoice-extractor-v1',
      name: 'Invoice Data Extractor',
      description:
        'Extracts business name, invoice date, and amount from PDF invoices.',
      category: 'Finance',
      lastRun: new Date(Date.now() - 0.1 * 60 * 60 * 1000),
      numRuns: 24,
      numSaved: 16,
    },
    fields: [
      {
        id: 'invoice_files',
        type: 'multi_file_upload',
        label: 'Upload Invoice PDFs',
        accept: ['application/pdf'],
        min_files: 1,
        max_files: 50,
      },
    ],
    actionButton: {
      label: 'Extract Invoice Data',
    },
    execution: {
      engine: 'pyodide',
      dependencies: ['pandas', 'pdfminer.six'],
      outputFilename: 'extracted_invoices.csv',
      script:
        "import pandas as pd\nimport os\nimport re\nfrom datetime import datetime\nfrom pdfminer.high_level import extract_text\n\nFIELD_DIR = '/input_files/invoice_files'\n\n# Find PDF files\nfiles = [f for f in os.listdir(FIELD_DIR) if f.lower().endswith('.pdf')]\n\nif len(files) < 1:\n    raise ValueError('Please upload at least 1 PDF file')\n\nprint(f'Processing {len(files)} invoice(s)...')\n\ndef normalize_date(date_str):\n    \"\"\"Convert various date formats to YYYY-MM-DD\"\"\"\n    if not date_str or date_str == 'Not found':\n        return 'Not found'\n    \n    date_formats = [\n        '%B %d, %Y',      # December 5, 2024\n        '%B %d %Y',       # December 5 2024\n        '%b %d, %Y',      # Dec 5, 2024\n        '%b %d %Y',       # Dec 5 2024\n        '%Y-%m-%d',       # 2024-12-05\n        '%m/%d/%Y',       # 12/05/2024\n        '%d/%m/%Y',       # 05/12/2024\n    ]\n    \n    # Clean up the string\n    date_str = date_str.strip().replace(',', ', ').replace('  ', ' ')\n    \n    for fmt in date_formats:\n        try:\n            parsed = datetime.strptime(date_str.strip(), fmt)\n            return parsed.strftime('%Y-%m-%d')\n        except ValueError:\n            continue\n    \n    return date_str  # Return original if parsing fails\n\nresults = []\n\nfor filename in files:\n    filepath = os.path.join(FIELD_DIR, filename)\n    text = extract_text(filepath)\n    \n    # Extract business name (usually first non-empty line)\n    lines = [l.strip() for l in text.split('\\n') if l.strip()]\n    business_name = lines[0] if lines else 'Unknown'\n    \n    # Extract invoice number - try multiple patterns\n    invoice_number = None\n    invoice_patterns = [\n        r'INVOICE\\s*#\\s*([A-Za-z0-9\\-]+)',            # INVOICE #INV-2024-088\n        r'Invoice\\s*#:?\\s*([A-Za-z0-9\\-]+)',          # Invoice #: BL-1234\n        r'Invoice No:?\\s*([A-Za-z0-9\\-]+)',           # Invoice No: LM-456\n        r'Invoice Number:?\\s*([A-Za-z0-9\\-]+)',       # Invoice Number: 12345\n        r'Inv\\.?\\s*#:?\\s*([A-Za-z0-9\\-]+)',           # Inv #: 12345\n        r'Ref:?\\s*([A-Za-z0-9\\-]+)',                  # Ref: 12345\n    ]\n    for pattern in invoice_patterns:\n        match = re.search(pattern, text, re.IGNORECASE)\n        if match:\n            invoice_number = match.group(1)\n            break\n    if not invoice_number:\n        invoice_number = 'Not found'\n    \n    # Extract date - try multiple patterns\n    date = None\n    date_patterns = [\n        r'Date:\\s*([A-Za-z]+\\s+\\d{1,2},?\\s+\\d{4})',  # Date: December 5, 2024\n        r'Date:\\s*(\\d{4}-\\d{2}-\\d{2})',               # Date: 2024-12-05\n        r'Invoice Date:\\s*([A-Za-z]+\\s+\\d{1,2},?\\s+\\d{4})',  # Invoice Date: Dec 15, 2024\n        r'Invoice Date:\\s*(\\d{4}-\\d{2}-\\d{2})',       # Invoice Date: 2024-12-05\n        r'Dated:\\s*(\\d{1,2}/\\d{1,2}/\\d{4})',          # Dated: 12/05/2024\n    ]\n    for pattern in date_patterns:\n        match = re.search(pattern, text, re.IGNORECASE)\n        if match:\n            date = normalize_date(match.group(1))\n            break\n    if not date:\n        date = 'Not found'\n    \n    # Extract amount - try multiple patterns\n    amount = None\n    amount_patterns = [\n        r'Total Due:\\s*\\$?([\\d,]+\\.\\d{2})',           # Total Due: $4,800.00\n        r'AMOUNT DUE:\\s*\\$?([\\d,]+\\.\\d{2})',          # AMOUNT DUE: $1,234.00\n        r'Total:\\s*\\$?([\\d,]+\\.\\d{2})',               # Total: $1,234.00\n        r'Grand Total:\\s*\\$?([\\d,]+\\.\\d{2})',         # Grand Total: $1,234.00\n        r'Balance Due:\\s*\\$?([\\d,]+\\.\\d{2})',         # Balance Due: $1,234.00\n    ]\n    for pattern in amount_patterns:\n        match = re.search(pattern, text, re.IGNORECASE)\n        if match:\n            amount = match.group(1)\n            break\n    if not amount:\n        amount = 'Not found'\n    \n    results.append({\n        'source_file': filename,\n        'business_name': business_name,\n        'invoice_number': invoice_number,\n        'invoice_date': date,\n        'amount': amount\n    })\n    print(f'Processed: {filename}')\n\n# Create output DataFrame\ndf = pd.DataFrame(results)\n\noutput_path = '/output/extracted_invoices.csv'\ndf.to_csv(output_path, index=False)\nprint(f'\\nSuccessfully extracted data from {len(results)} invoice(s).')",
    },
  },
  {
    metadata: {
      id: 'brand-watermarker',
      category: 'Marketing',
      name: 'Corporate Brand Enforcer',
      description:
        'Auto-scale images and apply the official company watermark to all assets.',
      lastRun: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      numRuns: 312,
      numSaved: 45,
    },
    fields: [
      {
        id: 'target-assets',
        type: 'multi_file_upload',
        label: 'Upload Assets (Images/PDFs)',
        accept: [MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.pdf],
      },
      {
        id: 'watermark-logo',
        type: 'file_upload',
        label: 'Watermark File (PNG)',
        accept: [MIME_TYPES.png],
      },
      {
        id: 'opacity',
        type: 'text_input',
        label: 'Watermark Opacity (0-100)',
        placeholder: '30',
      },
    ],
    actionButton: {
      label: 'Apply Branding',
    },
    execution: {
      engine: 'pyodide',
      dependencies: ['pillow'],
      outputFilename: 'branded_assets.zip',
      script:
        "print('Applying watermark to assets...')\n# Real logic would use PIL to overlay images\nprint('Processing complete.')",
    },
  },
  {
    metadata: {
      id: 'legal-redactor',
      category: 'Legal',
      name: 'NDA & Contract Sanitizer',
      description:
        'Automatically identify and black-out PII (names, dates, amounts) for external sharing.',
      lastRun: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
      numRuns: 84,
      numSaved: 12,
    },
    fields: [
      {
        id: 'legal-docs',
        type: 'multi_file_upload',
        label: 'Upload Contracts',
        accept: [MIME_TYPES.pdf, MIME_TYPES.docx],
      },
      {
        id: 'sensitive-terms',
        type: 'text_input',
        label: 'Additional Terms to Redact (Comma separated)',
        placeholder: 'Project Apollo, Client X...',
      },
    ],
    actionButton: {
      label: 'Sanitize Docs',
    },
    execution: {
      engine: 'pyodide',
      dependencies: [],
      outputFilename: 'redacted_contracts.zip',
      script:
        "print('Scanning for PII...')\nprint('Redacting sensitive entities...')\nprint('Done.')",
    },
  },
  {
    metadata: {
      id: 'crm-cleaner',
      category: 'Sales',
      name: 'CRM Lead Scrubber',
      description:
        'Validate emails, format phone numbers, and remove duplicates from lead lists.',
      lastRun: new Date(Date.now() - 48 * 60 * 60 * 1000),
      numRuns: 55,
      numSaved: 21,
    },
    fields: [
      {
        id: 'raw-leads',
        type: 'file_upload',
        label: 'Raw Leads Export (CSV)',
        accept: [MIME_TYPES.csv, MIME_TYPES.xls, MIME_TYPES.xlsx],
      },
      {
        id: 'target-region',
        type: 'text_input',
        label: 'Target Region Filter',
        placeholder: 'e.g. North America',
      },
    ],
    actionButton: {
      label: 'Clean & Format',
    },
    execution: {
      engine: 'pyodide',
      dependencies: ['pandas'],
      outputFilename: 'clean_leads.csv',
      script:
        "import pandas as pd\nprint('Loading leads...')\nprint('Deduping against database...')\nprint('Validation complete.')",
    },
  },
];
