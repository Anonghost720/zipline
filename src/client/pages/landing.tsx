import {
  Box,
  Button,
  Container,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
  Transition,
  rem,
} from '@mantine/core';
import {
  IconBolt,
  IconCloudUpload,
  IconDevices,
  IconFileText,
  IconLink,
  IconLock,
  IconLogin,
  IconScale,
  IconShieldCheck,
  IconUserPlus,
  IconSparkles,
  IconArrowRight,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PublicSettings {
  website: {
    title: string;
  };
  features: {
    userRegistration: boolean;
  };
}

export function Component() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if user is already logged in
    fetch('/api/user')
      .then((res) => {
        if (res.ok) {
          // User is logged in, redirect to dashboard
          navigate('/dashboard');
        }
      })
      .catch(() => {
        // User not logged in, stay on landing page
      });

    // Fetch public settings
    fetch('/api/server/public')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(console.error);
  }, [navigate]);

  const features = [
    {
      icon: IconCloudUpload,
      title: 'File Uploads',
      description: 'Upload and share any file type with lightning-fast speeds and secure storage.',
      gradient: { from: 'blue', to: 'cyan', deg: 45 },
      color: 'blue',
    },
    {
      icon: IconLink,
      title: 'URL Shortening',
      description: 'Create short, memorable links with custom domains and detailed analytics.',
      gradient: { from: 'violet', to: 'purple', deg: 45 },
      color: 'violet',
    },
    {
      icon: IconShieldCheck,
      title: 'Password Protection',
      description: 'Secure your uploads with password protection and expiration dates.',
      gradient: { from: 'teal', to: 'green', deg: 45 },
      color: 'teal',
    },
    {
      icon: IconBolt,
      title: 'Fast & Reliable',
      description: 'Built for speed with optimized delivery and 99.9% uptime guarantee.',
      gradient: { from: 'orange', to: 'red', deg: 45 },
      color: 'orange',
    },
    {
      icon: IconDevices,
      title: 'Cross-Platform',
      description: 'Works seamlessly across all devices with ShareX integration support.',
      gradient: { from: 'indigo', to: 'blue', deg: 45 },
      color: 'indigo',
    },
    {
      icon: IconLock,
      title: 'Privacy First',
      description: 'Your data is encrypted and secure. We respect your privacy always.',
      gradient: { from: 'pink', to: 'grape', deg: 45 },
      color: 'pink',
    },
  ];

  return (
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
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(76, 110, 245, 0.3); }
            50% { box-shadow: 0 0 40px rgba(121, 80, 242, 0.5); }
          }
        `}
      </style>

      {/* Hero Section */}
      <Container size='lg' py={100} style={{ position: 'relative', zIndex: 1 }}>
        <Transition mounted={mounted} transition='fade-up' duration={800} timingFunction='ease'>
          {(styles) => (
            <Stack align='center' gap='xl' style={styles}>
              {/* Sparkle Icon */}
              <Box
                style={{
                  animation: 'pulse-glow 3s ease-in-out infinite',
                }}
              >
                <IconSparkles size={48} stroke={1.5} color={theme.colors.blue[5]} />
              </Box>

              {/* Logo/Title */}
              <Stack align='center' gap='md'>
                <Title
                  order={1}
                  size={72}
                  fw={900}
                  ta='center'
                  style={{
                    background: 'linear-gradient(135deg, #4c6ef5 0%, #7950f2 50%, #e64980 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    backgroundSize: '200% auto',
                    animation: 'shimmer 3s linear infinite',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {settings?.website?.title || 'ShareHost'}
                </Title>
                <Text size='xl' c='dimmed' ta='center' maw={700} fw={500}>
                  The next generation file sharing and URL shortening platform.{' '}
                  <Text component='span' c='blue' fw={700} inherit>
                    Fast, secure, and built for the modern web.
                  </Text>
                </Text>
              </Stack>

              {/* CTA Buttons */}
              <Group gap='md' mt='xl'>
                <Button
                  size='xl'
                  leftSection={<IconLogin size={24} />}
                  rightSection={<IconArrowRight size={20} />}
                  onClick={() => navigate('/auth/login')}
                  variant='gradient'
                  gradient={{ from: 'blue', to: 'violet', deg: 135 }}
                  styles={{
                    root: {
                      paddingLeft: rem(30),
                      paddingRight: rem(30),
                      height: rem(56),
                      fontSize: rem(18),
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px) scale(1.02)',
                        boxShadow: '0 12px 28px rgba(76, 110, 245, 0.4)',
                      },
                    },
                  }}
                >
                  Get Started
                </Button>
                {settings?.features?.userRegistration && (
                  <Button
                    size='xl'
                    leftSection={<IconUserPlus size={24} />}
                    onClick={() => navigate('/auth/register')}
                    variant='light'
                    color='violet'
                    styles={{
                      root: {
                        paddingLeft: rem(30),
                        paddingRight: rem(30),
                        height: rem(56),
                        fontSize: rem(18),
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          backgroundColor:
                            colorScheme === 'dark' ? 'rgba(121, 80, 242, 0.2)' : 'rgba(121, 80, 242, 0.15)',
                        },
                      },
                    }}
                  >
                    Create Account
                  </Button>
                )}
              </Group>

              {/* Quick Links */}
              <Group gap='md' mt='md'>
                <Button
                  size='sm'
                  leftSection={<IconFileText size={16} />}
                  onClick={() => navigate('/auth/tos')}
                  variant='subtle'
                  color='gray'
                  styles={{
                    root: {
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        backgroundColor:
                          colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      },
                    },
                  }}
                >
                  Terms of Service
                </Button>
                <Button
                  size='sm'
                  leftSection={<IconScale size={16} />}
                  onClick={() => navigate('/dmca')}
                  variant='subtle'
                  color='gray'
                  styles={{
                    root: {
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        backgroundColor:
                          colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      },
                    },
                  }}
                >
                  DMCA Policy
                </Button>
              </Group>
            </Stack>
          )}
        </Transition>
      </Container>

      {/* Features Section */}
      <Container size='lg' py={80} style={{ position: 'relative', zIndex: 1 }}>
        <Stack gap='xl'>
          <Transition mounted={mounted} transition='fade-up' duration={800} timingFunction='ease'>
            {(styles) => (
              <Stack align='center' gap='md' style={styles}>
                <Title
                  order={2}
                  ta='center'
                  size={42}
                  fw={800}
                  style={{
                    background: 'linear-gradient(90deg, #4c6ef5 0%, #7950f2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Powerful Features
                </Title>
                <Text size='lg' c='dimmed' ta='center' maw={700} fw={500}>
                  Everything you need for file sharing and URL management in one modern platform
                </Text>
              </Stack>
            )}
          </Transition>

          <Grid gutter='lg' mt='xl'>
            {features.map((feature, index) => (
              <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                <Transition
                  mounted={mounted}
                  transition='fade-up'
                  duration={600}
                  timingFunction='ease'
                  delay={100 + index * 100}
                >
                  {(styles) => (
                    <Paper
                      p='xl'
                      radius='lg'
                      withBorder
                      style={{
                        ...styles,
                        height: '100%',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'default',
                        borderColor: colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3],
                        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : 'white',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                        e.currentTarget.style.boxShadow = `0 20px 40px ${
                          colorScheme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'
                        }`;
                        e.currentTarget.style.borderColor = theme.colors[feature.color][5];
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor =
                          colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3];
                      }}
                    >
                      {/* Gradient Background on Hover */}
                      <Box
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: `linear-gradient(90deg, ${theme.colors[feature.color][5]} 0%, ${theme.colors[feature.color][7]} 100%)`,
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                        }}
                        className='feature-gradient'
                      />
                      <style>
                        {`
                          .mantine-Paper-root:hover .feature-gradient {
                            opacity: 1;
                          }
                        `}
                      </style>

                      <Stack gap='md'>
                        <Box
                          style={{
                            display: 'inline-flex',
                            padding: rem(12),
                            borderRadius: theme.radius.md,
                            background: `linear-gradient(135deg, ${theme.colors[feature.color][colorScheme === 'dark' ? 9 : 0]} 0%, ${theme.colors[feature.color][colorScheme === 'dark' ? 8 : 1]} 100%)`,
                            transition: 'transform 0.3s ease',
                          }}
                          className='feature-icon-box'
                        >
                          <feature.icon size={32} color={theme.colors[feature.color][6]} stroke={2} />
                        </Box>
                        <style>
                          {`
                            .mantine-Paper-root:hover .feature-icon-box {
                              transform: scale(1.1) rotate(5deg);
                            }
                          `}
                        </style>
                        <Title order={3} size='h4' fw={700}>
                          {feature.title}
                        </Title>
                        <Text size='sm' c='dimmed' style={{ lineHeight: 1.6 }}>
                          {feature.description}
                        </Text>
                      </Stack>
                    </Paper>
                  )}
                </Transition>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Container>

      {/* Footer CTA */}
      <Container size='lg' py={80} style={{ position: 'relative', zIndex: 1 }}>
        <Transition mounted={mounted} transition='fade-up' duration={800} timingFunction='ease'>
          {(styles) => (
            <Paper
              p='xl'
              radius='xl'
              style={{
                ...styles,
                background:
                  colorScheme === 'dark'
                    ? 'linear-gradient(135deg, #4c6ef5 0%, #7950f2 50%, #e64980 100%)'
                    : 'linear-gradient(135deg, #5c7cfa 0%, #845ef7 50%, #f06595 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 15s ease infinite',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <style>
                {`
                  @keyframes gradient-shift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                  }
                `}
              </style>

              {/* Overlay pattern */}
              <Box
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                  backgroundSize: '32px 32px',
                  opacity: 0.3,
                }}
              />

              <Stack align='center' gap='xl' style={{ position: 'relative', zIndex: 1 }}>
                <Title order={2} c='white' ta='center' size={42} fw={800}>
                  Ready to get started?
                </Title>
                <Text size='xl' c='white' ta='center' maw={700} style={{ opacity: 0.95 }} fw={500}>
                  Join thousands of users who trust {settings?.website?.title || 'ShareHost'} for their file
                  sharing needs. Start uploading and sharing in seconds.
                </Text>
                <Group gap='md' mt='md'>
                  <Button
                    size='xl'
                    leftSection={<IconLogin size={24} />}
                    onClick={() => navigate('/auth/login')}
                    variant='white'
                    color='dark'
                    styles={{
                      root: {
                        paddingLeft: rem(32),
                        paddingRight: rem(32),
                        height: rem(56),
                        fontSize: rem(18),
                        fontWeight: 700,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-3px) scale(1.05)',
                          boxShadow: '0 16px 32px rgba(0,0,0,0.3)',
                        },
                      },
                    }}
                  >
                    Login Now
                  </Button>
                  {settings?.features?.userRegistration && (
                    <Button
                      size='xl'
                      leftSection={<IconUserPlus size={24} />}
                      onClick={() => navigate('/auth/register')}
                      variant='outline'
                      styles={{
                        root: {
                          paddingLeft: rem(32),
                          paddingRight: rem(32),
                          height: rem(56),
                          fontSize: rem(18),
                          fontWeight: 700,
                          borderColor: 'rgba(255,255,255,0.8)',
                          color: 'white',
                          borderWidth: '2px',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            borderColor: 'white',
                            transform: 'translateY(-3px)',
                          },
                        },
                      }}
                    >
                      Sign Up Free
                    </Button>
                  )}
                </Group>
              </Stack>
            </Paper>
          )}
        </Transition>
      </Container>

      {/* Footer */}
      <Box
        py='xl'
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        }}
      >
        <Container size='lg'>
          <Text size='sm' c='dimmed' ta='center' fw={500}>
            © {new Date().getFullYear()} {settings?.website?.title || 'ShareHost'}. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
