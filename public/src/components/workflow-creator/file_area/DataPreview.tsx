import { observer } from 'mobx-react-lite';
import workflowFilesStore from 'public/src/stores/workflow-creator/workflowFilesStore';
import { EXTRACTION_STATUS } from '@shared/types/workflows';
import LoadingState from './previews/LoadingState';
import ErrorState from './previews/ErrorState';
import CsvPreview from './previews/CsvPreview';
import PdfPreview from './previews/PdfPreview';

interface DataPreviewProps {
  fileName: string;
}

const DataPreview = observer(({ fileName }: DataPreviewProps) => {
  const extract = workflowFilesStore.extractedFiles[fileName];
  const status = workflowFilesStore.getExtractionStatus(fileName);

  if (status === EXTRACTION_STATUS.EXTRACTING) {
    return <LoadingState />;
  }

  if (status === EXTRACTION_STATUS.ERROR) {
    const error = workflowFilesStore.extractionErrors[fileName];
    return <ErrorState error={error} />;
  }

  if (status === EXTRACTION_STATUS.SUCCESS && extract) {
    switch (extract.fileType) {
      case 'csv':
        return <CsvPreview extract={extract} />;
      case 'xlsx':
        return <CsvPreview extract={extract} />;
      case 'pdf':
        return <PdfPreview extract={extract} />;
      default:
        return (
          <ErrorState error={`Unsupported file type: ${extract.fileType}`} />
        );
    }
  }

  return null;
});

export default DataPreview;
