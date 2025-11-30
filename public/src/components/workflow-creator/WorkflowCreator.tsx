import { observer } from 'mobx-react-lite';
import { Flex } from '@mantine/core';
import WorkflowCreatorFilesArea from './file_area/WorkflowCreatorFilesArea';
import WorkflowCreatorChat from './chat/WorkflowCreatorChat';
import workflowsNavbarClasses from '../workflows/workflowsNavbar.module.css';
import { STYLES } from 'public/src/consts/styling';

const WorkflowCreator = observer(() => {
  const CHAT_AREA_RATIO = 0.35;

  return (
    <Flex h='100%'>
      <Flex
        h='100%'
        flex={CHAT_AREA_RATIO * 10}
        pt={STYLES.SPACING.XXL}
        pb={'xl'}
        pr={'xl'} // push away from the beam without adding extra padding on the left
      >
        <WorkflowCreatorChat />
      </Flex>

      <Flex
        h='100%'
        className={workflowsNavbarClasses['workflow-navbar']}
        flex={(1 - CHAT_AREA_RATIO) * 10}
        pos='relative' // for the beam separator
        pt={STYLES.SPACING.XXL}
        pb={'xl'}
        pl='xl' // push away from the beam without adding extra padding on the right
      >
        <WorkflowCreatorFilesArea />
      </Flex>
    </Flex>
  );
});

export default WorkflowCreator;
