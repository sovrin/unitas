import { many1 } from '../combinators/many1';
import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { octDigit } from './octDigit';

export const octDigits = create<string>((input) => {
    const result = many1(octDigit)(input);
    if (!result.ok) {
        return failure();
    }

    const { value, remaining } = result;

    return success(value.join(''), remaining);
});
