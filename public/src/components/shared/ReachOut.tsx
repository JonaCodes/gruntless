import { Button, Text } from '@mantine/core';

export const ReachOut = ({ text }: { text: string }) => {
  return (
    <Text
      fz={14}
      ta={'center'}
      style={{ display: 'flex', alignItems: 'center', gap: 2 }}
    >
      {text}{' '}
      <Button
        component='a'
        href='mailto:support@quillside.com'
        variant='subtle'
        m={0}
        p={0}
      >
        support@quillside.com
      </Button>
    </Text>
  );
};
