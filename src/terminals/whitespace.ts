import { satisfy } from './satisfy';

export const whitespace = satisfy<' '>((c) => /\s/.test(c));
