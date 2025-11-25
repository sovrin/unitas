import { failure, success } from './results';
import { create } from './combinators';

export const satisfy = (predicate: (char: string) => boolean) => {
    return create<string>((input) =>
        input.length > 0 && predicate(input[0])
            ? success(input[0], input.slice(1))
            : failure(),
    );
};
