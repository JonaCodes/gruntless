import { observer } from 'mobx-react-lite';
import { Flex, Box, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { WorkflowMessage } from '@shared/types/workflowChat';
import { WORKFLOW_MESSAGE_ROLE } from '@shared/consts/workflows';
import classes from './ChatMessage.module.css';

interface ChatMessageProps {
  message: WorkflowMessage;
}

const ChatMessage = observer(({ message }: ChatMessageProps) => {
  const isUser = message.role === WORKFLOW_MESSAGE_ROLE.USER;

  return (
    <Flex justify={isUser ? 'flex-end' : 'flex-start'} w="100%">
      <Box
        className={`${classes.messageBubble} ${
          isUser ? classes.userMessage : classes.assistantMessage
        }`}
        maw="70%"
      >
        {message.linkTo ? (
          <Link to={message.linkTo} style={{ textDecoration: 'none' }}>
            <Text size="sm" style={{ whiteSpace: 'pre-wrap', textDecoration: 'underline', cursor: 'pointer' }}>
              {message.content}
            </Text>
          </Link>
        ) : (
          <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
            {message.content}
          </Text>
        )}
      </Box>
    </Flex>
  );
});

export default ChatMessage;
