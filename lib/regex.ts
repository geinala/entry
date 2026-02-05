export const regexTest = (pattern: string, value: string): boolean => {
  const regex = new RegExp(pattern);
  return regex.test(value);
};
