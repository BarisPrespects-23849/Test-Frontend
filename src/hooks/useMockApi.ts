import { useState, useCallback } from 'react';

interface MockApiOptions<T> {
  data?: T;
  delay?: number;
  shouldFail?: boolean;
  errorMessage?: string;
}

interface MockApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface MockApiReturnType<T, P> {
  state: MockApiState<T>;
  execute: (params?: P) => Promise<T>;
  setData: (data: T) => void;
  reset: () => void;
}

/**
 * A hook for simulating API calls in development
 */
export function useMockApi<T, P = void>({ 
  data = null as unknown as T, 
  delay = 500, 
  shouldFail = false,
  errorMessage = 'An error occurred'
}: MockApiOptions<T>): MockApiReturnType<T, P> {
  const [state, setState] = useState<MockApiState<T>>({
    data: data,
    loading: false,
    error: null
  });

  const execute = useCallback(
    async (params?: P): Promise<T> => {
      setState(prevState => ({ ...prevState, loading: true, error: null }));
      
      return new Promise<T>((resolve, reject) => {
        setTimeout(() => {
          if (shouldFail) {
            setState(prevState => ({ 
              ...prevState, 
              loading: false, 
              error: errorMessage 
            }));
            reject(new Error(errorMessage));
          } else {
            // If data is a function, call it with params
            const result = typeof data === 'function' ? data(params) : data;
            setState(prevState => ({ 
              ...prevState, 
              loading: false, 
              data: result 
            }));
            resolve(result);
          }
        }, delay);
      });
    },
    [data, delay, shouldFail, errorMessage]
  );

  const setData = useCallback((newData: T) => {
    setState(prevState => ({ ...prevState, data: newData }));
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null as unknown as T,
      loading: false,
      error: null
    });
  }, []);

  return { state, execute, setData, reset };
}
