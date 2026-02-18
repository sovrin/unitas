import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import type { Char } from '../types';

export function satisfy<T extends string>(predicate: (c: Char<T>) => boolean) {
    return create<T>((input) => {
        const c = input[0] as Char<T>;
        return input.length > 0 && predicate(c)
            ? success(c as T, input.slice(1))
            : failure();
    });
}
