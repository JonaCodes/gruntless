import { Flex } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import FileUploadSection from './FileUploadSection';
import FilePreviewSection from './FilePreviewSection';
import workflowFilesStore from 'public/src/stores/workflow-creator/workflowFilesStore';
import workflowChatStore from 'public/src/stores/workflow-creator/workflowChatStore';
import classes from './file_area.module.css';

const WorkflowCreatorFilesArea = observer(() => {
  const shouldFade =
    workflowFilesStore.allFilesApproved &&
    workflowChatStore.messages.length > 0;

  return (
    <Flex
      direction='column'
      h='100%'
      w={'100%'}
      justify='space-between'
      className={shouldFade ? classes.fadedSection : ''}
    >
      <Flex direction='column' h='100%' w={'100%'} gap='lg'>
        <FilePreviewSection />
      </Flex>
      <FileUploadSection />
    </Flex>
  );
});

export default WorkflowCreatorFilesArea;
