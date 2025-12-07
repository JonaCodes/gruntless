import { observer } from 'mobx-react-lite';
import { Flex, Badge, ActionIcon, Loader } from '@mantine/core';
import { IconShare, IconSettings, IconHeart } from '@tabler/icons-react';
import { WorkflowMetadata } from '@shared/types/workflows';
import { getBadgeColor } from '../utils';
import workflowSharingStore from '../../../stores/workflowSharingStore';
import classes from '../workflows.module.css';

interface WorkflowCardHeaderProps {
  metadata: WorkflowMetadata;
}

const WorkflowCardHeader = observer(({ metadata }: WorkflowCardHeaderProps) => {
  const handleShare = async () => workflowSharingStore.handleShare(metadata);

  return (
    <Flex direction='column' gap='xs'>
      <Flex justify='space-between' align='center'>
        <Flex gap={'4'}>
          <ActionIcon
            disabled
            variant='subtle'
            color='dimmed'
            size='xs'
            ml={-2}
          >
            <IconSettings size={16} />
          </ActionIcon>

          {workflowSharingStore.isCreatingShare ? (
            <Loader size={16} />
          ) : (
            <ActionIcon
              variant='subtle'
              color='dimmed'
              size='xs'
              onClick={handleShare}
            >
              <IconShare className={classes.headerInteractions} size={16} />
            </ActionIcon>
          )}

          <ActionIcon disabled variant='subtle' color='dimmed' size='xs'>
            <IconHeart size={16} />
          </ActionIcon>
        </Flex>
        <Flex gap='xs' align='center'>
          <Badge
            variant='light'
            radius='sm'
            color={getBadgeColor(metadata.category)}
            styles={{ root: { textTransform: 'uppercase' } }}
          >
            {metadata.category}
          </Badge>
        </Flex>
      </Flex>
    </Flex>
  );
});

export default WorkflowCardHeader;
