import { Parser } from '../types';

export const create = <T>(parserFn: Parser<T>): Parser<T> => {
    return (input) => {
        return parserFn(input);
    };
};
