import { create } from '../core/create';
import { success } from '../core/success';
import { failure } from '../core/failure';

export const take = (count: number) => {
    return create<string>((input) =>
        input.length >= count
            ? success(input.slice(0, count), input.slice(count))
            : failure(),
    );
};
