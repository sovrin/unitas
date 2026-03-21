import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

export const eof = create<null>((input) => {
    return input.length === 0 ? success(null, input) : failure();
});
