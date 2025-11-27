import { Text, Center, Box } from '@mantine/core';
import { Link, useSearchParams } from 'react-router-dom';
import WaitlistedComplete from './WaitlistedComplete';
import HeroSection from './HeroSection';
// import TrustedBySection from './TrustedBySection';
import FeaturesSection from './FeaturesSection';
import EfficientImage from '../shared/EfficientImage';

export default function Landing() {
  const [searchParams] = useSearchParams();
  const isSignupComplete = searchParams.get('waitlisted') === 'true';

  if (isSignupComplete) return <WaitlistedComplete />;

  return (
    <Box bg='var(--landing-black)' mih='100vh'>
      <EfficientImage
        name={'/v1764134535/gruntless/logo-big.png'}
        maw={50}
        lazy={false}
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
        }}
      />
      <HeroSection />
      {/* <TrustedBySection /> */}
      <FeaturesSection />

      <Center py={40}>
        <Text c='dimmed' size='sm'>
          Questions? Check out the{' '}
          <Link
            to='/about'
            style={{
              color: 'var(--app-theme-shade-6)',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            FAQ
          </Link>
        </Text>
      </Center>
    </Box>
  );
}
