import { Flex, NavLink } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { Link, useLocation } from 'react-router-dom';
import { IconQuestionMark, IconLayoutGrid } from '@tabler/icons-react';
import NavAvatar from './NavAvatar';
import classes from './navbar.module.css';
import Logo from './Logo';

interface NavbarProps {
  setNavbarOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = observer(({ setNavbarOpened }: NavbarProps) => {
  const location = useLocation();
  const closeNavBar = () => setNavbarOpened(false);

  const navLinks = [
    {
      label: 'Workflows',
      description: 'Build, manage, and run your Grunt workflows',
      icon: IconLayoutGrid,
      to: '/workflows',
    },
    {
      label: 'About',
      description: 'Learn more about Gruntless',
      icon: IconQuestionMark,
      to: '/about',
    },
  ];

  return (
    <Flex
      justify={'center'}
      direction={'column'}
      gap={'xl'}
      style={{ height: '100%' }}
    >
      <Logo setNavbarOpened={setNavbarOpened} />
      {navLinks.map((link) => (
        <Flex key={`nav-bar-link-${link.to}`} gap={'xs'} align={'center'}>
          <NavLink
            component={Link}
            to={link.to}
            leftSection={<link.icon />}
            label={link.label}
            description={link.description}
            active={location.pathname === link.to}
            className={classes['navlink']}
            color='var(--app-theme-color-on)' // without this it doesn't affect the subtext as well
            onClick={closeNavBar}
          />
        </Flex>
      ))}
      <Flex pl={12} justify={'start'} align={'end'} style={{ height: '100%' }}>
        <NavAvatar />
      </Flex>
    </Flex>
  );
});

export default Navbar;
