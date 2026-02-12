import { create } from '../core/create';
import { Parser } from '../types';
import { success } from '../core/success';
import { chainLeft1 } from './chainLeft1';


/**
 * zero or more
 */
export const chainLeft = <T>(
    parser: Parser<T>,
    operator: Parser<(a: T, b: T) => T>,
    defaultValue: T,
) => {
    return create<T>((input) => {
        const result = chainLeft1(parser, operator)(input);

        return result ? success(...result) : success(defaultValue, input);
    });
};
