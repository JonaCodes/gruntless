import { useState } from 'react';
import { Stack, Button } from '@mantine/core';
import { FileWithPath } from '@mantine/dropzone';
import { WorkflowField, WorkflowAction } from '@shared/types/workflows';
import { STYLES } from 'public/src/consts/styling';
import FileUploadField from './FileUploadField';
import TextInputField from './TextInputField';

interface WorkflowFormProps {
  fields: WorkflowField[];
  actionButton: WorkflowAction;
}

const WorkflowForm = ({ fields, actionButton }: WorkflowFormProps) => {
  const [files, setFiles] = useState<Record<string, FileWithPath[]>>({});
  const [textInputs, setTextInputs] = useState<Record<string, string>>({});

  const renderField = (field: WorkflowField) => {
    switch (field.type) {
      case 'multi_file_upload':
      case 'file_upload':
        return (
          <FileUploadField
            key={field.id}
            field={field}
            files={files[field.id] || []}
            onDrop={(droppedFiles) =>
              setFiles({ ...files, [field.id]: droppedFiles })
            }
          />
        );

      case 'text_input':
        return (
          <TextInputField
            key={field.id}
            field={field}
            value={textInputs[field.id] || ''}
            onChange={(value) =>
              setTextInputs({ ...textInputs, [field.id]: value })
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <Stack gap='lg'>
      <Stack gap='md'>{fields.map((field) => renderField(field))}</Stack>

      <Button
        fullWidth
        size='md'
        variant='gradient'
        gradient={{
          from: STYLES.COLORS.APP_THEME.SHADE_1,
          to: STYLES.COLORS.APP_THEME.SHADE_6,
          deg: 135,
        }}
        onClick={actionButton.onClick}
        mt='md'
      >
        {actionButton.label}
      </Button>
    </Stack>
  );
};

export default WorkflowForm;
