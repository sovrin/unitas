import { many1 } from '../combinators/many1';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { letter } from './letter';

export const letters = create<string>((input) => {
    const result = many1(letter)(input);
    if (!result.ok) {
        return failure();
    }

    const { value, remaining } = result;

    return success(value.join(''), remaining);
});
