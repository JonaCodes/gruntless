import { useState } from 'react';
import { Stack, Text, Code, UnstyledButton, Group } from '@mantine/core';

interface WorkflowLogsProps {
  logs: { type: 'stdout' | 'stderr'; message: string }[];
}

const WorkflowLogs = ({ logs }: WorkflowLogsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (logs.length === 0) return null;

  return (
    <Stack gap='xs' align='end'>
      <UnstyledButton onClick={() => setIsOpen(!isOpen)}>
        <Group gap='xs'>
          <Text size='xs' fw={500} c='dimmed' style={{ cursor: 'pointer' }}>
            {isOpen ? 'Hide details' : 'Show details'}
          </Text>
        </Group>
      </UnstyledButton>

      {isOpen && (
        <Code block mah={200} style={{ overflowY: 'auto' }}>
          {logs.map((log, i) => (
            <div
              key={i}
              style={{ color: log.type === 'stderr' ? 'red' : 'inherit' }}
            >
              {log.message}
            </div>
          ))}
        </Code>
      )}
    </Stack>
  );
};

export default WorkflowLogs;
