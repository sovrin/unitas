import type { Letter } from '../types';

import { satisfy } from './satisfy';

export const letter = satisfy<Letter>((c) => /[a-zA-Z]/.test(c));
