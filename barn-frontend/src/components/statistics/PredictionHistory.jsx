import React, { useState, useEffect, useCallback } from 'react';
import { predictionsAPI } from '../../services/api';
import { format, parseISO } from 'date-fns';
import {
  FiFilter, FiCalendar, FiAnchor, FiEye, FiEdit3, FiSave, FiX, FiTrash2,
  FiAlertTriangle, FiClock, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';

const PredictionHistory = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [editingNotes, setEditingNotes] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Filter and pagination state
  const [filters, setFilters] = useState({
    vesselName: '',
    riskCategory: '',
    startDate: '',
    endDate: ''
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0
  });

  // Format date helper
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Invalid Date';
    }
  };

  // Get risk category color classes
  const getRiskCategoryColor = (category) => {
    const colors = {
      Low: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      High: 'bg-orange-100 text-orange-800',
      Critical: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Get prediction method color
  const getMethodColor = (method) => {
    return method === 'ml_model' ? 'text-green-600' : 'text-orange-600';
  };

  // Fetch predictions
  const fetchPredictions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        ...filters
      };

      const response = await predictionsAPI.getPredictionHistory(params);
      
      if (response.success) {
        setPredictions(response.data.predictions || []);
        setPagination(prev => ({
          ...prev,
          totalRecords: response.data.totalRecords || 0,
          totalPages: response.data.totalPages || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setError('Failed to fetch prediction history');
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.limit, filters]);

  // Load predictions on mount and filter changes
  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      vesselName: '',
      riskCategory: '',
      startDate: '',
      endDate: ''
    });
  };

  // Handle page changes
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  // View prediction details
  const handleViewDetails = (prediction) => {
    setSelectedPrediction(prediction);
  };

  // Handle notes editing
  const handleEditNotes = (predictionId, currentNotes = '') => {
    setEditingNotes(predictionId);
    setNoteText(currentNotes);
  };

  const handleSaveNotes = async (predictionId) => {
    try {
      await predictionsAPI.updatePredictionNotes(predictionId, noteText);
      
      // Update local state
      setPredictions(prev => prev.map(p => 
        p._id === predictionId ? { ...p, userNotes: noteText } : p
      ));
      
      setEditingNotes(null);
      setNoteText('');
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save notes');
    }
  };

  const handleCancelEditNotes = () => {
    setEditingNotes(null);
    setNoteText('');
  };

  // Delete prediction
  const handleDeletePrediction = async (predictionId) => {
    if (!confirm('Are you sure you want to delete this prediction?')) {
      return;
    }

    try {
      await predictionsAPI.deletePrediction(predictionId);
      setPredictions(prev => prev.filter(p => p._id !== predictionId));
      
      // Update pagination if needed
      if (predictions.length === 1 && pagination.currentPage > 1) {
        setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
      } else {
        fetchPredictions(); // Refresh to get accurate counts
      }
    } catch (error) {
      console.error('Error deleting prediction:', error);
      alert('Failed to delete prediction');
    }
  };

  // Modal component for prediction details
  const PredictionModal = ({ prediction, onClose }) => {
    if (!prediction) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Prediction Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Prediction Results */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Prediction Results</h3>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biofouling Level:</span>
                    <span className="font-medium">{prediction.prediction?.biofouling_level}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confidence Score:</span>
                    <span className="font-medium">{(prediction.prediction?.confidence_score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Risk Category:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskCategoryColor(prediction.prediction?.risk_category)}`}>
                      {prediction.prediction?.risk_category}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Input Parameters</h3>
                <div className="space-y-2 bg-gray-50 p-4 rounded-lg text-sm">
                  {Object.entries(prediction.inputData || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Model Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Model Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Model Version:</span>
                  <span className="font-medium">{prediction.modelVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prediction Method:</span>
                  <span className={`font-medium ${getMethodColor(prediction.predictionMethod)}`}>
                    {prediction.predictionMethod === 'ml_model' ? 'ML Model' : 'Fallback Calculation'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{formatDate(prediction.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {prediction.userNotes && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Notes</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800">{prediction.userNotes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Prediction History</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <FiFilter className="w-5 h-5 mr-2" />
            Filters
          </h2>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Vessel Name Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vessel Name
            </label>
            <input
              type="text"
              value={filters.vesselName}
              onChange={(e) => handleFilterChange('vesselName', e.target.value)}
              placeholder="Search by vessel name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Risk Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Risk Category
            </label>
            <select
              value={filters.riskCategory}
              onChange={(e) => handleFilterChange('riskCategory', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Risk Categories</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Date Range Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Predictions Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-600">
            <FiAlertTriangle className="w-6 h-6 mr-2" />
            {error}
          </div>
        ) : predictions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <FiClock className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">No predictions found</p>
            <p className="text-sm">Try adjusting your filters or create a new prediction</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vessel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Biofouling Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {predictions.map((prediction) => (
                    <tr key={prediction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(prediction.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <FiAnchor className="w-4 h-4 mr-2 text-gray-400" />
                          {prediction.vesselInfo?.name || 'Unknown Vessel'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {prediction.prediction?.biofouling_level}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          getRiskCategoryColor(prediction.prediction?.risk_category)
                        }`}>
                          {prediction.prediction?.risk_category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={getMethodColor(prediction.predictionMethod)}>
                          {prediction.predictionMethod === 'ml_model' ? 'ML Model' : 'Fallback'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(prediction)}
                            className="text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          
                          {editingNotes === prediction._id ? (
                            <div className="flex items-center space-x-1">
                              <input
                                type="text"
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Add notes..."
                                className="text-xs border rounded px-2 py-1 w-24"
                                onKeyPress={(e) => e.key === 'Enter' && handleSaveNotes(prediction._id)}
                              />
                              <button
                                onClick={() => handleSaveNotes(prediction._id)}
                                className="text-green-600 hover:text-green-700 p-1 hover:bg-green-50 rounded"
                                title="Save Notes"
                              >
                                <FiSave className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancelEditNotes}
                                className="text-gray-600 hover:text-gray-700 p-1 hover:bg-gray-50 rounded"
                                title="Cancel"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditNotes(prediction._id, prediction.userNotes)}
                              className="text-gray-600 hover:text-gray-700 p-1 hover:bg-gray-50 rounded"
                              title={prediction.userNotes ? 'Edit Notes' : 'Add Notes'}
                            >
                              <FiEdit3 className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDeletePrediction(prediction._id)}
                            className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                            title="Delete Prediction"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-3 border-t bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalRecords)} of{' '}
                  {pagination.totalRecords} results
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>

                  <span className="text-sm text-gray-700">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <FiChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Prediction Details Modal */}
      <PredictionModal
        prediction={selectedPrediction}
        onClose={() => {
          setSelectedPrediction(null);
        }}
      />
    </div>
  );
};

export default PredictionHistory;