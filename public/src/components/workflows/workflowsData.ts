import { MIME_TYPES } from '@mantine/dropzone';

export const workflows: any[] = [
  {
    metadata: {
      id: 'csv-merger-v1',
      name: 'User Data Merger',
      description: 'Merges Age and City data based on User ID.',
      category: 'Sales',
      lastRun: null,
      numRuns: 0,
      numSaved: 0,
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
      id: 'pdf-extractor',
      category: 'Finance',
      name: 'PDF Extractor',
      description: 'Extract specific tables and data points from invoices.',
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      numRuns: 89,
      numSaved: 14,
    },
    fields: [
      {
        id: 'pdf-invoice',
        type: 'file_upload',
        label: 'Upload PDF Invoice',
        accept: [MIME_TYPES.pdf],
      },
      {
        id: 'target-excel',
        type: 'file_upload',
        label: 'Target Excel Sheet',
        accept: [MIME_TYPES.xlsx, MIME_TYPES.xls],
      },
    ],
    actionButton: {
      label: 'Extract Data',
    },
    execution: {
      engine: 'pyodide',
      dependencies: [],
      outputFilename: 'extracted_data.txt',
      script:
        "print('Hello from PDF Extractor')\nwith open('/output/extracted_data.txt', 'w') as f:\n    f.write('PDF extraction not yet implemented')",
    },
  },
  {
    metadata: {
      id: 'osher-add-quotes',
      category: 'Internal',
      name: 'Osher-Ad Aggregates For Big Boss',
      description: 'Add quotes to your documents automatically.',
      lastRun: null,
      numRuns: 0,
    },
    fields: [
      {
        id: 'document-upload',
        type: 'file_upload',
        label: 'Upload sales doc',
        accept: [MIME_TYPES.pdf, MIME_TYPES.docx, 'text/plain'],
      },
      {
        id: 'quote-text',
        type: 'text_input',
        label: 'Enter quote to insert...',
        placeholder: 'Enter quote to insert...',
      },
    ],
    actionButton: {
      label: 'Add & Process',
    },
    execution: {
      engine: 'pyodide',
      dependencies: [],
      outputFilename: 'processed_document.txt',
      script:
        "print('Hello from Osher-Ad Aggregates')\nwith open('/output/processed_document.txt', 'w') as f:\n    f.write('Document processing not yet implemented')",
    },
  },
];
