import { Flex, Box, Text } from '@mantine/core';
import classes from './MessageLoader.module.css';

interface MessageLoaderProps {
  text: string;
}

const MessageLoader = ({ text }: MessageLoaderProps) => {
  return (
    <Flex w='100%'>
      <Flex p='sm' gap='sm' align='center'>
        <Box className={classes.pulsingBubble} />
        <Text size='sm' className={classes.shimmerText}>
          {text || 'Processing...'}
        </Text>
      </Flex>
    </Flex>
  );
};

export default MessageLoader;
