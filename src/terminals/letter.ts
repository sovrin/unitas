import { satisfy } from './satisfy';
import { Letter } from '../types';

export const letter = satisfy<Letter>((c) => /[a-zA-Z]/.test(c));
