import { create } from '../core/parser';
import { success } from '../core/success';

export const takeWhile = (predicate: (char: string) => boolean) => {
    return create<string>((input) => {
        let index = 0;
        while (index < input.length && predicate(input[index])) {
            index++;
        }

        return success(input.slice(0, index), input.slice(index));
    });
};
