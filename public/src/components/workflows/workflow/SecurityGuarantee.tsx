import { Flex, Text } from '@mantine/core';
import { IconShieldCheck } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export const SecurityGuarantee = () => {
  return (
    <Flex mt={'xs'} justify='center' align='center' gap='xs'>
      <IconShieldCheck
        size={18}
        color={'var(--mantine-color-blue-6)'}
        stroke={2}
      />

      <Text fz={'xs'} c={'dimmed'}>
        All processing happens locally on your machine. <br />
        No sensitive data is ever exposed.{' '}
        <Link
          style={{
            color: 'var(--mantine-color-blue-5)',
            textDecoration: 'none',
          }}
          to='/about'
        >
          Learn more
        </Link>
      </Text>
    </Flex>
  );
};
