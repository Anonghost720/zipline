import ExternalAuthButton from '@/components/pages/login/ExternalAuthButton';
import { Response } from '@/lib/api/response';
import { fetchApi } from '@/lib/fetchApi';
import useLogin from '@/lib/hooks/useLogin';
import { useTitle } from '@/lib/hooks/useTitle';
import { authenticateWeb } from '@/lib/passkey';
import {
  Box,
  Button,
  Center,
  Divider,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  PasswordInput,
  PinInput,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications, showNotification } from '@mantine/notifications';
import {
  IconBrandDiscordFilled,
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
  IconCircleKeyFilled,
  IconKey,
  IconShieldQuestion,
  IconUserPlus,
  IconX,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import GenericError from '../../error/GenericError';

export default function Login() {
  useTitle('Login');

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const { user, mutate } = useLogin();
  const { colorScheme } = useMantineColorScheme();

  const navigate = useNavigate();

  const {
    data: config,
    error: configError,
    isLoading: configLoading,
  } = useSWR<Response['/api/server/public']>('/api/server/public', {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenHidden: false,
    revalidateIfStale: false,
  });

  const showLocalLogin =
    query.get('local') === 'true' ||
    !(
      config?.oauth?.bypassLocalLogin &&
      Object.values(config?.oauthEnabled ?? {}).filter((x) => x === true).length > 0
    );

  const willRedirect =
    config?.oauth?.bypassLocalLogin &&
    Object.values(config?.oauthEnabled ?? {}).filter((x) => x === true).length === 1 &&
    query.get('local') !== 'true';

  const [totpOpen, setTotpOpen] = useState(false);
  const [pinDisabled, setPinDisabled] = useState(false);
  const [pinError, setPinError] = useState('');
  const [pin, setPin] = useState('');

  const [passkeyErrored, setPasskeyErrored] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (value.length > 1 ? null : 'Username is required'),
      password: (value) => (value.length > 1 ? null : 'Password is required'),
    },
  });

  const onSubmit = async (values: typeof form.values, code: string | undefined = undefined) => {
    setPinDisabled(true);
    setPinError('');

    const { username, password } = values;

    const { data, error } = await fetchApi<Response['/api/auth/login']>('/api/auth/login', 'POST', {
      username,
      password,
      code,
    });

    if (error) {
      if (error.error === 'Invalid username or password') {
        form.setFieldError('username', 'Invalid username');
        form.setFieldError('password', 'Invalid password');
      } else if (error.error === 'Invalid code') setPinError(error.error!);
      setPinDisabled(false);
    } else {
      if (data!.totp) {
        setTotpOpen(true);
        setPinDisabled(false);
        return;
      }

      mutate(data as Response['/api/user']);
    }
  };

  const handlePinChange = (value: string) => {
    setPin(value);

    if (value.length === 6) {
      onSubmit(form.values, value);
    }
  };

  const handlePasskeyLogin = async () => {
    try {
      setPasskeyLoading(true);
      const res = await authenticateWeb();
      const { data, error } = await fetchApi<Response['/api/auth/webauthn']>('/api/auth/webauthn', 'POST', {
        auth: res.toJSON(),
      });
      if (error) {
        setPasskeyErrored(true);
        setPasskeyLoading(false);
        notifications.show({
          title: 'Error while authenticating with passkey',
          message: error.error,
          color: 'red',
        });
      } else {
        mutate(data as Response['/api/user']);
      }
    } catch (e) {
      console.log(e);
      setPasskeyErrored(true);
      setPasskeyLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user]);

  useEffect(() => {
    console.log({ willRedirect, config });
    if (willRedirect && config) {
      const provider = Object.keys(config.oauthEnabled).find(
        (x) => config.oauthEnabled[x as keyof typeof config.oauthEnabled] === true,
      );

      if (provider) {
        window.location.href = `/api/auth/oauth/${provider.toLowerCase()}`;
      }
    }
  }, [willRedirect, config]);

  useEffect(() => {
    if (passkeyErrored) {
      setTimeout(() => {
        setPasskeyErrored(false);
      }, 3000);

      showNotification({
        title: 'Error while authenticating with passkey',
        message: 'Please try again',
        color: 'red',
        icon: <IconX size='1rem' />,
      });
    }
  }, [passkeyErrored]);

  useEffect(() => {
    if (config?.firstSetup) navigate('/auth/setup');
  }, [config]);

  if (configLoading) return <LoadingOverlay visible />;

  if (configError)
    return (
      <GenericError
        title='Error loading configuration'
        message='Could not load server configuration...'
        details={configError}
      />
    );

  if (!config) return <LoadingOverlay visible />;

  return (
    <>
      {willRedirect && !showLocalLogin && <LoadingOverlay visible />}

      <Modal onClose={() => {}} title='Enter code' opened={totpOpen} withCloseButton={false}>
        <Center>
          <PinInput
            data-autofocus
            length={6}
            oneTimeCode
            type='number'
            placeholder=''
            onChange={handlePinChange}
            autoFocus={true}
            error={!!pinError}
            disabled={pinDisabled}
            size='xl'
          />
        </Center>
        {pinError && (
          <Text ta='center' size='sm' c='red' mt={0}>
            {pinError}
          </Text>
        )}

        <Group mt='sm' grow>
          <Button
            leftSection={<IconX size='1rem' />}
            color='red'
            variant='outline'
            onClick={() => {
              setTotpOpen(false);
              form.reset();
            }}
          >
            Cancel login attempt
          </Button>
          <Button
            leftSection={<IconShieldQuestion size='1rem' />}
            loading={pinDisabled}
            type='submit'
            onClick={() => onSubmit(form.values, pin)}
          >
            Verify
          </Button>
        </Group>
      </Modal>

      <Box
        style={{
          minHeight: '100vh',
          background:
            colorScheme === 'dark'
              ? 'radial-gradient(circle at 50% 0%, rgba(76, 110, 245, 0.15) 0%, transparent 50%), linear-gradient(180deg, #1a1b1e 0%, #141517 100%)'
              : 'radial-gradient(circle at 50% 0%, rgba(76, 110, 245, 0.08) 0%, transparent 50%), linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated background blobs */}
        <Box
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '500px',
            height: '500px',
            background:
              colorScheme === 'dark'
                ? 'radial-gradient(circle, rgba(121, 80, 242, 0.2) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(121, 80, 242, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <Box
          style={{
            position: 'absolute',
            bottom: '-10%',
            left: '-5%',
            width: '600px',
            height: '600px',
            background:
              colorScheme === 'dark'
                ? 'radial-gradient(circle, rgba(76, 110, 245, 0.2) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(76, 110, 245, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        />

        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              33% { transform: translate(30px, -30px) rotate(120deg); }
              66% { transform: translate(-20px, 20px) rotate(240deg); }
            }
            @keyframes shimmer {
              0% { background-position: -1000px 0; }
              100% { background-position: 1000px 0; }
            }
          `}
        </style>

        <Center h='100vh' style={{ position: 'relative', zIndex: 1 }}>
          <Paper
            w='400px'
            p='xl'
            shadow='xl'
            withBorder
            radius='xl'
            style={{
              borderColor: colorScheme === 'dark' ? 'rgba(76, 110, 245, 0.3)' : 'rgba(76, 110, 245, 0.2)',
              borderWidth: '2px',
              boxShadow:
                colorScheme === 'dark'
                  ? '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(76, 110, 245, 0.2)'
                  : '0 20px 60px rgba(0, 0, 0, 0.1), 0 0 40px rgba(76, 110, 245, 0.15)',
              backdropFilter: 'blur(10px)',
              backgroundColor: colorScheme === 'dark' ? 'rgba(26, 27, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)',
            }}
          >
            <div style={{ width: '100%', overflowWrap: 'break-word' }}>
              <Title
                order={1}
                ta='center'
                mb='lg'
                style={{
                  whiteSpace: 'normal',
                  fontSize: `clamp(24px, ${Math.max(
                    50 - (config.website.title?.length ?? 0) / 2,
                    24,
                  )}px, 50px)`,
                  background: 'linear-gradient(135deg, #4c6ef5 0%, #7950f2 50%, #e64980 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 900,
                }}
              >
                {config.website.title ?? 'ShareHost'}
              </Title>
            </div>

            {showLocalLogin && (
              <form onSubmit={form.onSubmit((v) => onSubmit(v))}>
                <Stack gap='md'>
                  <TextInput
                    size='lg'
                    placeholder='Enter your username...'
                    {...form.getInputProps('username', { withError: true })}
                  />

                  <PasswordInput
                    size='lg'
                    placeholder='Enter your password...'
                    {...form.getInputProps('password')}
                  />

                  <Button
                    size='lg'
                    fullWidth
                    type='submit'
                    loading={!config}
                    variant='gradient'
                    gradient={{ from: 'blue', to: 'violet', deg: 135 }}
                    style={{
                      transition: 'all 0.3s ease',
                    }}
                    styles={{
                      root: {
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 28px rgba(76, 110, 245, 0.4)',
                        },
                      },
                    }}
                  >
                    Login
                  </Button>
                </Stack>
              </form>
            )}

            <Stack gap='md' mt='md'>
              {(config.features.oauthRegistration || config.features.userRegistration) && (
                <Divider
                  label='or'
                  labelPosition='center'
                  styles={{
                    label: {
                      color: colorScheme === 'dark' ? '#a5a5a5' : '#868e96',
                    },
                  }}
                />
              )}

              {config.mfa.passkeys && (
                <Button
                  onClick={handlePasskeyLogin}
                  size='lg'
                  fullWidth
                  variant='light'
                  color='violet'
                  leftSection={<IconKey size='1.2rem' />}
                  disabled={passkeyErrored}
                  loading={passkeyLoading}
                  style={{
                    transition: 'all 0.3s ease',
                  }}
                  styles={{
                    root: {
                      '&:hover': {
                        transform: 'translateY(-1px)',
                      },
                    },
                  }}
                >
                  Login with passkey
                </Button>
              )}

              {config.features.userRegistration && (
                <Button
                  component={Link}
                  to='/auth/register'
                  size='lg'
                  fullWidth
                  variant='light'
                  color='blue'
                  leftSection={<IconUserPlus size='1.2rem' />}
                  style={{
                    transition: 'all 0.3s ease',
                  }}
                  styles={{
                    root: {
                      '&:hover': {
                        transform: 'translateY(-1px)',
                      },
                    },
                  }}
                >
                  Sign up
                </Button>
              )}

              <Group grow>
                {config.oauthEnabled.discord && (
                  <ExternalAuthButton
                    provider='Discord'
                    leftSection={<IconBrandDiscordFilled stroke={4} size='1.1rem' />}
                  />
                )}
                {config.oauthEnabled.github && (
                  <ExternalAuthButton
                    provider='GitHub'
                    leftSection={<IconBrandGithubFilled size='1.1rem' />}
                  />
                )}
                {config.oauthEnabled.google && (
                  <ExternalAuthButton
                    provider='Google'
                    leftSection={<IconBrandGoogleFilled stroke={4} size='1.1rem' />}
                  />
                )}
                {config.oauthEnabled.oidc && (
                  <ExternalAuthButton provider='OIDC' leftSection={<IconCircleKeyFilled size='1.1rem' />} />
                )}
              </Group>
            </Stack>
          </Paper>
        </Center>
      </Box>
    </>
  );
}
