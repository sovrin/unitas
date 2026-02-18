import type { LowerCaseLetter } from '../types';
import { satisfy } from './satisfy';

export const lowercase = satisfy<LowerCaseLetter>((c) => /[a-z]/.test(c));
