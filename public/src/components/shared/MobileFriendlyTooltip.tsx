import { Tooltip } from '@mantine/core';
import { observer } from 'mobx-react-lite';

interface MobileFriendlyTooltipProps {
  children: React.ReactNode;
  label: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const MobileFriendlyTooltip = observer(
  ({ children, label, position = 'top' }: MobileFriendlyTooltipProps) => {
    return (
      <Tooltip
        label={label}
        events={{ hover: true, focus: true, touch: true }}
        withArrow
        position={position}
        multiline
      >
        {children}
      </Tooltip>
    );
  }
);
export default MobileFriendlyTooltip;
