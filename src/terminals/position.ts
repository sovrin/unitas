import { success } from '../core/success';
import { create } from '../core/create';

export const position = create<number>((input) => success(input.length, input));
