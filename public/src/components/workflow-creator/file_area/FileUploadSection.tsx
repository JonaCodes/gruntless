import { Text, Flex } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { IconUpload } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import workflowFilesStore from 'public/src/stores/workflow-creator/workflowFilesStore';
import classes from '../../workflows/workflows.module.css';
import { SecurityGuarantee } from '../../workflows/workflow/SecurityGuarantee';
import {
  extractFilePreview,
  getFileType,
} from 'public/src/lib/file-extraction/handlers';
import { FileExtract, EXTRACTION_STATUS } from '@shared/types/workflows';

const FileUploadSection = observer(() => {
  const handleDrop = async (files: FileWithPath[]) => {
    workflowFilesStore.addFiles(files);

    files.forEach(async (file) => {
      workflowFilesStore.setExtractionStatus(
        file.name,
        EXTRACTION_STATUS.EXTRACTING
      );

      try {
        const extraction = await extractFilePreview(file, 3);
        const fileType = getFileType(file.name);

        if (!fileType) {
          throw new Error('Unsupported file type');
        }

        const fileExtract: FileExtract = {
          fileName: file.name,
          fileType,
          columns: extraction.columns,
          sample_rows: extraction.rows,
          row_count: extraction.rowCount,
        };

        workflowFilesStore.setExtractedFiles({
          ...workflowFilesStore.extractedFiles,
          [file.name]: fileExtract,
        });

        workflowFilesStore.setExtractionStatus(
          file.name,
          EXTRACTION_STATUS.SUCCESS
        );
      } catch (error) {
        console.error(`Failed to extract preview for ${file.name}:`, error);

        workflowFilesStore.setExtractionStatus(file.name, EXTRACTION_STATUS.ERROR);
        workflowFilesStore.setExtractionError(
          file.name,
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    });
  };

  return (
    <Dropzone
      onDrop={handleDrop}
      multiple={true}
      h={150}
      className={classes.dropzoneArea}
    >
      <Flex align='center' justify='center' direction='column' h={150}>
        <Flex align='center' gap='xs'>
          <IconUpload stroke={1.5} />
          {workflowFilesStore.hasFiles ? (
            <Text size='sm' ta='center'>
              {workflowFilesStore.uploadedFiles.length} file
              {workflowFilesStore.uploadedFiles.length !== 1 ? 's' : ''}{' '}
              selected
            </Text>
          ) : (
            <Text size='sm' ta='center'>
              Upload files used in your gruntwork
            </Text>
          )}
        </Flex>
        <SecurityGuarantee />
      </Flex>
    </Dropzone>
  );
});

export default FileUploadSection;
