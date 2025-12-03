import { observer } from 'mobx-react-lite';
import { Button, Flex } from '@mantine/core';
import { workflowTemplates } from '../../../data/workflowTemplates';
import workflowChatStore from '../../../stores/workflow-creator/workflowChatStore';
import classes from './TemplateSuggestions.module.css';

const TemplateSuggestions = observer(() => {
  const handleTemplateClick = (templateContent: string) => {
    workflowChatStore.setInputValue(templateContent);
    workflowChatStore.focusInput();
  };

  return (
    <Flex mb={-16} justify={'center'}>
      {workflowTemplates.map((template) => (
        <Button
          className={classes.suggestionButton}
          variant='subtle'
          key={template.id}
          color={'dimmed'}
          bg={'transparent'}
          onClick={() => handleTemplateClick(template.content)}
          fw={'normal'}
          mr={-16}
        >
          {template.label}
        </Button>
      ))}
    </Flex>
  );
});

export default TemplateSuggestions;
