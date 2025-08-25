import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fleetAPI } from '../../services/api';
import { useMaritimeNotifications } from '../useMaritimeNotifications';

// Query keys for fleet data
export const fleetKeys = {
  all: ['fleet'],
  lists: () => [...fleetKeys.all, 'list'],
  list: (filters) => [...fleetKeys.lists(), { filters }],
  details: () => [...fleetKeys.all, 'detail'],
  detail: (id) => [...fleetKeys.details(), id],
  vessels: () => [...fleetKeys.all, 'vessels'],
  vessel: (id) => [...fleetKeys.vessels(), id],
  maintenance: (vesselId) => [...fleetKeys.all, 'maintenance', vesselId],
};

// Hook for fleet data
export const useFleetData = (options = {}) => {
  return useQuery({
    queryKey: fleetKeys.all,
    queryFn: fleetAPI.getFleetData,
    staleTime: 1000 * 60 * 10, // 10 minutes - data stays fresh longer
    cacheTime: 1000 * 60 * 30, // 30 minutes cache
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes (less aggressive)
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false, // Prevent refetch on window focus for stability
    refetchOnReconnect: true, // Still refetch on network reconnect
    retry: (failureCount, error) => {
      if (error?.status === 401 || error?.status === 403) return false;
      return failureCount < 3;
    },
    // Ensure data persists longer for consistent trends
    structuralSharing: true,
    keepPreviousData: true,
    ...options,
  });
};

// Hook for individual vessel data
export const useVesselData = (vesselId, options = {}) => {
  return useQuery({
    queryKey: fleetKeys.vessel(vesselId),
    queryFn: () => fleetAPI.getVesselById(vesselId),
    enabled: !!vesselId,
    staleTime: 1000 * 60 * 3, // 3 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes cache
    ...options,
  });
};

// Hook for maintenance schedule
export const useMaintenanceSchedule = (vesselId, options = {}) => {
  return useQuery({
    queryKey: fleetKeys.maintenance(vesselId),
    queryFn: () => fleetAPI.getMaintenanceSchedule(vesselId),
    enabled: !!vesselId,
    staleTime: 1000 * 60 * 10, // 10 minutes for maintenance data
    cacheTime: 1000 * 60 * 30, // 30 minutes cache
    ...options,
  });
};

// Mutation for updating vessel status
export const useUpdateVesselStatus = () => {
  const queryClient = useQueryClient();
  const notifications = useMaritimeNotifications();

  return useMutation({
    mutationFn: ({ vesselId, statusData }) => 
      fleetAPI.updateVesselStatus(vesselId, statusData),
    onSuccess: (data, { vesselId }) => {
      // Invalidate and refetch fleet data
      queryClient.invalidateQueries({ queryKey: fleetKeys.all });
      queryClient.invalidateQueries({ queryKey: fleetKeys.vessel(vesselId) });
      
      // Show success notification
      notifications.vessel.statusUpdated({
        vesselId,
        status: data.data.status,
        message: `Vessel status updated to ${data.data.status}`,
      });
    },
    onError: (error, { vesselId }) => {
      notifications.system.error({
        title: 'Update Failed',
        message: `Failed to update vessel ${vesselId} status: ${error.message}`,
        isError: true,
      });
    },
  });
};

// Mutation for scheduling maintenance
export const useScheduleMaintenance = () => {
  const queryClient = useQueryClient();
  const notifications = useMaritimeNotifications();

  return useMutation({
    mutationFn: ({ vesselId, maintenanceData }) => 
      fleetAPI.scheduleMaintenance(vesselId, maintenanceData),
    onSuccess: (data, { vesselId }) => {
      // Invalidate maintenance and fleet data
      queryClient.invalidateQueries({ queryKey: fleetKeys.maintenance(vesselId) });
      queryClient.invalidateQueries({ queryKey: fleetKeys.all });
      
      // Show success notification
      notifications.vessel.maintenanceScheduled({
        vesselId,
        maintenanceType: data.data.type,
        scheduledDate: data.data.scheduledDate,
        message: `Maintenance scheduled for ${vesselId}`,
      });
    },
    onError: (error, { vesselId }) => {
      notifications.system.error({
        title: 'Scheduling Failed',
        message: `Failed to schedule maintenance for ${vesselId}: ${error.message}`,
        isError: true,
      });
    },
  });
};

// Mutation for updating maintenance status
export const useUpdateMaintenanceStatus = () => {
  const queryClient = useQueryClient();
  const notifications = useMaritimeNotifications();

  return useMutation({
    mutationFn: ({ maintenanceId, statusData }) => 
      fleetAPI.updateMaintenanceStatus(maintenanceId, statusData),
    onSuccess: (data, { maintenanceId }) => {
      // Invalidate all maintenance-related queries
      queryClient.invalidateQueries({ queryKey: [...fleetKeys.all, 'maintenance'] });
      queryClient.invalidateQueries({ queryKey: fleetKeys.all });
      
      // Show appropriate notification based on status
      const status = data.data.status;
      if (status === 'Completed') {
        notifications.vessel.maintenanceCompleted({
          maintenanceId,
          message: `Maintenance ${maintenanceId} completed successfully`,
        });
      } else {
        notifications.system.dataProcessing({
          title: 'Maintenance Updated',
          message: `Maintenance ${maintenanceId} status updated to ${status}`,
        });
      }
    },
    onError: (error, { maintenanceId }) => {
      notifications.system.error({
        title: 'Update Failed',
        message: `Failed to update maintenance ${maintenanceId}: ${error.message}`,
        isError: true,
      });
    },
  });
};

// Combined hook for fleet dashboard
export const useFleetDashboard = () => {
  const fleetQuery = useFleetData();
  
  return {
    ...fleetQuery,
    vessels: fleetQuery.data?.data?.vessels || [],
    summary: fleetQuery.data?.data?.summary || {},
    isFleetDataLoaded: !fleetQuery.isLoading && !fleetQuery.isError,
  };
};

// Hook for vessel performance metrics
export const useVesselPerformance = (vesselId) => {
  const vesselQuery = useVesselData(vesselId);
  
  return {
    ...vesselQuery,
    performance: vesselQuery.data?.data?.performance || {},
    biofoulingLevel: vesselQuery.data?.data?.performance?.biofoulingLevel || 0,
    fuelConsumption: vesselQuery.data?.data?.performance?.fuelConsumption || 0,
    operationalEfficiency: vesselQuery.data?.data?.performance?.operationalEfficiency || 0,
  };
};

// Utility hook for fleet operations
export const useFleetOperations = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateFleetData: () => queryClient.invalidateQueries({ queryKey: fleetKeys.all }),
    invalidateVessel: (vesselId) => queryClient.invalidateQueries({ queryKey: fleetKeys.vessel(vesselId) }),
    invalidateMaintenance: (vesselId) => queryClient.invalidateQueries({ queryKey: fleetKeys.maintenance(vesselId) }),
    refreshFleetData: () => {
      queryClient.invalidateQueries({ queryKey: fleetKeys.all });
      queryClient.refetchQueries({ queryKey: fleetKeys.all });
    },
    prefetchVessel: (vesselId) => {
      queryClient.prefetchQuery({
        queryKey: fleetKeys.vessel(vesselId),
        queryFn: () => fleetAPI.getVesselById(vesselId),
        staleTime: 1000 * 60 * 5,
      });
    },
  };
};