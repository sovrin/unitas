import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { regex } from './regex';

export const identifier = create<string>((input) => {
    const result = regex(/^[a-zA-Z_][a-zA-Z0-9_]*/)(input);
    if (result && result[1] === '') {
        return success(result[0], result[1]);
    }

    return failure();
});
