import { Text, Flex } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { IconUpload } from '@tabler/icons-react';
import { WorkflowField } from '@shared/types/workflows';
import classes from '../workflows.module.css';

interface FileUploadFieldProps {
  field: WorkflowField;
  files: FileWithPath[];
  onDrop: (files: FileWithPath[]) => void;
}

const FileUploadField = ({ field, files, onDrop }: FileUploadFieldProps) => {
  return (
    <div>
      <Dropzone
        onDrop={onDrop}
        accept={field.accept}
        multiple={field.type === 'multi_file_upload'}
        h={120}
        className={classes.dropzoneArea}
      >
        <Flex align='center' justify='center' gap='xs' h={120}>
          <IconUpload stroke={1.5} color='var(--mantine-color-dimmed)' />
          {files && files.length > 0 ? (
            <Text size='sm' ta='center'>
              {files.map((f) => f.name).join(', ')}
            </Text>
          ) : (
            <Text size='sm' c='dimmed' ta='center'>
              Drag files here or click to browse
            </Text>
          )}
        </Flex>
      </Dropzone>
    </div>
  );
};

export default FileUploadField;
