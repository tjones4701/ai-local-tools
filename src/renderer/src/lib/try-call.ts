export async function tryCall(func: any, ...params) {
  if (typeof func === 'function') {
    return func(...params);
  }
}
