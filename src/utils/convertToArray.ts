function isPOJO(arg: any): boolean {
  if (arg == null || typeof arg !== 'object') return false;
  const proto = Object.getPrototypeOf(arg);
  if (proto == null) return true;
  return proto === Object.prototype;
}

export default function convertToArray(object: Record<string, any>) {
  const res = JSON.parse(JSON.stringify(object));
  function inner(_object: Record<string, any>) {
    const entries = Object.entries(_object);
    entries.forEach(([key, value]) => {
      if (isPOJO(value)) _object[key] = inner(value);
    });
    const array_like = entries.every(([key], i) => parseInt(key) === i);
    if (array_like) return Array.from({ ..._object, length: entries.length });
    else return _object;
  }

  inner(res);
  return res;
}
