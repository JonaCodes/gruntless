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
    question: 'How does Gruntless work?',
    answer:
      "Gruntless leverages the power of LLMs to create hyper-customized 'mini-apps' tailored to your exact use-case. You describe routine tasks in plain language (like organizing messy spreadsheets or merging PDFs), and Gruntless works with an LLM on your behalf to create the exact automation you need, complete with a simple interface to run it on.",
  },
  {
    question: 'Is my sensitive data safe?',
    answer:
      "Yes, completely. Unlike most AI tools, Gruntless runs entirely on your local device using your browser's built-in capabilities. Your files and data never leave your computer or get uploaded to a cloud server.",
  },
  {
    question: 'Do I need coding experience to use it?',
    answer:
      'Not at all. If you can send a text message, you can build a Gruntless automation. Just describe the task you want automated as if you were talking to a human assistant, and Gruntless handles the technical part.',
  },
  {
    question: 'What kind of tasks is Gruntless best for?',
    answer:
      "Gruntless excels at any digital chores involving files. Whether it's repetitive or one-time, Gruntless can build it for you. Think cleaning up CSVs, merging or splitting them, extracting specific info from batches of PDFs, reformatting reports, working with ZIP files, JSONs, XMLs, Word docs - any combination of any of these - you name it; Gruntless will do it.",
  },
  {
    question: 'How do I know the automation will work correctly?',
    answer:
      "There is no black-box here. You're the captain, building the automation hand-in-hand with Gruntless. Once a version is finished, you can test it and iterate as much as you need.",
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
          <Title order={1}>The {highlightText('Gruntless')} Story</Title>
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
          It can just learn its <em>structure</em>, and build the automation you
          need. Then, with some clever engineering, we can ensure that
          automation runs {highlightText('completely locally')} on your machine
          - none of your data has to go anywhere, ever!
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
          <Title order={2} mb='md'>
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
