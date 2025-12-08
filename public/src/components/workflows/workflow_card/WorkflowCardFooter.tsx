import { Card, Flex, Text } from '@mantine/core';
import { WorkflowMetadata } from '@shared/types/workflows';

interface WorkflowCardFooterProps {
  metadata: WorkflowMetadata;
}

const WorkflowCardFooter = ({ metadata }: WorkflowCardFooterProps) => {
  const formatLastRun = (dateString: string | null) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    let lastRun = '';

    if (diffSeconds <= 30) {
      lastRun = 'Just now';
    } else if (diffMinutes < 60) {
      lastRun = `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      lastRun = `${diffHours}h ago`;
    } else if (diffDays === 1) {
      lastRun = 'Yesterday';
    } else {
      lastRun = `${diffDays} days ago`;
    }

    return `Last Run: ${lastRun}`;
  };

  const runsText = metadata.numRuns > 1 ? 'successful runs' : 'run';
  const numRuns = metadata.numRuns || 0;

  return (
    <Card.Section p='xs' bg='dark.5'>
      <Flex justify='space-between' align='center'>
        <Flex gap='2' align='center'>
          <Text size='xs' c='dimmed'>
            {numRuns} {runsText} {numRuns === 0 ? 'for now' : ''}
            {/* TODO: in the future, get estimate from user for how long it saves. Then show this here */}
            {/* {metadata.numSaved &&
              ` • ${Math.round(metadata.numSaved * 10) / 10}h saved`} */}
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
