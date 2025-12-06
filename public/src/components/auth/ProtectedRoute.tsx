import { useAuth } from '../../hooks/useAuth';
import SignUpOrLogin from './SignUpOrLogin';
import { Loader } from '@mantine/core';
import userStore from '../../stores/userStore';
import { observer } from 'mobx-react-lite';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserId?: number;
}

const ProtectedRoute = observer(
  ({ children, requiredUserId }: ProtectedRouteProps) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null || userStore.isLoadingUser) {
      return <Loader />;
    }

    if (!isAuthenticated || !userStore.user) {
      return <SignUpOrLogin />;
    }

    if (requiredUserId && userStore.user.id !== requiredUserId) {
      window.location.href = '/oops/forbidden';
      return;
    }

    return <>{children}</>;
  }
);

export default ProtectedRoute;
