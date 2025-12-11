import { Title, Text, Box, Flex } from '@mantine/core';
import { IconShieldCheck } from '@tabler/icons-react';
import LandingCTAButton from './LandingCTAButton';
import { STYLES } from 'public/src/consts/styling';
import classes from './landing.module.css';
import EfficientImage from '../shared/EfficientImage';

export default function HeroSection() {
  return (
    <Flex direction='column' py={50}>
      <Box ta='center' style={{ justifyItems: 'center' }}>
        <Flex
          justify='center'
          gap='xs'
          mb='xl'
          className={classes.privacyBadge}
        >
          <IconShieldCheck size={18} color={STYLES.COLORS.APP_THEME.SHADE_6} />
          <Text size='sm' fw={500} c={STYLES.COLORS.APP_THEME.SHADE_6}>
            Privacy-first workflows built by AI
          </Text>
        </Flex>

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
          <span
            style={{
              color: STYLES.COLORS.APP_THEME.SHADE_6,
              fontFamily: STYLES.FONTS.HEADERS,
            }}
          >
            Gruntwork
          </span>{' '}
          Again
        </Title>

        <Text size='xl' mb={'lg'} fw={400}>
          Leverage AI{' '}
          <Text span fw={'bold'} c={'white'}>
            without
          </Text>{' '}
          risking privacy.
        </Text>

        <Box mb={'lg'}>
          <EfficientImage
            name={'v1765476825/gruntless/gruntless-hero-img-v3.png'}
            mah={{ base: 150, xl: 250 }}
            lazy={false}
          />
        </Box>

        <Text size='lg' c='dimmed' mb='xl' maw={700} mx='auto'>
          Gruntless is your personal developer for file busywork. Describe any
          tedious task - from organizing client PDFs to updating complex
          spreadsheets - and Gruntless builds a secure, local workflow to do it
          for you.
        </Text>

        <LandingCTAButton />
      </Box>
    </Flex>
  );
}
