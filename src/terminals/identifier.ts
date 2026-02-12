import { create } from '../core/create';
import { regex } from './regex';
import { success } from '../core/success';
import { failure } from '../core/failure';

export const identifier = create<string>((input) => {
    const result = regex(/^[a-zA-Z_][a-zA-Z0-9_]*/)(input);
    if (result && result[1] === '') {
        return success(result[0], result[1]);
    }

    return failure();
});
