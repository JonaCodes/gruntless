import { observer } from 'mobx-react-lite';
import { Notification } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import workflowSharingStore from '../../stores/workflowSharingStore';

export const WorkflowsNotification = observer(() => {
  if (!workflowSharingStore.notification) return null;
  return (
    <Notification
      icon={
        workflowSharingStore.notification.type === 'success' ? (
          <IconCheck size={18} />
        ) : (
          <IconX size={18} />
        )
      }
      color={
        workflowSharingStore.notification.type === 'success' ? 'green' : 'red'
      }
      title={
        workflowSharingStore.notification.type === 'success'
          ? 'Share link copied to clipboard!'
          : 'Failed to create share'
      }
      onClose={() => workflowSharingStore.clearNotification()}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
      }}
    >
      {workflowSharingStore.notification.type === 'success'
        ? 'Share it with anyone'
        : 'Please try again'}
    </Notification>
  );
});
