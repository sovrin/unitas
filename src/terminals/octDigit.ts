import { satisfy } from './satisfy';

export const octDigit = satisfy<string>((c) => /[0-7]/.test(c));
