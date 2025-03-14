/**
 * Simulates a network delay for mock API calls
 */
export const mockDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generates a random value between min and max (inclusive)
 */
export const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Simulates a network request with configurable success/failure
 */
export const mockFetch = async <T>(
  data: T,
  { delay = 500, shouldFail = false, errorMessage = 'Network error' } = {}
): Promise<T> => {
  await mockDelay(delay);
  
  if (shouldFail) {
    throw new Error(errorMessage);
  }
  
  return data;
};

/**
 * Randomly succeeds or fails a promise based on successRate (0-1)
 */
export const withRandomSuccess = async <T>(
  promise: Promise<T>,
  successRate: number = 0.9
): Promise<T> => {
  const willSucceed = Math.random() < successRate;
  
  if (!willSucceed) {
    throw new Error('Random failure occurred');
  }
  
  return promise;
};
