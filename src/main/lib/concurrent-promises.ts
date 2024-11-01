export function concurrentPromises<T>(
  promises: (() => Promise<T>)[],
  amount: number
): Promise<{ successful: unknown[]; errors: unknown[] }> {
  return new Promise<{ successful: T[]; errors: Error[] }>((resolve) => {
    const promiseQueue = promises;
    const results: any = { successful: [], errors: [] };
    let running = 0;
    let index = 0;

    function runNext() {
      if (index >= promiseQueue.length && running === 0) {
        resolve(results);
        return;
      }

      while (running < amount && index < promiseQueue.length) {
        const currentIndex = index++;
        running++;
        promiseQueue[currentIndex]()
          .then((result: T) => {
            results.successful.push(result);
          })
          .catch((error: Error) => {
            results.errors.push(error);
          })
          .finally(() => {
            running--;
            runNext();
          });
      }
    }

    runNext();
  });
}
