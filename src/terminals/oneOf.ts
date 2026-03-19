import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';

export const oneOf = <S extends string>(strings: readonly [S, ...S[]]) => {
    return create<S>((input) => {
        for (const str of strings) {
            if (input.startsWith(str)) {
                return success(str, input.slice(str.length));
            }
        }

        return failure();
    });
};
