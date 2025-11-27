import { Text, Group, Box, Flex } from '@mantine/core';
import { trustedCompanies } from './landingData';

export default function TrustedBySection() {
  return (
    <Flex direction='column'>
      <Text ta='center' size='xs' fw={600} tt='uppercase' c='dimmed' mb={40}>
        Trusted by Compliance Teams In
      </Text>

      <Group justify='center' gap='xl'>
        {trustedCompanies.map((company) => (
          <Group key={company.name} gap={12}>
            <Box
              w={40}
              h={40}
              style={{
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text fw={700} size='xl' c='dimmed'>
                {company.name.charAt(0)}
              </Text>
            </Box>
            <Text size='lg' fw={600} c='gray.4'>
              {company.name}
            </Text>
          </Group>
        ))}
      </Group>
    </Flex>
  );
}
