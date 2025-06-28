import useSWR from 'swr';
import { REFRESH_INTERVALS } from '../lib/constants';
import type { SunData } from '@shared/schema';

export const useSun = () => {
  return useSWR<SunData>(
    '/api/sun',
    {
      refreshInterval: REFRESH_INTERVALS.WEATHER_MS, // Update every 15 minutes
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );
};