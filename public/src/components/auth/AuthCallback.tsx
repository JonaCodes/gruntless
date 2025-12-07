import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader } from '@mantine/core';
import appStore from 'public/src/stores/appStore';
import userStore from '../../stores/userStore';
import { getUserData } from 'public/src/clients/app-client';
import { handlePendingShare } from 'public/src/services/shareService';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.error('Error during auth callback:', error);
        navigate('/oops/signin');
        return;
      }

      await appStore.loadSession();

      try {
        const userData = await getUserData();
        userStore.setUser(userData);
        userStore.setIsLoadingUser(false);

        await handlePendingShare();
        navigate('/workflows');
      } catch (err: any) {
        console.error('Error syncing user:', err.message);
        navigate('/oops/signin');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return <Loader />;
};

export default AuthCallback;
