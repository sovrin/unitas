import { failure } from '../core/failure';
import { forward } from '../core/forward';
import { create } from '../core/parser';
import { regex } from './regex';

export const identifier = create<string>((input) => {
    const result = regex(/^[a-zA-Z_][a-zA-Z0-9_]*/)(input);
    if (result.ok && result.remaining === '') {
        return forward(result);
    }

    return failure();
});
