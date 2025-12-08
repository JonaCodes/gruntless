import { Button, Text } from '@mantine/core';
import { IconMail } from '@tabler/icons-react';
import { OAuthButton } from './OAuthButton';
import { STYLES } from 'public/src/consts/styling';

interface ProviderSelectionProps {
  onSelectOAuth: (provider: 'google' | 'apple') => void;
  onSelectEmail: () => void;
  isLoading?: boolean;
  selectedProvider?: string | null;
}

export const ProviderSelection = ({
  onSelectOAuth,
  onSelectEmail,
  isLoading,
  selectedProvider,
}: ProviderSelectionProps) => {
  return (
    <>
      <Text size='md' ta='center'>
        Time to put an end to gruntwork
      </Text>

      <OAuthButton
        provider='Google'
        iconUrl='https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw'
        onClick={() => onSelectOAuth('google')}
        loading={isLoading && selectedProvider === 'Google'}
      />

      <Button
        variant='default'
        onClick={onSelectEmail}
        fullWidth
        leftSection={
          <IconMail
            stroke={1.5}
            size={24}
            color={STYLES.COLORS.APP_THEME.SHADE_1}
            style={{ marginLeft: '-14px' }}
          />
        }
      >
        Continue with email
      </Button>
    </>
  );
};
