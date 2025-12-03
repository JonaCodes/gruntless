import { Flex, Text } from '@mantine/core';
import { IconShieldCheck, IconAlertTriangle } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

interface SecurityGuaranteeProps {
  type?: 'file-upload' | 'chat';
}

export const SecurityGuarantee = ({
  type = 'file-upload',
}: SecurityGuaranteeProps) => {
  const content = {
    'file-upload': {
      icon: (
        <IconShieldCheck
          size={18}
          color='var(--mantine-color-blue-6)'
          stroke={2}
        />
      ),
      text: (
        <>
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
        </>
      ),
      gap: 'xs',
    },
    chat: {
      icon: (
        <IconAlertTriangle
          size={16}
          color='var(--mantine-color-orange-6)'
          stroke={1.5}
        />
      ),
      text: 'Files stay local. Chat conversations are sent to our AI agent',
      gap: 4,
    },
  };

  const { icon, text, gap } = content[type];

  return (
    <Flex mt={'xs'} justify='center' align='center' gap={gap}>
      {icon}
      <Text fz={'xs'} c={'dimmed'}>
        {text}
      </Text>
    </Flex>
  );
};
