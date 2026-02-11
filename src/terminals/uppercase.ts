import { satisfy } from './satisfy';
import { UpperCaseLetter } from '../types';

export const uppercase = satisfy<UpperCaseLetter>((c) => /[A-Z]/.test(c));
