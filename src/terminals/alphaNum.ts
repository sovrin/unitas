import { satisfy } from './satisfy';

export const alphaNum = satisfy<string>((c) => /[a-zA-Z0-9]/.test(c));
