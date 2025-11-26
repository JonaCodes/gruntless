import { Button } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { EVENT_NAMES } from 'shared-consts/event-names';
import { sendEvent } from 'public/src/clients/app-client';
import { useEffect } from 'react';
import classes from './landing.module.css';
import { COLORS } from 'public/src/consts/colors';

interface ButtonProps {
  message?: string;
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
}

export default function LandingCTAButton({
  size = 'xl',
  message = 'Eliminate your gruntwork, securely',
}: ButtonProps) {
  useEffect(() => {
    sendEvent(EVENT_NAMES.CTA_IMPRESSION, { message });
  }, [message]);

  const handleClick = () => {
    sendEvent(EVENT_NAMES.CTA_BUTTON_CLICK, { message });

    open(
      'https://forms.monday.com/forms/32dc84224fa2cb949d81a206c1d6722d?r=euc1',
      '_blank'
    );
  };

  return (
    <Button
      className={classes.ctaButton}
      rightSection={<IconArrowRight size={20} />}
      size={size}
      radius='xl'
      variant='gradient'
      gradient={{
        from: COLORS.APP_THEME.SHADE_1,
        to: COLORS.APP_THEME.SHADE_6,
        deg: 235,
      }}
      c='black'
      fw={500}
      onClick={handleClick}
    >
      {message}
    </Button>
  );
}
