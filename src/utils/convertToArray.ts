function isPOJO(arg: any): boolean {
  if (arg == null || typeof arg !== 'object') return false;
  const proto = Object.getPrototypeOf(arg);
  if (proto == null) return true;
  return proto === Object.prototype;
}

export default function convertToArray(object: Record<string, any>) {
  function inner(object: Record<string, any>) {
    const entries = Object.entries(object);
    entries.forEach(([key, value]) => {
      if (isPOJO(value)) object[key] = inner(value);
    })
    const array_like = entries.every(([key], i) => parseInt(key) === i);
    if (array_like)
      return Array.from({ ...object, length: entries.length })
    else return object
  }

  inner(object);
  return object;
}