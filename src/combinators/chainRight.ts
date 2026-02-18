import { create } from '../core/create';
import { success } from '../core/success';
import type { Parser } from '../types';
import { chainRight1 } from './chainRight1';

/**
 * zero or more
 */
export const chainRight = <T>(
    parser: Parser<T>,
    operator: Parser<(a: T, b: T) => T>,
    defaultValue: T,
) => {
    return create<T>((input) => {
        const result = chainRight1(parser, operator)(input);

        return result ? success(...result) : success(defaultValue, input);
    });
};
