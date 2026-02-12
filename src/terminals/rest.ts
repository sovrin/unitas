import { create } from '../core/create';
import { success } from '../core/success';

export const rest = create<string>((input) => success(input, ''));
