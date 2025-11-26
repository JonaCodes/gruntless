import { Container, Title, Text, Box, Group } from '@mantine/core';
import { IconShieldCheck } from '@tabler/icons-react';
import LandingCTAButton from './LandingCTAButton';

export default function HeroSection() {
  return (
    <Container size='lg' py={50} px={20}>
      <Box ta='center'>
        <Group
          justify='center'
          gap={8}
          mb={32}
          style={{
            display: 'inline-flex',
            background: 'rgba(249, 140, 58, 0.15)',
            padding: '8px 20px',
            borderRadius: '24px',
          }}
        >
          <IconShieldCheck size={18} color='var(--app-theme-shade-6)' />
          <Text size='sm' fw={500} c='var(--app-theme-shade-6)'>
            Privacy-first workflows built by AI
          </Text>
        </Group>

        <Title
          order={1}
          size={64}
          fw={700}
          lh={1.1}
          mb={'lg'}
          c='white'
          style={{ fontSize: 'clamp(42px, 8vw, 64px)' }}
        >
          Never Do{' '}
          <span style={{ color: 'var(--app-theme-shade-6)' }}>Gruntwork</span>{' '}
          Again
        </Title>

        <Text size='xl' mb={'lg'} fw={400}>
          Leverage AI{' '}
          <Text span fw={'bold'} c={'white'}>
            without
          </Text>{' '}
          risking privacy.
        </Text>

        <Text size='lg' c='dimmed' mb='xl' maw={700} mx='auto'>
          Gruntless is like a personal developer for all your file busywork.
          Describe any repetitive task - from organizing client PDFs to updating
          complex spreadsheets - and Gruntless builds a secure, local workflow
          to do it for you.
        </Text>

        <LandingCTAButton />
      </Box>
    </Container>
  );
}
