import { useState, useEffect, useCallback } from 'react';

export type AsyncState<T> = {
  error: Error | null;
  loading: boolean;
  value: T | null;
  fetch: () => void;
};

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
): AsyncState<T> & { fetch: () => void } {
  const [state, setState] = useState<AsyncState<T>>({
    error: null,
    loading: true,
    value: null,
    fetch: () => {}
  });

  const execute = useCallback(() => {
    setState({ error: null, loading: true, value: null, fetch: execute });
    asyncFunction()
      .then((value) => setState({ error: null, loading: false, value, fetch: execute }))
      .catch((error) => setState({ error, loading: false, value: null, fetch: execute }));
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, fetch: execute };
}
