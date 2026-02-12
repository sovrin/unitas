import { create } from '../core/create';
import { success } from '../core/success';
import { failure } from '../core/failure';

export const anyChar = create<string>((input) =>
    input.length > 0 ? success(input[0], input.slice(1)) : failure(),
);
