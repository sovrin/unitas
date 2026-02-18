import type { UpperCaseLetter } from '../types';
import { satisfy } from './satisfy';

export const uppercase = satisfy<UpperCaseLetter>((c) => /[A-Z]/.test(c));
