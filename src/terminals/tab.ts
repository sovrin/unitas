import { create } from '../core/parser';
import { char } from './char';

export const tab = create<string>(char('\t'));
