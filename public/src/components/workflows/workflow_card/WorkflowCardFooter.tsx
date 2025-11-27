import { Card, Flex, Text } from '@mantine/core';
import { WorkflowMetadata } from '@shared/types/workflows';

interface WorkflowCardFooterProps {
  metadata: WorkflowMetadata;
}

const WorkflowCardFooter = ({ metadata }: WorkflowCardFooterProps) => {
  const formatLastRun = (date: Date | null) => {
    if (!date) return '';

    let lastRun = '';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 1) lastRun = 'Yesterday';
    else if (diffDays > 1) lastRun = `${diffDays} days ago`;
    else if (diffHours > 0) lastRun = `${diffHours}h ago`;
    else lastRun = 'Just now';

    return `Last Run: ${lastRun}`;
  };

  return (
    <Card.Section p='xs' bg='dark.5'>
      <Flex justify='space-between' align='center'>
        <Flex gap='2' align='center'>
          <Text size='xs' c='dimmed'>
            {metadata.numRuns} runs {metadata.numRuns === 0 ? 'for now' : ''}
            {metadata.numSaved && ` • ${metadata.numSaved}h saved`}
          </Text>
        </Flex>
        <Flex align='center'>
          <Text size='xs' c='dimmed'>
            {formatLastRun(metadata.lastRun)}
          </Text>
        </Flex>
      </Flex>
    </Card.Section>
  );
};

export default WorkflowCardFooter;
