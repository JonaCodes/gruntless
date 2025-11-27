import { observer } from 'mobx-react-lite';
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useSearchParams,
} from 'react-router-dom';
import { AppShell, Burger, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';

import Landing from './components/landing-page/Landing';
import navClasses from './components/navbar/navbar.module.css';
// import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthCallback from './components/auth/AuthCallback';
import appStore from './stores/appStore';
import userStore from './stores/userStore';
import { getUserData } from './clients/app-client';
import EmptyState from './components/empty-states/EmptyState';
// import { APP_ADMIN_ID } from '@shared/consts/general';
import Logo from './components/navbar/Logo';
import Navbar from './components/navbar/Navbar';
import About from './components/about/About';
import Workflows from './components/workflows/Workflows';
import WorkflowNavbar from './components/workflows/WorkflowNavbar';
import workflowsAsideClasses from './components/workflows/workflowsAside.module.css';

const App = observer(() => {
  const isSmall = useMediaQuery('(max-width: 768px)');
  const [opened, setNavbarOpened] = useState(false);
  const toggleNavbar = () => setNavbarOpened((o) => !o);

  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const [searchParams, setSearchParams] = useSearchParams();

  const LARGE_PADDING = 'xl';
  const GENERAL_PADDING = LARGE_PADDING;

  useEffect(() => {
    appStore.setIsSmall(isSmall);
  }, [isSmall]);

  useEffect(() => {
    appStore.loadSession().then(async () => {
      userStore.setIsLoadingUser(true);

      const userData = await getUserData();
      if (!userData) {
        userStore.setIsLoadingUser(false);
        return;
      }

      userStore.setUser(userData);
      userStore.setIsLoadingUser(false);
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  // Sync URL query params with workflow navbar state
  useEffect(() => {
    const workflowId = searchParams.get('workflow');
    if (workflowId && workflowId !== appStore.selectedWorkflowId) {
      appStore.openWorkflowNavbar(workflowId);
    } else if (!workflowId && appStore.workflowNavbarOpened) {
      appStore.closeWorkflowNavbar();
    }
  }, [searchParams]);

  return (
    <AppShell
      padding={isLandingPage ? 0 : GENERAL_PADDING}
      px={{ base: isLandingPage ? GENERAL_PADDING : 0, xl: '5rem' }}
      bg={isLandingPage ? 'var(--landing-black)' : 'inherit'}
      navbar={{
        width: isLandingPage ? 0 : 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      {...(appStore.workflowNavbarOpened && {
        aside: {
          width: isSmall ? '100%' : 400,
          breakpoint: 'sm',
          collapsed: { mobile: false, desktop: false },
        },
      })}
    >
      {isSmall && !isLandingPage && (
        <AppShell.Header>
          <Group h='100%' px='md' gap={'xl'}>
            <Burger opened={opened} onClick={toggleNavbar} size='sm' />
            {!opened && <Logo setNavbarOpened={setNavbarOpened} />}
          </Group>
        </AppShell.Header>
      )}

      {!isLandingPage && (
        <AppShell.Navbar
          p={LARGE_PADDING}
          className={navClasses['navbar-container']}
        >
          <Navbar setNavbarOpened={setNavbarOpened} />
        </AppShell.Navbar>
      )}

      {appStore.workflowNavbarOpened && (
        <AppShell.Aside
          p='xl'
          className={workflowsAsideClasses['workflow-navbar']}
        >
          {appStore.selectedWorkflowId && (
            <WorkflowNavbar
              workflowId={appStore.selectedWorkflowId}
              onClose={() => {
                appStore.closeWorkflowNavbar();
                setSearchParams({});
              }}
            />
          )}
        </AppShell.Aside>
      )}

      <AppShell.Main style={{ height: isLandingPage ? 'inherit' : '100vh' }}>
        {!opened && (
          <Routes>
            <Route path='/' element={<Landing />} />

            {/* Oops page with optional section param */}
            <Route path='/oops/:section?' element={<EmptyState />} />

            <Route path='/about' element={<About />} />
            <Route path='/workflows' element={<Workflows />} />
            <Route path='/auth/callback' element={<AuthCallback />} />

            {/* Protected Routes */}
            {/* <Route
              path='/backend'
              element={
                <ProtectedRoute requiredUserId={APP_ADMIN_ID}>
                  <Backend />
                </ProtectedRoute>
              }
            /> */}

            {/* Catch-all redirect to oops page */}
            <Route path='*' element={<Navigate to='/oops/default' replace />} />
          </Routes>
        )}
      </AppShell.Main>
    </AppShell>
  );
});

export default App;
