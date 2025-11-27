import { Card } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Workflow } from '@shared/types/workflows';
import classes from '../workflows.module.css';
import appStore from '../../../stores/appStore';
import WorkflowCardHeader from './WorkflowCardHeader';
import WorkflowCardBody from './WorkflowCardBody';
import WorkflowCardFooter from './WorkflowCardFooter';

interface WorkflowCardProps {
  workflow: Workflow;
}

const WorkflowCard = observer(({ workflow }: WorkflowCardProps) => {
  const [, setSearchParams] = useSearchParams();
  const isActive = appStore.selectedWorkflowId === workflow.metadata.id;

  const handleBodyClick = () => {
    setSearchParams({ workflow: workflow.metadata.id });
  };

  return (
    <Card
      padding='md'
      radius='md'
      bg='dark.6'
      withBorder
      className={classes.workflowCard}
      data-active={isActive}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <WorkflowCardHeader metadata={workflow.metadata} />
      <WorkflowCardBody workflow={workflow} onClick={handleBodyClick} />
      <WorkflowCardFooter metadata={workflow.metadata} />
    </Card>
  );
});

export default WorkflowCard;
