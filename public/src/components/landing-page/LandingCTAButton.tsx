import { Button } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { EVENT_NAMES } from '@shared/consts/event-names';
import { sendEvent } from 'public/src/clients/app-client';
import { useEffect } from 'react';
import classes from './landing.module.css';
import { STYLES } from 'public/src/consts/styling';
import appStore from 'public/src/stores/appStore';

interface ButtonProps {
  message?: string;
}

export default function LandingCTAButton({
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
      size={appStore.isSmall ? 'lg' : 'xl'}
      radius='xl'
      variant='gradient'
      gradient={{
        from: STYLES.COLORS.APP_THEME.SHADE_1,
        to: STYLES.COLORS.APP_THEME.SHADE_6,
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
