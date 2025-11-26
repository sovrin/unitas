import { failure, success } from './results';
import { create } from './combinators';

export const satisfy = (predicate: (char: string) => boolean) => {
    return create<string>((input) =>
        input.length > 0 && predicate(input[0])
            ? success(input[0], input.slice(1))
            : failure(),
    );
};

export const digit = create<number>(
    map(
        satisfy((c) => /[0-9]/.test(c)),
        (c) => parseInt(c, 10),
    ),
);

export const digits = create<number>((input) => {
    const result = many1(digit)(input);
    if (!result) {
        return failure();
    }

    const [ds, rest] = result;
    const value = ds.reduce((acc, d) => acc * 10 + d, 0);

    return success(value, rest);
});
