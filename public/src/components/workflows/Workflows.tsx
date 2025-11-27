import { Title, SimpleGrid, ActionIcon, Flex } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { workflows } from './workflowsData';
import WorkflowCard from './WorkflowCard';
import classes from './workflows.module.css';
import { STYLES } from 'public/src/consts/styling';

const Workflows = () => {
  const handleCreateWorkflow = () => {
    console.log('Create new workflow - implementation pending');
  };

  return (
    <Flex pt={'xl'} direction='column'>
      <Title order={1} mb='xl' fw={400}>
        Grunt Workflows
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='lg'>
        {workflows.map((workflow) => (
          <WorkflowCard key={workflow.metadata.id} workflow={workflow} />
        ))}
      </SimpleGrid>

      <ActionIcon
        className={classes.fab}
        onClick={handleCreateWorkflow}
        radius='lg'
        size={64}
        aria-label='Create new workflow'
        variant='gradient'
        gradient={{
          from: STYLES.COLORS.APP_THEME.SHADE_6,
          to: STYLES.COLORS.APP_THEME.SHADE_1,
          deg: 135,
        }}
      >
        <IconPlus size={36} stroke={2.5} />
      </ActionIcon>
    </Flex>
  );
};

export default Workflows;
