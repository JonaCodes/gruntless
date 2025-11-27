import { Flex, Badge, ActionIcon } from '@mantine/core';
import { IconShare, IconSettings, IconHeart } from '@tabler/icons-react';
import { WorkflowMetadata } from '@shared/types/workflows';
import { getBadgeColor } from '../utils';

interface WorkflowCardHeaderProps {
  metadata: WorkflowMetadata;
}

const WorkflowCardHeader = ({ metadata }: WorkflowCardHeaderProps) => {
  return (
    <Flex direction='column' gap='xs'>
      <Flex justify='space-between' align='center'>
        <Flex gap={'4'}>
          <ActionIcon variant='subtle' color='dimmed' size='xs' ml={-2}>
            <IconSettings size={16} />
          </ActionIcon>
          <ActionIcon variant='subtle' color='dimmed' size='xs'>
            <IconShare size={16} />
          </ActionIcon>
          <ActionIcon variant='subtle' color='dimmed' size='xs'>
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
};

export default WorkflowCardHeader;
