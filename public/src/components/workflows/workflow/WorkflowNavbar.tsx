import { Flex, Title, ActionIcon, Loader } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import WorkflowForm from './WorkflowForm';
import { STYLES } from 'public/src/consts/styling';
import { SecurityGuarantee } from './SecurityGuarantee';
import appStore from 'public/src/stores/appStore';
import { observer } from 'mobx-react-lite';
interface WorkflowNavbarProps {
  workflowId: string;
  onClose: () => void;
}

const WorkflowNavbar = observer(
  ({ workflowId, onClose }: WorkflowNavbarProps) => {
    if (appStore.isLoadingWorkflows || appStore.workflows.length === 0) {
      return <Loader />;
    }

    const workflow = appStore.workflows.find(
      (w) => w.metadata.id === workflowId
    );

    if (!workflow) return null;
    const { metadata, fields, actionButton } = workflow;

    return (
      <Flex
        direction='column'
        h='100%'
        mt={{ base: 'xl', sm: 'xs' }}
        style={{ overflowY: 'auto' }}
      >
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
          workflowId={workflowId}
          fields={fields}
          actionButton={actionButton}
          execution={workflow.execution}
        />

        <SecurityGuarantee />
      </Flex>
    );
  }
);

export default WorkflowNavbar;
