import { create } from '../core/parser';
import { success } from '../core/success';

export const rest = create<string>((input) => success(input, ''));
