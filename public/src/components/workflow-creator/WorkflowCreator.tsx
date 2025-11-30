import { observer } from 'mobx-react-lite';
import { Flex } from '@mantine/core';
import WorkflowCreatorFilesArea from './WorkflowCreatorFilesArea';
import WorkflowCreatorChat from './WorkflowCreatorChat';
import workflowsNavbarClasses from '../workflows/workflowsNavbar.module.css';
import { STYLES } from 'public/src/consts/styling';

const WorkflowCreator = observer(() => {
  const CHAT_AREA_RATIO = 0.3;

  return (
    <Flex h='100%'>
      <Flex py={STYLES.SPACING.XXL} flex={CHAT_AREA_RATIO * 10}>
        <WorkflowCreatorChat />
      </Flex>

      <Flex
        className={workflowsNavbarClasses['workflow-navbar']}
        flex={(1 - CHAT_AREA_RATIO) * 10}
        pos='relative' // for the beam separator
        pl='xl' // push away from the beam without adding extra padding on the right
        py={STYLES.SPACING.XXL}
      >
        <WorkflowCreatorFilesArea />
      </Flex>
    </Flex>
  );
});

export default WorkflowCreator;
