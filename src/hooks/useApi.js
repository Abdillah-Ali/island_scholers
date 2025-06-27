import { useState, useCallback } from 'react';
import { ApiError } from '../services/api';

// Custom hook for API calls with loading and error states
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, options = {}) => {
    const { 
      onSuccess, 
      onError, 
      showLoading = true,
      errorMessage = null 
    } = options;

    try {
      if (showLoading) setLoading(true);
      setError(null);
      
      const result = await apiCall();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const errorMsg = errorMessage || (err instanceof ApiError ? err.message : 'An unexpected error occurred');
      setError(errorMsg);
      
      if (onError) {
        onError(err);
      } else {
        console.error('API Error:', err);
      }
      
      throw err;
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError
  };
};

// Hook for paginated API calls
export const usePaginatedApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);
      
      const result = await apiCall({ page, limit: 10 });
      
      if (result.length === 0) {
        setHasMore(false);
      } else {
        setData(prev => page === 1 ? result : [...prev, ...result]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [apiCall, page, loading, hasMore]);

  const refresh = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  };
};