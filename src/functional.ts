import { Parser } from './types';
import { map } from './combinators';
import { create, failure, success } from './core';
import { many } from './repetition';

export const first = <T>(parser: Parser<T[]>) => create<T | undefined>(map(parser, (arr) => arr[0]));

export const last = <T>(parser: Parser<T[]>) => create<T | undefined>(map(parser, (arr) => arr[arr.length - 1]));

export const nth = <T>(parser: Parser<T[]>, index: number) => create<T | undefined>(map(parser, (arr) => arr[index]));

export const reduce = <T, U>(parser: Parser<T>, initial: U, folder: (acc: U, item: T) => U): Parser<U> =>
    create<U>((input) => {
        const result = many(parser)(input);
        if (!result) return failure();

        const [items, rest] = result;

        return success(items.reduce(folder, initial), rest);
    });

export const reduceRight = <T, U>(parser: Parser<T>, initial: U, folder: (item: T, acc: U) => U): Parser<U> =>
    create<U>((input) => {
        const result = many(parser)(input);
        if (!result) return failure();

        const [items, rest] = result;
        const folded = items.reduceRight((acc, item) => folder(item, acc), initial);

        return success(folded, rest);
    });
