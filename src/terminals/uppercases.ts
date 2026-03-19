import { many1 } from '../combinators/many1';
import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { uppercase } from './uppercase';

export const uppercases = create<string>((input) => {
    const result = many1(uppercase)(input);
    if (!result.ok) {
        return failure();
    }

    const { value, remaining } = result;

    return success(value.join(''), remaining);
});
