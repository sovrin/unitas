import { many1 } from '../combinators/many1';
import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { alphaNum } from './alphaNum';

export const alphaNums = create<string>((input) => {
    const result = many1(alphaNum)(input);
    if (!result.ok) {
        return failure();
    }

    const { value, remaining } = result;

    return success(value.join(''), remaining);
});
