import { Flex } from '@mantine/core';
import { Link } from 'react-router-dom';
import EfficientImage from '../shared/EfficientImage';
import appStore from 'public/src/stores/appStore';

interface LogoProps {
  setNavbarOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

function Logo({ setNavbarOpened }: LogoProps) {
  const closeNavBar = () => setNavbarOpened(false);
  const isSmall = appStore.isSmall;

  return (
    <Flex justify={'center'}>
      <Flex component={Link} to='/' onClick={closeNavBar}>
        <EfficientImage
          name={'/v1764134535/gruntless/logo-big.png'}
          maw={50}
          lazy={false}
          p={isSmall ? 'xs' : 0}
        />
      </Flex>
    </Flex>
  );
}

export default Logo;
