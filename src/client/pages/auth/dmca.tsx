import Markdown from '@/components/render/Markdown';
import { Response } from '@/lib/api/response';
import { useTitle } from '@/lib/hooks/useTitle';
import { Container, LoadingOverlay } from '@mantine/core';
import useSWR from 'swr';
import GenericError from '../../error/GenericError';

export function Component() {
  useTitle('DMCA Policy');

  const {
    data: config,
    error,
    isLoading,
  } = useSWR<Response['/api/server/public']>('/api/server/public', {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenHidden: false,
    revalidateIfStale: false,
  });

  if (isLoading) return <LoadingOverlay visible />;

  if (error) {
    return (
      <GenericError
        title='Error loading DMCA Policy'
        message='Could not load DMCA Policy file...'
        details={error}
      />
    );
  }

  return (
    <Container my='lg'>
      <Markdown md={config?.dmca || ''} />
    </Container>
  );
}

Component.displayName = 'Dmca';

Component.displayName = 'Dmca';
