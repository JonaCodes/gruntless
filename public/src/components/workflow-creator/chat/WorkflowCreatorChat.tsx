import { Flex } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import MessagesList from './MessagesList';
import ChatInput from './ChatInput';

const WorkflowCreatorChat = observer(() => {
  return (
    <Flex direction='column' h='100%' w='100%'>
      <MessagesList />
      <ChatInput />
    </Flex>
  );
});

export default WorkflowCreatorChat;
