import {
  Box,
  Container,
  Flex,
  Text,
  Title,
  Accordion,
  Stack,
} from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { sendEvent } from 'public/src/clients/app-client';
import { STYLES } from 'public/src/consts/styling';
import { useEffect } from 'react';
import { EVENT_NAMES } from '@shared/consts/event-names';
import { ReachOut } from '../shared/ReachOut';

const faq = [
  {
    question: 'What exactly does Gruntless do?',
    answer:
      "Gruntless uses advanced AI to build custom automation tools for you instantly. You describe routine tasks in plain English—like organizing messy spreadsheets or merging PDFs—and Gruntless creates a private 'agent' to handle that job automatically forever.",
  },
  {
    question: 'Is my sensitive data safe?',
    answer:
      "Yes, completely. Unlike most AI tools, Gruntless runs entirely on your local device using your browser's built-in capabilities. Your files and data never leave your computer or get uploaded to a cloud server.",
  },
  {
    question: 'Do I need coding experience to use it?',
    answer:
      'Not at all. If you can send a text message, you can build a Gruntless agent. Just describe the task you want automated as if you were talking to a human assistant, and the AI handles the technical part.',
  },
  {
    question: 'What kind of tasks is it best for?',
    answer:
      'It excels at repetitive digital chores involving files. Think data entry, cleaning up CSVs, extracting specific info from batches of PDFs, reformatting reports, or connecting different file types.',
  },
  {
    question: 'How do I know the automation will work correctly?',
    answer:
      "Every agent is auto-tested behind the scenes before it's saved to ensure it performs exactly as requested. You can also run test files through it instantly to verify the results yourself.",
  },
];

const About = observer(() => {
  useEffect(() => {
    sendEvent(EVENT_NAMES.ABOUT_PAGE_VIEW, {});
  }, []);

  const highlightText = (text: string) => (
    <span
      style={{
        color: STYLES.COLORS.APP_THEME.SHADE_6,
        fontFamily: STYLES.FONTS.HEADERS,
      }}
    >
      {text}
    </span>
  );

  return (
    <Container size='md' py='xl'>
      <Stack gap='md' mb={50}>
        <Flex align='center' gap='sm'>
          <Title order={2}>The {highlightText('Gruntless')} Story</Title>
        </Flex>

        <Text size='md' c={'dimmed'}>
          Gruntwork is terrible. People should not waste their time on it.
        </Text>

        <Text size='md' c='dimmed'>
          Endless hours spent manually moving data around, wrestling with
          spreadsheets, copying things from one PDF to another.
        </Text>

        <Text size='md'>
          {highlightText("We're not sheep damn it, we're human beings!")}
        </Text>

        <Text size='md' c='dimmed'>
          And you'd think AI would solve all of that - but no, it's too busy
          making pictures of cats dancing the cha-cha on the surface of the
          moon, while we fret over PII, GDPR, HIPAA, and other compliance
          acronyms because you can't just send your sensitive data into the
          cloud-void willy-nilly.
        </Text>

        <Text size='md' c='dimmed'>
          But then I realized... the AI doesn't <em>have</em> to see your data.
          It can just learn its <em>structure</em>, and build the workflow you
          need. Then, with some clever engineering, we can ensure that workflow
          runs {highlightText('completely locally')} on your machine - none of
          your data has to go anywhere, ever!
        </Text>

        <Text size='md' c='dimmed'>
          And here we are now! With{' '}
          {highlightText('privacy-first AI to put an end to your gruntwork')}.
        </Text>

        <Text size='md' c='dimmed'>
          Hopefully, Gruntless does good by you, and frees you to focus on the
          more creative, engaging aspects of your work.
        </Text>

        <Box mt='xl'>
          <Title order={3} mb='md'>
            FAQ
          </Title>
          <Accordion variant='separated'>
            {faq.map((item, idx) => (
              <Accordion.Item key={idx} value={item.question}>
                <Accordion.Control>{item.question}</Accordion.Control>
                <Accordion.Panel>{item.answer}</Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Box>
      </Stack>

      <Flex align={'center'} w={'100%'} justify={'center'} direction={'column'}>
        <ReachOut text='More questions? Reach out at' />
        <Text size='sm' c='dimmed' mt={-8}>
          Quillside is the company behind Gruntless
        </Text>
      </Flex>
    </Container>
  );
});

export default About;
