import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

export const take = (count: number) => {
    return create<string>((input) =>
        input.length >= count
            ? success(input.slice(0, count), input.slice(count))
            : failure(),
    );
};
