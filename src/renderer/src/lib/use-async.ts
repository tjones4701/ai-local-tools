import { useState, useEffect, useCallback } from 'react';

interface AsyncState<T> {
  error: Error | null;
  loading: boolean;
  value: T | null;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    error: null,
    loading: true,
    value: null
  });

  const execute = useCallback(() => {
    setState({ error: null, loading: true, value: null });
    asyncFunction()
      .then((value) => setState({ error: null, loading: false, value }))
      .catch((error) => setState({ error, loading: false, value: null }));
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return state;
}
