import { observer } from 'mobx-react-lite';
import { Flex, Textarea, ActionIcon } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import workflowChatStore from '../../../stores/workflow-creator/workflowChatStore';
import { STYLES } from '../../../consts/styling';

const ChatInput = observer(() => {
  const handleSend = () => {
    if (!workflowChatStore.inputValue.trim()) return;

    workflowChatStore.addUserMessage(workflowChatStore.inputValue.trim());
    workflowChatStore.setInputValue('');

    // TODO: Trigger API call for assistant response
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Flex pt={'lg'}>
      <Textarea
        flex={1}
        placeholder={workflowChatStore.inputPlaceholder}
        value={workflowChatStore.inputValue}
        onChange={(e) => workflowChatStore.setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={workflowChatStore.isInputDisabled}
        autosize
        minRows={1}
        maxRows={4}
        variant='filled'
        radius='xl'
        autoFocus
        rightSection={
          <ActionIcon
            variant='transparent'
            onClick={handleSend}
            disabled={
              !workflowChatStore.inputValue.trim() ||
              workflowChatStore.isInputDisabled
            }
            radius='xl'
            color={STYLES.COLORS.APP_THEME.SHADE_1}
          >
            <IconSend size={18} />
          </ActionIcon>
        }
        rightSectionWidth={32}
        styles={{
          input: {
            paddingRight: 28,
          },
        }}
      />
    </Flex>
  );
});

export default ChatInput;
