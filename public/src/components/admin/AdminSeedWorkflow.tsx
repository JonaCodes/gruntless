import { useState } from 'react';
import {
  Container,
  Title,
  Textarea,
  Button,
  Alert,
  Stack,
  Paper,
  Code,
  Text,
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import userStore from '../../stores/userStore';
import { seedWorkflow } from '../../clients/workflows-client';
import { useNavigate } from 'react-router-dom';

const ADMIN_EMAIL = 'jonathanfarache@gmail.com';

const EXAMPLE_JSON = `{
  "name": "User Data Merger",
  "description": "Merges Age and City data based on User ID.",
  "actionButtonLabel": "Merge Files",
  "estSavedMinutes": 7,
  "fields": [
    {
      "id": "source_files",
      "type": "multi_file_upload",
      "label": "Upload CSV Files",
      "accept": ["text/csv"],
      "min_files": 2,
      "max_files": 2
    }
  ],
  "execution": {
    "dependencies": ["pandas"],
    "outputFilename": "merged_user_data.csv",
    "script": "import pandas as pd\\nprint('Processing...')"
  }
}`;

const AdminSeedWorkflow = observer(() => {
  const [jsonInput, setJsonInput] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  if (!userStore.user || userStore.user.email !== ADMIN_EMAIL) {
    navigate('/oops/forbidden');
    return;
  }

  const handleSubmit = async () => {
    setStatus('loading');
    setMessage('');

    try {
      const parsed = JSON.parse(jsonInput);
      await seedWorkflow(parsed);
      setStatus('success');
      setMessage(`Workflow created successfully!`);
      setJsonInput('');
    } catch (error: any) {
      setStatus('error');
      if (error instanceof SyntaxError) {
        setMessage('Invalid JSON: ' + error.message);
      } else {
        setMessage(error.message || 'Failed to create workflow');
      }
    }
  };

  return (
    <Container size='md' py='xl'>
      <Title order={1} mb='lg'>
        Seed Workflow (Admin)
      </Title>

      <Stack gap='md'>
        <Paper p='md' withBorder>
          <Text fw={500} mb='sm'>
            Example JSON Format:
          </Text>
          <Code block style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
            {EXAMPLE_JSON}
          </Code>
        </Paper>

        <Textarea
          label='Workflow JSON'
          placeholder='Paste workflow JSON here...'
          minRows={15}
          autosize
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />

        {status === 'success' && (
          <Alert color='green' icon={<IconCheck size={16} />}>
            {message}
          </Alert>
        )}
        {status === 'error' && (
          <Alert color='red' icon={<IconX size={16} />}>
            {message}
          </Alert>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!jsonInput.trim() || status === 'loading'}
          loading={status === 'loading'}
        >
          Create Workflow
        </Button>
      </Stack>
    </Container>
  );
});

export default AdminSeedWorkflow;
