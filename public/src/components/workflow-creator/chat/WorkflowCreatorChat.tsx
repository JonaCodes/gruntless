import { Flex } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import MessagesList from './MessagesList';
import ChatInput from './ChatInput';
import TemplateSuggestions from './TemplateSuggestions';
import { SecurityGuarantee } from 'public/src/components/workflows/workflow/SecurityGuarantee';
import workflowFilesStore from 'public/src/stores/workflow-creator/workflowFilesStore';
import workflowChatStore from 'public/src/stores/workflow-creator/workflowChatStore';

const WorkflowCreatorChat = observer(() => {
  return (
    <Flex direction='column' h='100%' w='100%'>
      <MessagesList />
      {workflowChatStore.shouldShowTemplateSuggestions && (
        <TemplateSuggestions />
      )}
      <ChatInput />
      {workflowFilesStore.allFilesApproved && (
        <SecurityGuarantee type='chat' />
      )}
    </Flex>
  );
});

export default WorkflowCreatorChat;
