import {
  Flex,
  Button,
  // TextInput,
  Stack,
  Text,
  // Divider,
  Paper,
  Image,
  Tooltip,
} from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import appStore from 'public/src/stores/appStore';
import { supabase } from 'public/src/lib/supabase';

const SignUpOrLogin = observer(() => {
  // const [isSignUp, setIsSignUp] = useState(false);
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [error, setError] = useState('');
  // const navigate = useNavigate();

  // const handleEmailAuth = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');

  //   try {
  //     if (isSignUp) {
  //       const { error } = await supabase.auth.signUp({
  //         email,
  //         password,
  //         options: {
  //           emailRedirectTo: `${window.location.origin}/auth/callback`,
  //         },
  //       });
  //       if (error) throw error;
  //     } else {
  //       const { error } = await supabase.auth.signInWithPassword({
  //         email,
  //         password,
  //       });
  //       if (error) throw error;
  //     }
  //     navigate('/dashboard/123');
  //   } catch (err: any) {
  //     setError(err.message);
  //   }
  // };

  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      appStore.setIsLoadingSignIn(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      // appStore.setIsLoadingSignIn(false);
      if (error) throw error;
    } catch (err: any) {
      // TODO: alert & log error
      // setError(err.message);
      console.error(err);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      // TODO: alert & log error
      // setError(err.message);
      console.error(err);
    }
  };

  const renderLoginButton = (
    provider: string,
    imgSrc: string,
    handler: () => void
  ) => {
    return (
      <Button
        variant='default'
        leftSection={<Image src={imgSrc} w={20} h={20} />}
        onClick={() => {
          setSelectedProvider(provider);
          handler();
        }}
        loading={appStore.isLoadingSignIn && selectedProvider === provider}
        disabled={provider === 'Apple'}
        fullWidth
      >
        Continue with {provider}
      </Button>
    );
  };

  return (
    <Flex justify='center' align='center' h='100vh'>
      <Paper shadow='md' p='xl' radius='md' w='100%' maw={400}>
        <Stack>
          <Text size='md' ta='center'>
            Time to put an end to gruntwork
            {/* {isSignUp ? 'Create an account' : 'Welcome back'} */}
          </Text>

          {renderLoginButton(
            'Google',
            'https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw',
            handleGoogleSignIn
          )}

          <Tooltip label='Coming soon'>
            {renderLoginButton(
              'Apple',
              'https://cdn.freebiesupply.com/images/large/2x/apple-logo-transparent.png',
              handleAppleSignIn
            )}
          </Tooltip>

          {/*<Divider label='Or sign in with your email' labelPosition='center' />

          <form onSubmit={handleEmailAuth}>
            <Stack>
              <TextInput
                required
                placeholder='thebestauthor@email.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextInput
                required
                type='password'
                placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <Text c='red' size='sm'>
                  {error}
                </Text>
              )}
              <Button type='submit' fullWidth>
                {isSignUp ? 'Sign up' : 'Sign in'}
              </Button>
            </Stack>
          </form> */}

          {/* <Text ta='center' size='sm'>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Text
              component='button'
              variant='link'
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </Text>
          </Text> */}
        </Stack>
      </Paper>
    </Flex>
  );
});

export default SignUpOrLogin;
