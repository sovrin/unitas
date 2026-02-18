import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';

export const eof = create<null>((input) =>
    input.length === 0 ? success(null, input) : failure(),
);
