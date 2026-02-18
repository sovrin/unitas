import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';

export const literal = <S extends string>(str: S) => {
    return create<S>((input) =>
        input.startsWith(str)
            ? success(str, input.slice(str.length))
            : failure(),
    );
};
