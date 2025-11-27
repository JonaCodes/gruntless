import { Flex, Text, Title } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import EfficientImage from '../shared/EfficientImage';

export default function WaitlistedComplete() {
  return (
    <Flex
      justify='center'
      align='center'
      direction='column'
      px={{ base: 'xs', lg: 'xl' }}
      py={{ base: 'xs', lg: 'xl' }}
      gap={'md'}
      mt={{ base: 0, lg: 50 }}
    >
      <Title fz={{ base: 24, lg: 50 }}>Glad to have you on board!</Title>
      <Text c='dimmed'>
        We'll let you know as soon as we're ready to eliminate your gruntwork
      </Text>

      <EfficientImage
        width={150} // for cloudinary (efficiency)
        maw={150} // actual page dimensions
        name={'v1744213504/ai-book-editor/working-hard-dragon.png'}
        lazy={false}
      />

      <NavLink
        style={{
          fontSize: 14,
          textDecoration: 'none',
          color: 'var(--mantine-color-anchor)',
          position: 'absolute',
          bottom: 10,
        }}
        to='/'
      >
        Back to the homepage
      </NavLink>
    </Flex>
  );
}
