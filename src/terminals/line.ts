import { create } from '../core/parser';
import { takeWhile } from './takeWhile';

export const line = create<string>(takeWhile((c) => c !== '\n' && c !== '\r'));
