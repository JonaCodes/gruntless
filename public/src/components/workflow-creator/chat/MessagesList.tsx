import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import { Flex, ScrollArea } from '@mantine/core';
import workflowChatStore from '../../../stores/workflow-creator/workflowChatStore';
import ChatMessage from './ChatMessage';
import MessageLoader from './MessageLoader';

const MessagesList = observer(() => {
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({
        top: scrollViewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [workflowChatStore.messages.length]);

  return (
    <ScrollArea viewportRef={scrollViewportRef} h='100%'>
      <Flex h='100%' direction='column' gap='md'>
        {workflowChatStore.messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {workflowChatStore.shouldShowLoader && (
          <MessageLoader text={workflowChatStore.loaderText} />
        )}
      </Flex>
    </ScrollArea>
  );
});

export default MessagesList;
