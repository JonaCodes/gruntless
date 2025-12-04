import { observer } from 'mobx-react-lite';
import { Alert, Flex, List, ListItem, Text } from '@mantine/core';
import { IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react';
import workflowFilesStore from '../../../stores/workflow-creator/workflowFilesStore';
import workflowChatStore from '../../../stores/workflow-creator/workflowChatStore';

const OnboardingAlert = observer(() => {
  if (workflowChatStore.messages.length > 0) {
    return null;
  }

  const getAlertContent = () => {
    if (!workflowFilesStore.hasFiles) {
      return {
        title: 'Welcome to the grunt workflow builder!',
        content: (
          <>
            <Text fz={'sm'}>
              To start, please upload{' '}
              <strong>one example of each unique file</strong> involved in your
              gruntwork, for instance:
            </Text>
            <List mt={-8}>
              <ListItem>
                <Text fz={'sm'}>
                  Merging 3 CSVs with different layouts? Upload one of each
                </Text>
              </ListItem>
              <ListItem>
                <Text fz={'sm'}>
                  Merging <em>identically structured</em> CSVs? Upload just one
                  of them
                </Text>
              </ListItem>
            </List>
            <Text fz={'sm'}>
              And don't worry, <strong>your data stays 100% local</strong>
              <br />
              We only take a quick scan of their structure
            </Text>
          </>
        ),
        step: 1,
      };
    }

    if (!workflowFilesStore.allFilesApproved) {
      return {
        title: 'Review the data extracts',
        content: (
          <>
            <Text fz={'sm'}>
              The sanitized data extracts on the right{' '}
              <strong>will be sent to our AI agent</strong> to help build your
              workflow
            </Text>
            <Text fz={'sm'}>Double check nothing sensitive is exposed</Text>
          </>
        ),
        step: 2,
      };
    }

    return {
      title: "Let's get rid of your gruntwork!",
      content: (
        <>
          <Text fz={'sm'}>
            You may now describe your workflow. Please do so in as much detail
            as possible. Explore the templates below for examples.
          </Text>

          <Text fz={'sm'}>
            <Text
              component='span' // Because otherwise it's a <Text> inside a <Text>, which translates to <p> inside <p>, which throws an error
              fz={'sm'}
              c={'red.5'}
              fw={'bold'}
              display={'inline-block'}
            >
              Note:
            </Text>{' '}
            unlike your files, <strong>chat text is sent to the AI</strong>.
            Avoid sharing sensitive information here.
          </Text>

          <Text fz={'sm'}>
            And no need to get it perfect the first time, feel free to iterate.
          </Text>
        </>
      ),
      step: 3,
    };
  };

  const alertContent = getAlertContent();
  const alertColor = !workflowFilesStore.hasFiles
    ? 'blue.5'
    : !workflowFilesStore.allFilesApproved
      ? 'red.5'
      : 'green.5';

  return (
    <Alert
      color={alertColor}
      icon={alertColor === 'red.5' ? <IconAlertTriangle /> : <IconInfoCircle />}
      radius={'md'}
      mb={'md'}
    >
      <Flex direction={'column'} gap={'xs'}>
        <Text c={alertColor} fw={'bold'}>
          {alertContent.title}
        </Text>
        {alertContent.content}
      </Flex>
      <Flex justify={'flex-end'}>
        <Text fz={'xs'} c={'dimmed'}>
          Step {alertContent.step} of 3
        </Text>
      </Flex>
    </Alert>
  );
});

export default OnboardingAlert;
