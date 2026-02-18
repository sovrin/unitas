import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';

export const anyChar = create<string>((input) =>
    input.length > 0 ? success(input[0], input.slice(1)) : failure(),
);
