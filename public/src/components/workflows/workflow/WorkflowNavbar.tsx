import { Flex, Title, ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { workflows } from '../workflowsData';
import WorkflowForm from './WorkflowForm';
import { STYLES } from 'public/src/consts/styling';
import { SecurityGuarantee } from './SecurityGuarantee';

interface WorkflowNavbarProps {
  workflowId: string;
  onClose: () => void;
}

const WorkflowNavbar = ({ workflowId, onClose }: WorkflowNavbarProps) => {
  const workflow = workflows.find((w) => w.metadata.id === workflowId);

  if (!workflow) {
    return null;
  }

  const { metadata, fields, actionButton } = workflow;

  return (
    <Flex direction='column' h='100%' mt={'xl'}>
      <Flex justify='space-between' align='start' mb='lg'>
        <Title order={4} fw={400}>
          {metadata.name}
        </Title>
        <ActionIcon
          variant='subtle'
          onClick={onClose}
          size='md'
          aria-label='Close workflow'
          color={STYLES.COLORS.APP_THEME.SHADE_6}
        >
          <IconX size={18} />
        </ActionIcon>
      </Flex>

      <WorkflowForm
        key={workflowId}
        fields={fields}
        actionButton={actionButton}
        execution={workflow.execution}
      />

      <SecurityGuarantee />
    </Flex>
  );
};

export default WorkflowNavbar;
