export function titleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (match) => match.charAt(0).toUpperCase() + match.substring(1).toLowerCase()
  );
}

export function camelToTitleCase(str: string): string {
  const result = str.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}
