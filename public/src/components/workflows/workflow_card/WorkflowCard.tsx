import { Card } from '@mantine/core';
import { Workflow } from '@shared/types/workflows';
import classes from '../workflows.module.css';
import WorkflowCardHeader from './WorkflowCardHeader';
import WorkflowCardBody from './WorkflowCardBody';
import WorkflowCardFooter from './WorkflowCardFooter';

interface WorkflowCardProps {
  workflow: Workflow;
}

const WorkflowCard = ({ workflow }: WorkflowCardProps) => {
  const handleCardClick = () => {
    console.log(`Workflow clicked: ${workflow.metadata.id}`);
  };

  return (
    <Card
      padding='md'
      radius='md'
      bg='dark.6'
      withBorder
      className={classes.workflowCard}
      onClick={handleCardClick}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <WorkflowCardHeader metadata={workflow.metadata} />
      <WorkflowCardBody workflow={workflow} />
      <WorkflowCardFooter metadata={workflow.metadata} />
    </Card>
  );
};

export default WorkflowCard;
