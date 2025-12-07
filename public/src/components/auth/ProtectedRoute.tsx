import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import SignUpOrLogin from './SignUpOrLogin';
import { Loader } from '@mantine/core';
import userStore from '../../stores/userStore';
import { observer } from 'mobx-react-lite';
import { LocalStorageService } from '../../services/local-storage-service';
import { LS_KEYS } from '../../consts/localStorage';
import { WF_SHARE_URL_PARAM } from '@shared/consts/general';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserId?: number;
}

const ProtectedRoute = observer(
  ({ children, requiredUserId }: ProtectedRouteProps) => {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const shareId = params.get(WF_SHARE_URL_PARAM);

      if (shareId) {
        LocalStorageService.set<string>(LS_KEYS.PENDING_SHARE, shareId);
      }
    }, []);

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
