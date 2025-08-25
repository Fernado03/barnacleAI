// TanStack Query Hooks Exports
// This file provides a centralized export for all query hooks

// Import query keys first
import { marineDataKeys } from './useMarineData';
import { fleetKeys } from './useFleetData';
import { esgKeys, predictionsKeys } from './useESGAndPredictions';

// Marine Data hooks
export {
  useAllMarineData,
  useAISData,
  useWeatherData,
  useOceanCurrents,
  useEnvironmentalData,
  useRealTimeMarineData,
  useInvalidateMarineData,
  marineDataKeys
} from './useMarineData';

// Fleet Management hooks
export {
  useFleetData,
  useVesselData,
  useMaintenanceSchedule,
  useUpdateVesselStatus,
  useScheduleMaintenance,
  useUpdateMaintenanceStatus,
  useFleetDashboard,
  useVesselPerformance,
  useFleetOperations,
  fleetKeys
} from './useFleetData';

// ESG and Predictions hooks
export {
  // ESG hooks
  useESGData,
  useEnvironmentalMetrics,
  useSocialMetrics,
  useGovernanceMetrics,
  useESGBenchmarks,
  useUpdateESGTargets,
  useGenerateESGReport,
  useESGDashboard,
  useInvalidateESGData,
  esgKeys,
  
  // Predictions hooks
  usePredictionModels,
  useBiofoulingPrediction,
  useFuelConsumptionPrediction,
  useMaintenancePrediction,
  useGeneratePredictions,
  useTrainModel,
  useVesselAnalytics,
  useInvalidatePredictions,
  predictionsKeys
} from './useESGAndPredictions';

// Query key collections for advanced usage
export const queryKeys = {
  marineData: marineDataKeys,
  fleet: fleetKeys,
  esg: esgKeys,
  predictions: predictionsKeys
};

// Utility functions for batch operations
export const invalidateAllData = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: ['marineData'] });
  queryClient.invalidateQueries({ queryKey: ['fleet'] });
  queryClient.invalidateQueries({ queryKey: ['esg'] });
  queryClient.invalidateQueries({ queryKey: ['predictions'] });
};

export const refreshAllData = (queryClient) => {
  queryClient.refetchQueries({ queryKey: ['marineData'] });
  queryClient.refetchQueries({ queryKey: ['fleet'] });
  queryClient.refetchQueries({ queryKey: ['esg'] });
  queryClient.refetchQueries({ queryKey: ['predictions'] });
};