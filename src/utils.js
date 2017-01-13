export function strip(string) {
  return string.replace(/\r?\n|\r/, '').trim();
}

export function has(object, property) {
  return {}.hasOwnProperty.call(object, property);
}
