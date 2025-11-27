import { Flex, Text, ActionIcon } from '@mantine/core';
// import { TextInput } from '@mantine/core';
// import { Dropzone, FileWithPath } from '@mantine/dropzone';
// import { IconUpload, IconCircleChevronRight } from '@tabler/icons-react';
import { IconCircleChevronRight } from '@tabler/icons-react';
import { Workflow } from '@shared/types/workflows';
// import { WorkflowField } from '@shared/types/workflows';
import classes from '../workflows.module.css';
import { STYLES } from 'public/src/consts/styling';
// import { useState } from 'react';

interface WorkflowCardBodyProps {
  workflow: Workflow;
}

const WorkflowCardBody = ({ workflow }: WorkflowCardBodyProps) => {
  const { metadata } = workflow;
  // const { metadata, fields } = workflow;
  // State for form fields (kept for future use)
  // const [files, setFiles] = useState<Record<string, FileWithPath[]>>({});
  // const [textInputs, setTextInputs] = useState<Record<string, string>>({});

  // Helper to calculate input height (kept for future use)
  /* const getInputHeight = () => {
    if (fields.length === 1) {
      return 120;
    }
    return 56;
  };

  const inputHeight = getInputHeight(); */

  // Render field logic (kept for future use)
  /* const renderField = (field: WorkflowField) => {
    switch (field.type) {
      case 'multi_file_upload':
      case 'file_upload':
        return (
          <Dropzone
            key={field.id}
            onDrop={(droppedFiles) =>
              setFiles({ ...files, [field.id]: droppedFiles })
            }
            accept={field.accept}
            multiple={field.type === 'multi_file_upload'}
            className={classes.dropzoneArea}
          >
            <Flex
              direction='column'
              align='center'
              justify='center'
              gap='xs'
              style={{ minHeight: inputHeight }}
            >
              <IconUpload size={32} stroke={1.5} color='var(--inactive-icon)' />
              <Text size='sm' c='dimmed' ta='center'>
                {field.label}
              </Text>
            </Flex>
          </Dropzone>
        );

      case 'text_input':
        return (
          <TextInput
            radius='md'
            key={field.id}
            placeholder={field.placeholder}
            value={textInputs[field.id] || ''}
            onChange={(e) =>
              setTextInputs({ ...textInputs, [field.id]: e.target.value })
            }
            size='md'
            styles={{ input: { minHeight: inputHeight } }}
          />
        );

      default:
        return null;
    }
  }; */

  return (
    <Flex direction='column' style={{ flex: 1 }}>
      <Text size='sm' c='dimmed' lh={1.5} mb='xs' lineClamp={3}>
        {metadata.description}
      </Text>

      {/* Spacer to push content down - makes sure chevrons are always aligned */}
      <div style={{ flex: 1 }} />

      <Flex justify='flex-end' align='center' mb={'xs'}>
        <ActionIcon
          variant='transparent'
          className={classes.chevronIcon}
          size='sm'
          color={STYLES.COLORS.APP_THEME.SHADE_6}
        >
          <IconCircleChevronRight size={20} />
        </ActionIcon>
      </Flex>

      {/* 
      <Flex
          gap='md'
          direction='column'
          style={{ borderRadius: '12px' }}
        >
          <Stack gap='sm'>{fields.map((field) => renderField(field))}</Stack>

          <Button
            fullWidth
            size='md'
            variant='gradient'
            gradient={{
              from: COLORS.APP_THEME.SHADE_1,
              to: COLORS.APP_THEME.SHADE_6,
              deg: 135,
            }}
            onClick={(e) => {
              e.stopPropagation();
              actionButton.onClick();
            }}
          >
            {actionButton.label}
          </Button>
      </Flex> 
      */}
    </Flex>
  );
};

export default WorkflowCardBody;
