import {
  Button,
  Container,
  Text,
  Title,
  Stack,
  Group,
  Paper,
  Grid,
  Box,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconCloudUpload,
  IconLink,
  IconShieldCheck,
  IconBolt,
  IconDevices,
  IconLock,
  IconLogin,
  IconUserPlus,
  IconFileText,
  IconScale,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
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
    },
    {
      icon: IconLink,
      title: 'URL Shortening',
      description: 'Create short, memorable links with custom domains and detailed analytics.',
    },
    {
      icon: IconShieldCheck,
      title: 'Password Protection',
      description: 'Secure your uploads with password protection and expiration dates.',
    },
    {
      icon: IconBolt,
      title: 'Fast & Reliable',
      description: 'Built for speed with optimized delivery and 99.9% uptime guarantee.',
    },
    {
      icon: IconDevices,
      title: 'Cross-Platform',
      description: 'Works seamlessly across all devices with ShareX integration support.',
    },
    {
      icon: IconLock,
      title: 'Privacy First',
      description: 'Your data is encrypted and secure. We respect your privacy always.',
    },
  ];

  return (
    <Box
      style={{
        minHeight: '100vh',
        background:
          colorScheme === 'dark'
            ? 'linear-gradient(180deg, #1a1b1e 0%, #25262b 100%)'
            : 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
      }}
    >
      {/* Hero Section */}
      <Container size='lg' py={80}>
        <Stack align='center' gap='xl'>
          {/* Logo/Title */}
          <Stack align='center' gap='md'>
            <Title
              order={1}
              size={60}
              fw={900}
              style={{
                background: 'linear-gradient(45deg, #4c6ef5 0%, #7950f2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {settings?.website?.title || 'ShareHost'}
            </Title>
            <Text size='xl' c='dimmed' ta='center' maw={600}>
              The next generation file sharing and URL shortening platform. Fast, secure, and built for the
              modern web.
            </Text>
          </Stack>

          {/* CTA Buttons */}
          <Group gap='md' mt='xl'>
            <Button
              size='lg'
              leftSection={<IconLogin size={20} />}
              onClick={() => navigate('/auth/login')}
              variant='gradient'
              gradient={{ from: 'blue', to: 'violet', deg: 45 }}
            >
              Login
            </Button>
            {settings?.features?.userRegistration && (
              <Button
                size='lg'
                leftSection={<IconUserPlus size={20} />}
                onClick={() => navigate('/auth/register')}
                variant='light'
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
            >
              Terms of Service
            </Button>
            <Button
              size='sm'
              leftSection={<IconScale size={16} />}
              onClick={() => navigate('/dmca')}
              variant='subtle'
              color='gray'
            >
              DMCA Policy
            </Button>
          </Group>
        </Stack>
      </Container>

      {/* Features Section */}
      <Container size='lg' py={60}>
        <Stack gap='xl'>
          <Stack align='center' gap='md'>
            <Title order={2} ta='center'>
              Powerful Features
            </Title>
            <Text size='lg' c='dimmed' ta='center' maw={600}>
              Everything you need for file sharing and URL management in one modern platform
            </Text>
          </Stack>

          <Grid gutter='lg' mt='xl'>
            {features.map((feature, index) => (
              <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                <Paper
                  p='xl'
                  radius='md'
                  withBorder
                  style={{
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = theme.shadows.md;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Stack gap='md'>
                    <feature.icon size={40} color={theme.colors.blue[6]} stroke={1.5} />
                    <Title order={4}>{feature.title}</Title>
                    <Text size='sm' c='dimmed'>
                      {feature.description}
                    </Text>
                  </Stack>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Container>

      {/* Footer CTA */}
      <Container size='lg' py={80}>
        <Paper
          p='xl'
          radius='md'
          style={{
            background:
              colorScheme === 'dark'
                ? 'linear-gradient(135deg, #4c6ef5 0%, #7950f2 100%)'
                : 'linear-gradient(135deg, #5c7cfa 0%, #845ef7 100%)',
          }}
        >
          <Stack align='center' gap='lg'>
            <Title order={2} c='white' ta='center'>
              Ready to get started?
            </Title>
            <Text size='lg' c='white' ta='center' maw={600} style={{ opacity: 0.9 }}>
              Join thousands of users who trust {settings?.website?.title || 'ShareHost'} for their file
              sharing needs.
            </Text>
            <Group gap='md'>
              <Button
                size='lg'
                leftSection={<IconLogin size={20} />}
                onClick={() => navigate('/auth/login')}
                variant='white'
                color='dark'
              >
                Login Now
              </Button>
              {settings?.features?.userRegistration && (
                <Button
                  size='lg'
                  leftSection={<IconUserPlus size={20} />}
                  onClick={() => navigate('/auth/register')}
                  variant='outline'
                  color='white'
                  styles={{
                    root: {
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
      </Container>

      {/* Footer */}
      <Box
        py='xl'
        style={{
          borderTop: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        }}
      >
        <Container size='lg'>
          <Text size='sm' c='dimmed' ta='center'>
            © {new Date().getFullYear()} {settings?.website?.title || 'ShareHost'}. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
