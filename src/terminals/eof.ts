import { create } from '../core/create';
import { success } from '../core/success';
import { failure } from '../core/failure';

export const eof = create<null>((input) =>
    input.length === 0 ? success(null, input) : failure(),
);
