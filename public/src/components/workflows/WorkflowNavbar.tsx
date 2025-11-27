import { Flex, Title, ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { workflows } from './workflowsData';
import WorkflowForm from './workflow_detail/WorkflowForm';
import { STYLES } from 'public/src/consts/styling';

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

      <WorkflowForm fields={fields} actionButton={actionButton} />
    </Flex>
  );
};

export default WorkflowNavbar;
