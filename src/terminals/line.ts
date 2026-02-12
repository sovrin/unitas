import { create } from '../core/create';
import { takeWhile } from './takeWhile';

export const line = create<string>(takeWhile((c) => c !== '\n' && c !== '\r'));
