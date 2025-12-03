import { Stack, Loader, Text } from '@mantine/core';

const LoadingState = () => {
  return (
    <Stack align='center' gap='xs' py='md'>
      <Loader size='sm' />
      <Text size='xs' c='dimmed'>
        Extracting data in a safe, local environment...
      </Text>
    </Stack>
  );
};

export default LoadingState;
