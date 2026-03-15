import { many1 } from '../combinators/many1';
import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { digit } from './digit';

export const digits = create<number>((input) => {
    const result = many1(digit)(input);
    if (!result.ok) {
        return failure();
    }

    const { value: list, remaining: rest } = result;
    const value = list.reduce((acc, d) => acc * 10 + d, 0);

    return success(value, rest);
});
