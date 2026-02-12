import { satisfy } from './satisfy';

export const nl = satisfy<'\n'>((c) => /\n/.test(c));
