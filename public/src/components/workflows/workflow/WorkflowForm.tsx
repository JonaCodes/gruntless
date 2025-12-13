import { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Text,
  Alert,
  Group,
  Anchor,
  Flex,
  Paper,
} from '@mantine/core';
import { FileWithPath } from '@mantine/dropzone';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  WorkflowField,
  WorkflowAction,
  WorkflowExecution,
} from '@shared/types/workflows';
import { STYLES } from 'public/src/consts/styling';
import FileUploadField from './FileUploadField';
import TextInputField from './TextInputField';
import TextAreaField from './TextAreaField';
import WorkflowLogs from './WorkflowLogs';
import { usePyodideRunner } from '../../../hooks/usePyodideRunner';
import { EXECUTION_STATUS } from 'public/src/consts/pyodide';
import { trackWorkflowRun } from '../../../clients/workflows-client';

interface WorkflowFormProps {
  workflowId: string;
  fields: WorkflowField[];
  actionButton: WorkflowAction;
  execution?: WorkflowExecution;
}

const WorkflowForm = ({
  workflowId,
  fields,
  actionButton,
  execution,
}: WorkflowFormProps) => {
  const [files, setFiles] = useState<Record<string, FileWithPath[]>>({});
  const [textInputs, setTextInputs] = useState<Record<string, string>>({});

  const { run, status, error, output, textOutput, logs } = usePyodideRunner({
    dependencies: execution?.dependencies,
  });

  const handleRun = async () => {
    if (!execution) {
      actionButton.onClick();
      return;
    }

    const filesWithFieldIds = Object.entries(files).flatMap(
      ([fieldId, fileList]) => fileList.map((file) => ({ fieldId, file }))
    );

    await run(
      execution.script,
      filesWithFieldIds,
      textInputs,
      execution.outputFilename,
      execution.isTextOutput ?? false
    );
  };

  const handleDownload = () => {
    if (output && execution && execution.outputFilename) {
      const url = URL.createObjectURL(output);
      const a = document.createElement('a');
      a.href = url;
      a.download = execution.outputFilename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    if (status === EXECUTION_STATUS.SUCCESS) {
      if (output) {
        handleDownload();
        trackWorkflowRun(workflowId, true);
      } else if (textOutput) {
        // No download needed for text output
        trackWorkflowRun(workflowId, true);
      }
    } else if (status === EXECUTION_STATUS.ERROR) {
      trackWorkflowRun(workflowId, false);
    }
  }, [status, output, textOutput, workflowId]);

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

      case 'text_area':
        return (
          <TextAreaField
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

  const isStatusRunningOrLoading =
    status === EXECUTION_STATUS.RUNNING || status === EXECUTION_STATUS.LOADING;

  return (
    <Stack gap='lg'>
      <Stack gap='md'>{fields.map((field) => renderField(field))}</Stack>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title='Error' color='red'>
          {error}
        </Alert>
      )}

      <Flex direction='column' gap='4' align={'end'}>
        {status === EXECUTION_STATUS.SUCCESS && output && (
          <Alert
            icon={<IconCheck size={18} />}
            title='Success'
            color='green'
            radius='md'
          >
            <Text size='xs' mt={-4}>
              Your file(s) should download automatically.{' '}
              <Anchor component='button' onClick={handleDownload} size='xs'>
                Press here
              </Anchor>{' '}
              if they haven't.
            </Text>
          </Alert>
        )}

        {status === EXECUTION_STATUS.SUCCESS && textOutput && (
          <Paper p='md' withBorder w='100%'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {textOutput}
            </ReactMarkdown>
          </Paper>
        )}

        <WorkflowLogs logs={logs} />
      </Flex>

      <Group grow>
        <Button
          fullWidth
          size='md'
          variant='gradient'
          gradient={{
            from: STYLES.COLORS.APP_THEME.SHADE_1,
            to: STYLES.COLORS.APP_THEME.SHADE_6,
            deg: 135,
          }}
          onClick={handleRun}
          loading={isStatusRunningOrLoading}
          disabled={isStatusRunningOrLoading}
          mt='md'
        >
          {isStatusRunningOrLoading ? 'Processing...' : actionButton.label}
        </Button>
      </Group>
    </Stack>
  );
};

export default WorkflowForm;
