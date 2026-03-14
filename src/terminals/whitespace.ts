import { satisfy } from './satisfy';

export const whitespace = satisfy<string>((c) => /\s/.test(c));
