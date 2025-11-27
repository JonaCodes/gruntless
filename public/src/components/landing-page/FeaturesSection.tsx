import { Title, SimpleGrid, Card, Text, Flex } from '@mantine/core';
import { features } from './landingData';
import classes from './landing.module.css';

export default function FeaturesSection() {
  return (
    <Flex direction='column'>
      <Title order={2} size={36} fw={400} ta='center' mb={60} c='white'>
        Why Gruntless?
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing='lg'>
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Card
              key={feature.title}
              className={classes.featureCard}
              padding='xl'
              radius='md'
              bg='dark.6'
              withBorder
            >
              <Flex gap={4} mb={'sm'} align='center'>
                <IconComponent
                  size={32}
                  stroke={1.5}
                  color='var(--app-theme-shade-6)'
                />
                <Text size='lg' fw={600} c='white'>
                  {feature.title}
                </Text>
              </Flex>
              <Text size='md' lh={1.6} c='dimmed'>
                {feature.description}
              </Text>
            </Card>
          );
        })}
      </SimpleGrid>
    </Flex>
  );
}
