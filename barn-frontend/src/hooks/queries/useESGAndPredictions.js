import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { esgAPI, predictionsAPI } from '../../services/api';
import { useMaritimeNotifications } from '../useMaritimeNotifications';

// Query keys for ESG data
export const esgKeys = {
  all: ['esg'],
  lists: () => [...esgKeys.all, 'list'],
  list: (filters) => [...esgKeys.lists(), { filters }],
  environmental: () => [...esgKeys.all, 'environmental'],
  social: () => [...esgKeys.all, 'social'],
  governance: () => [...esgKeys.all, 'governance'],
  benchmarks: () => [...esgKeys.all, 'benchmarks'],
  reports: () => [...esgKeys.all, 'reports'],
};

// Query keys for predictions data
export const predictionsKeys = {
  all: ['predictions'],
  models: () => [...predictionsKeys.all, 'models'],
  model: (id) => [...predictionsKeys.models(), id],
  vessels: () => [...predictionsKeys.all, 'vessels'],
  vessel: (id) => [...predictionsKeys.vessels(), id],
  biofouling: (vesselId, timeframe) => [...predictionsKeys.all, 'biofouling', vesselId, timeframe],
  fuel: (vesselId, timeframe) => [...predictionsKeys.all, 'fuel', vesselId, timeframe],
  maintenance: (vesselId) => [...predictionsKeys.all, 'maintenance', vesselId],
};

// ===== ESG HOOKS =====

// Hook for ESG data
export const useESGData = (options = {}) => {
  return useQuery({
    queryKey: esgKeys.all,
    queryFn: esgAPI.getESGData,
    staleTime: 1000 * 60 * 30, // 30 minutes for ESG data
    cacheTime: 1000 * 60 * 60, // 1 hour cache
    refetchInterval: 1000 * 60 * 30, // Refetch every 30 minutes
    retry: (failureCount, error) => {
      if (error?.status === 401 || error?.status === 403) return false;
      return failureCount < 3;
    },
    ...options,
  });
};

// Hook for environmental metrics
export const useEnvironmentalMetrics = (options = {}) => {
  return useQuery({
    queryKey: esgKeys.environmental(),
    queryFn: esgAPI.getEnvironmentalMetrics,
    staleTime: 1000 * 60 * 20, // 20 minutes
    cacheTime: 1000 * 60 * 45, // 45 minutes cache
    ...options,
  });
};

// Hook for social metrics
export const useSocialMetrics = (options = {}) => {
  return useQuery({
    queryKey: esgKeys.social(),
    queryFn: esgAPI.getSocialMetrics,
    staleTime: 1000 * 60 * 30, // 30 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour cache
    ...options,
  });
};

// Hook for governance metrics
export const useGovernanceMetrics = (options = {}) => {
  return useQuery({
    queryKey: esgKeys.governance(),
    queryFn: esgAPI.getGovernanceMetrics,
    staleTime: 1000 * 60 * 30, // 30 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour cache
    ...options,
  });
};

// Hook for ESG benchmarks
export const useESGBenchmarks = (options = {}) => {
  return useQuery({
    queryKey: esgKeys.benchmarks(),
    queryFn: esgAPI.getESGBenchmarks,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours for benchmarks
    cacheTime: 1000 * 60 * 60 * 48, // 48 hours cache
    ...options,
  });
};

// Mutation for updating ESG targets
export const useUpdateESGTargets = () => {
  const queryClient = useQueryClient();
  const notifications = useMaritimeNotifications();

  return useMutation({
    mutationFn: (targets) => esgAPI.updateESGTargets(targets),
    onSuccess: (data) => {
      // Invalidate ESG data to reflect new targets
      queryClient.invalidateQueries({ queryKey: esgKeys.all });
      
      notifications.esg.targetAchieved({
        title: 'ESG Targets Updated',
        message: 'ESG targets have been successfully updated',
      });
    },
    onError: (error) => {
      notifications.system.error({
        title: 'Update Failed',
        message: `Failed to update ESG targets: ${error.message}`,
        isError: true,
      });
    },
  });
};

// Mutation for generating ESG reports
export const useGenerateESGReport = () => {
  const queryClient = useQueryClient();
  const notifications = useMaritimeNotifications();

  return useMutation({
    mutationFn: (reportConfig) => esgAPI.generateESGReport(reportConfig),
    onSuccess: (data) => {
      // Invalidate reports cache
      queryClient.invalidateQueries({ queryKey: esgKeys.reports() });
      
      notifications.fleet.reportGenerated({
        title: 'ESG Report Generated',
        message: `ESG report for ${data.data.period} period has been generated`,
        reportId: data.data.id,
      });
    },
    onError: (error) => {
      notifications.system.error({
        title: 'Report Generation Failed',
        message: `Failed to generate ESG report: ${error.message}`,
        isError: true,
      });
    },
  });
};

// ===== PREDICTIONS HOOKS =====

// Hook for prediction models
export const usePredictionModels = (options = {}) => {
  return useQuery({
    queryKey: predictionsKeys.models(),
    queryFn: predictionsAPI.getPredictionModels,
    staleTime: 1000 * 60 * 60, // 1 hour for models
    cacheTime: 1000 * 60 * 60 * 2, // 2 hours cache
    ...options,
  });
};

