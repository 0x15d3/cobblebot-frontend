import process from 'process';

export * from './useScript';

export function isDev(): boolean {
  return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

export function camelToTitle(camelCase: string): string {
  // no side-effects
  return camelCase
    // inject space before the upper case letters
    .replace(/([A-Z])/g, function(match) {
       return " " + match;
    })
    // replace first char with upper case
    .replace(/^./, function(match) {
      return match.toUpperCase();
    })
    // remove heading spaces (e.g. TestCamel -> ' Test Camel')
    .trim();
}
