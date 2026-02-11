import { satisfy } from './satisfy';
import { LowerCaseLetter } from '../types';

export const lowercase = satisfy<LowerCaseLetter>((c) => /[a-z]/.test(c));
