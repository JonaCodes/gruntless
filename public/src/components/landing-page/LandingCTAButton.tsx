import { Button } from '@mantine/core';
import { IconMail } from '@tabler/icons-react';
import classes from './landing.module.css';
import { EVENT_NAMES } from 'shared-consts/event-names';
import { sendEvent } from 'public/src/clients/app-client';
import { useEffect } from 'react';

interface ButtonProps {
  message?: string;
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  icon?: React.ReactNode;
  additionalClassName?: string;
}

export default function LandingCTAButton({
  size = 'xl',
  message = 'Be the first to try',
  icon = <IconMail />,
  additionalClassName = '',
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
      className={`${classes['landing-cta-button']} ${classes[additionalClassName]}`}
      leftSection={icon}
      size={size}
      radius='sm'
      bg={'var(--landing-theme)'}
      c={'black'}
      onClick={handleClick}
    >
      {message}
    </Button>
  );
}
