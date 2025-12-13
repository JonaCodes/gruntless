import { observer } from 'mobx-react-lite';
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  matchPath,
  useNavigate,
} from 'react-router-dom';
import { AppShell, Burger, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';

import Landing from './components/landing-page/Landing';
import navClasses from './components/navbar/navbar.module.css';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthCallback from './components/auth/AuthCallback';
import appStore from './stores/appStore';
import userStore from './stores/userStore';
import { getUserData } from './clients/app-client';
import EmptyState from './components/empty-states/EmptyState';
import Logo from './components/navbar/Logo';
import Navbar from './components/navbar/Navbar';
import About from './components/about/About';
import Workflows from './components/workflows/Workflows';
import WorkflowNavbar from './components/workflows/workflow/WorkflowNavbar';
import workflowsNavbarClasses from './components/workflows/workflowsNavbar.module.css';
import WorkflowCreator from './components/workflow-creator/WorkflowCreator';
import AdminSeedWorkflow from './components/admin/AdminSeedWorkflow';
import UserManagement from './components/backoffice/UserManagement';

const App = observer(() => {
  const isSmall = useMediaQuery('(max-width: 768px)');
  const [opened, setNavbarOpened] = useState(false);
  const toggleNavbar = () => setNavbarOpened((o) => !o);

  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isWorkflowCreatorPage =
    location.pathname === '/grunts/new' ||
    (location.pathname.startsWith('/grunts/') &&
      location.pathname.endsWith('/edit'));

  const navigate = useNavigate();

  const LARGE_PADDING = 'xl';
  const GENERAL_PADDING = LARGE_PADDING;

  useEffect(() => {
    appStore.setIsSmall(isSmall);
  }, [isSmall]);

  const publicRoutes = ['/', '/about', '/oops', '/auth/callback'];
  const isPublicRoute =
    publicRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/oops/');

  useEffect(() => {
    if (isPublicRoute) {
      return;
    }

    const initAuth = async () => {
      // Load session into appStore (needed by getUserData)
      await appStore.loadSession();

      if (!appStore.session) return;
      if (userStore.user) return;

      userStore.setIsLoadingUser(true);
      try {
        const userData = await getUserData();
        if (userData?.id) {
          userStore.setUser(userData);
        }
      } finally {
        userStore.setIsLoadingUser(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  // Sync URL path params with workflow navbar state
  useEffect(() => {
    const match = matchPath('/grunts/:id', location.pathname);
    const workflowId = match?.params.id;

    // Ensure we don't treat "new" as an ID if it accidentally matches (though route order helps, explicit check is safer)
    if (
      workflowId &&
      workflowId !== 'new' &&
      workflowId !== appStore.selectedWorkflowId
    ) {
      appStore.openWorkflowNavbar(workflowId);
    } else if (
      (!workflowId || workflowId === 'new') &&
      appStore.workflowNavbarOpened
    ) {
      appStore.closeWorkflowNavbar();
    }
  }, [location.pathname]);

  return (
    <AppShell
      // 0 vertical padding because we want the side nav to span from top to bottom, just the aside navbar does
      py={isWorkflowCreatorPage ? 0 : GENERAL_PADDING}
      px={GENERAL_PADDING}
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
        <AppShell.Header zIndex={1000}>
          <Group h='100%' px='md' gap={'xs'}>
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
          className={workflowsNavbarClasses['workflow-navbar']}
        >
          {appStore.selectedWorkflowId && (
            <WorkflowNavbar
              workflowId={appStore.selectedWorkflowId}
              onClose={() => {
                appStore.closeWorkflowNavbar();
                navigate('/grunts');
              }}
            />
          )}
        </AppShell.Aside>
      )}

      {/* Note: make sure to update sitemap.xml when adding public routes */}
      <AppShell.Main style={{ height: isLandingPage ? 'inherit' : '100vh' }}>
        {!opened && (
          <Routes>
            <Route path='/' element={<Landing />} />

            {/* Oops page with optional section param */}
            <Route path='/oops/:section?' element={<EmptyState />} />

            <Route path='/about' element={<About />} />

            {/* Backwards compatibility for the one/two users already using the old URL */}
            <Route
              path='/workflows'
              element={<Navigate to='/grunts' replace />}
            />

            {/* Protected Routes - Require Authentication */}
            <Route
              path='/grunts/:id?'
              element={
                <ProtectedRoute>
                  <Workflows />
                </ProtectedRoute>
              }
            />
            <Route
              path='/grunts/new'
              element={
                <ProtectedRoute>
                  <WorkflowCreator />
                </ProtectedRoute>
              }
            />
            <Route
              path='/grunts/:id/edit'
              element={
                <ProtectedRoute>
                  <WorkflowCreator />
                </ProtectedRoute>
              }
            />

            <Route
              path='/admin/seed-workflow'
              element={
                <ProtectedRoute>
                  <AdminSeedWorkflow />
                </ProtectedRoute>
              }
            />

            <Route
              path='/backoffice'
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            <Route path='/auth/callback' element={<AuthCallback />} />

            {/* Catch-all redirect to oops page */}
            <Route path='*' element={<Navigate to='/oops/default' replace />} />
          </Routes>
        )}
      </AppShell.Main>
    </AppShell>
  );
});

export default App;
