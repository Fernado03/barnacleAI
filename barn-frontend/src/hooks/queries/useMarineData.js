import { useQuery, useQueryClient } from '@tanstack/react-query';
import { marineDataAPI } from '../../services/api';

// Query keys for marine data
export const marineDataKeys = {
  all: ['marineData'],
  lists: () => [...marineDataKeys.all, 'list'],
  list: (filters) => [...marineDataKeys.lists(), { filters }],
  details: () => [...marineDataKeys.all, 'detail'],
  detail: (id) => [...marineDataKeys.details(), id],
  ais: () => [...marineDataKeys.all, 'ais'],
  weather: () => [...marineDataKeys.all, 'weather'],
  oceanCurrents: () => [...marineDataKeys.all, 'oceanCurrents'],
  environmental: () => [...marineDataKeys.all, 'environmental'],
};

// Hook for all marine data (dashboard view)
export const useAllMarineData = (options = {}) => {
  return useQuery({
    queryKey: marineDataKeys.all,
    queryFn: marineDataAPI.getAllMarineData,
    staleTime: 1000 * 60 * 2, // 2 minutes for real-time data
    cacheTime: 1000 * 60 * 5, // 5 minutes cache
    refetchInterval: 1000 * 30, // Refetch every 30 seconds for live data
    refetchIntervalInBackground: true,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error?.status === 401 || error?.status === 403) return false;
      return failureCount < 3;
    },
    ...options,
  });
};

// Hook for AIS data
export const useAISData = (options = {}) => {
  return useQuery({
    queryKey: marineDataKeys.ais(),
    queryFn: marineDataAPI.getAISData,
    staleTime: 1000 * 30, // 30 seconds for vessel tracking
    cacheTime: 1000 * 60 * 3, // 3 minutes cache
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
    refetchIntervalInBackground: true,
    ...options,
  });
};

// Hook for weather data
export const useWeatherData = (options = {}) => {
  return useQuery({
    queryKey: marineDataKeys.weather(),
    queryFn: marineDataAPI.getWeatherData,
    staleTime: 1000 * 60 * 5, // 5 minutes for weather data
    cacheTime: 1000 * 60 * 10, // 10 minutes cache
    refetchInterval: 1000 * 60 * 3, // Refetch every 3 minutes
    refetchIntervalInBackground: true,
    ...options,
  });
};

// Hook for ocean currents data
export const useOceanCurrents = (options = {}) => {
  return useQuery({
    queryKey: marineDataKeys.oceanCurrents(),
    queryFn: marineDataAPI.getOceanCurrents,
    staleTime: 1000 * 60 * 10, // 10 minutes for ocean currents
    cacheTime: 1000 * 60 * 20, // 20 minutes cache
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes
    refetchIntervalInBackground: true,
    ...options,
  });
};

// Hook for environmental data
export const useEnvironmentalData = (options = {}) => {
  return useQuery({
    queryKey: marineDataKeys.environmental(),
    queryFn: marineDataAPI.getEnvironmentalData,
    staleTime: 1000 * 60 * 15, // 15 minutes for environmental data
    cacheTime: 1000 * 60 * 30, // 30 minutes cache
    refetchInterval: 1000 * 60 * 15, // Refetch every 15 minutes
    refetchIntervalInBackground: true,
    ...options,
  });
};

// Combined hook for real-time dashboard (optimized for marine operations)
export const useRealTimeMarineData = () => {
  const queryClient = useQueryClient();
  
  const allData = useAllMarineData({
    onSuccess: (data) => {
      // Pre-populate individual query caches with the combined data
      if (data?.data) {
        if (data.data.ais) {
          queryClient.setQueryData(marineDataKeys.ais(), {
            data: data.data.ais,
            timestamp: data.timestamp,
          });
        }
        if (data.data.weather) {
          queryClient.setQueryData(marineDataKeys.weather(), {
            data: data.data.weather,
            timestamp: data.timestamp,
          });
        }
        if (data.data.oceanCurrents) {
          queryClient.setQueryData(marineDataKeys.oceanCurrents(), {
            data: data.data.oceanCurrents,
            timestamp: data.timestamp,
          });
        }
        if (data.data.environmental) {
          queryClient.setQueryData(marineDataKeys.environmental(), {
            data: data.data.environmental,
            timestamp: data.timestamp,
          });
        }
      }
    },
  });

  return {
    ...allData,
    isRealTime: true,
    lastUpdate: allData.data?.timestamp,
  };
};

// Utility hook for invalidating marine data
export const useInvalidateMarineData = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: marineDataKeys.all }),
    invalidateAIS: () => queryClient.invalidateQueries({ queryKey: marineDataKeys.ais() }),
    invalidateWeather: () => queryClient.invalidateQueries({ queryKey: marineDataKeys.weather() }),
    invalidateOceanCurrents: () => queryClient.invalidateQueries({ queryKey: marineDataKeys.oceanCurrents() }),
    invalidateEnvironmental: () => queryClient.invalidateQueries({ queryKey: marineDataKeys.environmental() }),
    refreshAll: () => {
      queryClient.invalidateQueries({ queryKey: marineDataKeys.all });
      queryClient.refetchQueries({ queryKey: marineDataKeys.all });
    },
  };
};