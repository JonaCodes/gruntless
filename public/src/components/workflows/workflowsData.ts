import { Workflow } from '@shared/types/workflows';
import { MIME_TYPES } from '@mantine/dropzone';

// Placeholder action handlers
const handleMergeFiles = () => {
  console.log('Merge Files clicked - implementation pending');
};

const handleExtractData = () => {
  console.log('Extract Data clicked - implementation pending');
};

const handleAddAndProcess = () => {
  console.log('Add & Process clicked - implementation pending');
};

export const workflows: Workflow[] = [
  {
    metadata: {
      id: 'csv-merger',
      category: 'Sales',
      name: 'CSV Merger',
      description:
        'Combine multiple CSV files into one master dataset automatically.',
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      numRuns: 142,
      numSaved: 28,
    },
    fields: [
      {
        id: 'csv-files',
        type: 'multi_file_upload',
        label: 'Drop CSV files here',
        accept: [MIME_TYPES.csv, 'text/csv'],
      },
    ],
    actionButton: {
      label: 'Merge Files',
      onClick: handleMergeFiles,
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
      onClick: handleExtractData,
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
      onClick: handleAddAndProcess,
    },
  },
];
