import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * useApi — generic hook for API calls with loading/error state
 * Usage:
 *   const { data, loading, error, execute } = useApi(api.get, '/products');
 */
export function useApi(apiFn, ...args) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (overrideArgs) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn(...(overrideArgs || args));
      setData(res.data);
      return res.data;
    } catch (err) {
      const msg = err.displayMessage || 'Request failed';
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFn]); // eslint-disable-line

  return { data, loading, error, execute };
}

export default useApi;
