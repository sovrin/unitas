import { create } from '../core/parser';
import { success } from '../core/success';

export const position = create<number>((input) => success(input.length, input));
