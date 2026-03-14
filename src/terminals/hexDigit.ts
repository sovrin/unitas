import { satisfy } from './satisfy';

export const hexDigit = satisfy<string>((c) => /[0-9a-fA-F]/.test(c));
