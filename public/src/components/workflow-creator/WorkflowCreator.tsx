import { observer } from 'mobx-react-lite';
import { Grid, Box } from '@mantine/core';
import WorkflowChat from './WorkflowChat';
import WorkflowFilePanel from './WorkflowFilePanel';

const WorkflowCreator = observer(() => {
  return (
    <Box>
      <Grid gutter={0}>
        <Grid.Col span={4}>
          <WorkflowChat />
        </Grid.Col>

        <Grid.Col span={8}>
          <WorkflowFilePanel />
        </Grid.Col>
      </Grid>
    </Box>
  );
});

export default WorkflowCreator;
