import { create } from '../core/create';
import { success } from '../core/success';

export const position = create<number>((input) => success(input.length, input));