// Hook for biofouling predictions
export const useBiofoulingPrediction = (vesselId, timeframe = '30d', options = {}) => {
  return useQuery({
    queryKey: predictionsKeys.biofouling(vesselId, timeframe),
    queryFn: () => predictionsAPI.getBiofoulingPrediction(vesselId, timeframe),
    enabled: !!vesselId,
    staleTime: 1000 * 60 * 15, // 15 minutes for predictions
    cacheTime: 1000 * 60 * 30, // 30 minutes cache
    ...options,
  });
};

// Hook for fuel consumption predictions
export const useFuelConsumptionPrediction = (vesselId, timeframe = '30d', options = {}) => {
  return useQuery({
    queryKey: predictionsKeys.fuel(vesselId, timeframe),
    queryFn: () => predictionsAPI.getFuelConsumptionPrediction(vesselId, timeframe),
    enabled: !!vesselId,
    staleTime: 1000 * 60 * 15, // 15 minutes for predictions
    cacheTime: 1000 * 60 * 30, // 30 minutes cache
    ...options,
  });
};

// Hook for maintenance predictions
export const useMaintenancePrediction = (vesselId, options = {}) => {
  return useQuery({
    queryKey: predictionsKeys.maintenance(vesselId),
    queryFn: () => predictionsAPI.getMaintenancePrediction(vesselId),
    enabled: !!vesselId,
    staleTime: 1000 * 60 * 30, // 30 minutes for maintenance predictions
    cacheTime: 1000 * 60 * 60, // 1 hour cache
    ...options,
  });
};

// Mutation for generating predictions
export const useGeneratePredictions = () => {
  const queryClient = useQueryClient();
  const notifications = useMaritimeNotifications();

  return useMutation({
    mutationFn: (predictionConfig) => predictionsAPI.generatePredictions(predictionConfig),
    onSuccess: (data, variables) => {
      // Invalidate relevant prediction caches
      if (variables.vesselIds) {
        variables.vesselIds.forEach(vesselId => {
          queryClient.invalidateQueries({ queryKey: predictionsKeys.vessel(vesselId) });
        });
      } else {
        queryClient.invalidateQueries({ queryKey: predictionsKeys.all });
      }
      
      notifications.system.dataProcessing({
        title: 'Predictions Generated',
        message: `New predictions generated for ${data.data.predictions.length} vessels`,
      });
    },
    onError: (error) => {
      notifications.system.error({
        title: 'Prediction Failed',
        message: `Failed to generate predictions: ${error.message}`,
        isError: true,
      });
    },
  });
};

// Mutation for training models
export const useTrainModel = () => {
  const queryClient = useQueryClient();
  const notifications = useMaritimeNotifications();

  return useMutation({
    mutationFn: ({ modelId, trainingData }) => 
      predictionsAPI.trainModel(modelId, trainingData),
    onSuccess: (data, { modelId }) => {
      // Invalidate model data
      queryClient.invalidateQueries({ queryKey: predictionsKeys.models() });
      queryClient.invalidateQueries({ queryKey: predictionsKeys.model(modelId) });
      
      notifications.system.dataProcessing({
        title: 'Model Training Complete',
        message: `Model ${modelId} training completed with ${data.data.accuracy.toFixed(1)}% accuracy`,
      });
    },
    onError: (error, { modelId }) => {
      notifications.system.error({
        title: 'Training Failed',
        message: `Failed to train model ${modelId}: ${error.message}`,
        isError: true,
      });
    },
  });
};

// ===== COMBINED HOOKS =====

// Hook for vessel analytics (combines predictions and performance)
export const useVesselAnalytics = (vesselId) => {
  const biofouling = useBiofoulingPrediction(vesselId);
  const fuel = useFuelConsumptionPrediction(vesselId);
  const maintenance = useMaintenancePrediction(vesselId);

  return {
    biofouling,
    fuel,
    maintenance,
    isLoading: biofouling.isLoading || fuel.isLoading || maintenance.isLoading,
    isError: biofouling.isError || fuel.isError || maintenance.isError,
    error: biofouling.error || fuel.error || maintenance.error,
  };
};

// Hook for ESG dashboard
export const useESGDashboard = () => {
  const esgData = useESGData();
  const benchmarks = useESGBenchmarks();

  return {
    esgData,
    benchmarks,
    isLoading: esgData.isLoading || benchmarks.isLoading,
    isError: esgData.isError || benchmarks.isError,
    overallScore: esgData.data?.data?.overall?.esgScore || 0,
    environmentalScore: esgData.data?.data?.environmental || {},
    socialScore: esgData.data?.data?.social || {},
    governanceScore: esgData.data?.data?.governance || {},
  };
};

// Utility hooks for data operations
export const useInvalidateESGData = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: esgKeys.all }),
    refreshAll: () => {
      queryClient.invalidateQueries({ queryKey: esgKeys.all });
      queryClient.refetchQueries({ queryKey: esgKeys.all });
    },
  };
};

export const useInvalidatePredictions = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: predictionsKeys.all }),
    invalidateVessel: (vesselId) => queryClient.invalidateQueries({ queryKey: predictionsKeys.vessel(vesselId) }),
    refreshAll: () => {
      queryClient.invalidateQueries({ queryKey: predictionsKeys.all });
      queryClient.refetchQueries({ queryKey: predictionsKeys.all });
    },
  };
};