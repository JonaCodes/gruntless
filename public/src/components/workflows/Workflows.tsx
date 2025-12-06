import { useEffect } from 'react';
import { Title, ActionIcon, Flex, Loader, Center, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import WorkflowCard from './workflow_card/WorkflowCard';
import { STYLES } from 'public/src/consts/styling';
import classes from './workflows.module.css';
import gridClasses from './workflow/workflowGrid.module.css';
import appStore from '../../stores/appStore';
import { useNavigate } from 'react-router-dom';

const Workflows = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    appStore.loadWorkflows();
  }, []);

  const handleCreateWorkflow = () => {
    navigate('/workflows/new');
  };

  if (appStore.isLoadingWorkflows) {
    return <Loader />;
  }

  if (appStore.workflowsError) {
    return (
      <Center h={200}>
        <Text c='red'>{appStore.workflowsError}</Text>
      </Center>
    );
  }

  return (
    <Flex pt={'xl'} direction='column'>
      <Title order={1} mb='xl' fw={400}>
        Grunt Workflows
      </Title>

      <div
        className={gridClasses.workflowGrid}
        data-workflow-navbar-open={appStore.workflowNavbarOpened}
      >
        {appStore.workflows.map((workflow) => (
          <WorkflowCard key={workflow.metadata.id} workflow={workflow} />
        ))}
      </div>

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
});

export default Workflows;
