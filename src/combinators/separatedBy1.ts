import { failure } from '../core/failure';
import { create, type Parser } from '../core/parser';
import { type Success, success } from '../core/success';
import { separatedBy } from './separatedBy';

/**
 * one or more
 */
export const separatedBy1 = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input) => {
        const result = separatedBy(parser, separator)(input);

        const { value: values, remaining } = result as Success<T[]>;
        if (values.length === 0) return failure();

        return success(values, remaining);
    });
};
