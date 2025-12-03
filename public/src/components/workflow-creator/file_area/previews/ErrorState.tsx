import { Stack, Text, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface ErrorStateProps {
  error?: string;
}

const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <Stack gap='xs' py='xs'>
      <Alert icon={<IconAlertCircle size={16} />} color='red' variant='light'>
        <Text size='xs' fw={500}>
          Failed to extract data
        </Text>
        {error && (
          <Text size='xs' c='dimmed' mt={4}>
            {error}
          </Text>
        )}
      </Alert>
    </Stack>
  );
};

export default ErrorState;
