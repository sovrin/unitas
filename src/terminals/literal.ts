import { success } from '../core/success';
import { failure } from '../core/failure';
import { create } from '../core/create';

export const literal = <S extends string>(str: S) => {
    return create<S>((input) =>
        input.startsWith(str)
            ? success(str, input.slice(str.length))
            : failure(),
    );
};
