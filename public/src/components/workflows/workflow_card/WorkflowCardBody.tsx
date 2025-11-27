import { Flex, Text, ActionIcon } from '@mantine/core';
import { IconCircleChevronRight } from '@tabler/icons-react';
import { Workflow } from '@shared/types/workflows';
import classes from '../workflows.module.css';
import { STYLES } from 'public/src/consts/styling';

interface WorkflowCardBodyProps {
  workflow: Workflow;
  onClick: () => void;
}

const WorkflowCardBody = ({ workflow, onClick }: WorkflowCardBodyProps) => {
  const { metadata } = workflow;

  return (
    <Flex
      direction='column'
      className={classes.workflowCardBody}
      style={{ flex: 1, cursor: 'pointer' }}
      onClick={onClick}
    >
      <Text
        size='lg'
        fw={600}
        c='white'
        mt={'xs'}
        className={classes.workflowCardName}
      >
        {metadata.name}
      </Text>
      <Text size='sm' c='dimmed' lh={1.5} mb='xs' lineClamp={3}>
        {metadata.description}
      </Text>

      {/* Spacer to push content down - makes sure chevrons are always aligned */}
      <div style={{ flex: 1 }} />

      <Flex justify='flex-end' align='center' mb={'xs'}>
        <ActionIcon
          variant='transparent'
          className={classes.chevronIcon}
          size='sm'
          color={STYLES.COLORS.APP_THEME.SHADE_6}
        >
          <IconCircleChevronRight size={20} />
        </ActionIcon>
      </Flex>
    </Flex>
  );
};

export default WorkflowCardBody;
