import { Flex, Text, Title, } from '@mantine/core';
import { Link, useSearchParams } from 'react-router-dom';
import WaitlistedComplete from './WaitlistedComplete';
import classes from './landing.module.css';

export default function Landing() {
  const [searchParams] = useSearchParams();
  const isSignupComplete = searchParams.get('waitlisted') === 'true';

  if (isSignupComplete) return <WaitlistedComplete />;

  return (
    <>
      <Flex
        pos={'fixed'}
        top={0}
        left={0}
        p={10}
        w={'100%'}
        bg={'var(--landing-black)'}
        style={{ zIndex: 9 }}
      >

        <Title order={2}>
          The Landing Page
        </Title>

        <Text c='dimmed' mt={'xs'} fz={'sm'}>
          Questions? Check out the{' '}
          <Link
            to='/about'
            className={classes['landing-faq-nav']}
            style={{
              color: 'var(--mantine-color-anchor)',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            FAQ
          </Link>
        </Text>
      </Flex >
    </>
  );
}
