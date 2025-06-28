import useSWR from 'swr';
import type { TrafficData } from '@shared/schema';

export const useTraffic = () => {
  return useSWR<TrafficData>(
    '/api/traffic',
    {
      refreshInterval: 60000, // Update every minute
      revalidateOnFocus: true, // Refresh when user returns to tab
      dedupingInterval: 30000,
    }
  );
};