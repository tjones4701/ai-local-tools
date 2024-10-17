function debounce<T extends (...args: any[]) => Promise<any> | any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null;

  return function (...args: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(async () => {
      await func(...args);
    }, wait);
  };
}

export default debounce;
