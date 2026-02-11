import { describe, it } from 'vitest';
import { assertResult, createTestParser } from '../../test/utils.test';
import { create } from '../core/create';
import { success } from '../core/success';
import { failure } from '../core/failure';
import { leftAssoc } from './leftAssoc';

describe('leftAssoc', () => {
    it('should parse left-associative sums without other combinators', () => {
        const parser1 = createTestParser(1);
        const operator = create((input) => {
            if (input.startsWith('+')) {
                return success(
                    (left: number, right: number) => left + right,
                    input.slice(1),
                );
            }
            return failure();
        });

        const parser = leftAssoc(parser1, operator);
        const result = parser('1+1+1');

        assertResult<number>(result, [3, '']); // ((1+1)+1)
    });

    // it('should handle single operand', () => {
    //     const parser1 = createTestParser(1);
    //     const operator = create((input) => {
    //         if (input.startsWith('+')) {
    //             return success(
    //                 (left: number, right: number) => left + right,
    //                 input.slice(1),
    //             );
    //         }
    //         return failure();
    //     });
    //     const parser = leftAssoc(parser1, operator);
    //     const result = parser('42+1');
    //     assertResult<number>(result, [42, '']);
    // });
    //
    // it('should parse left-associative operations', () => {
    //     const parser = leftAssoc(numberParser, addOp);
    //     expect(parser('1+2+3')).toEqual([6, '']); // ((1+2)+3)
    // });
    //
    // it('should handle mixed operations with same precedence', () => {
    //     const parser = leftAssoc(numberParser, addSubOp);
    //     expect(parser('10-3+2')).toEqual([9, '']); // ((10-3)+2)
    // });
    //
    // it('should stop when operator is not found', () => {
    //     const parser = leftAssoc(numberParser, addOp);
    //     expect(parser('1+2*3')).toEqual([3, '*3']); // 1+2, then stops
    // });
    //
    // it('should handle multiplication and division', () => {
    //     const parser = leftAssoc(numberParser, mulDivOp);
    //     expect(parser('8/2*3')).toEqual([12, '']); // ((8/2)*3)
    //     expect(parser('24/3/2')).toEqual([4, '']); // ((24/3)/2)
    // });
    //
    // it('should fail when first operand fails', () => {
    //     const parser = leftAssoc(numberParser, addOp);
    //     expect(parser('abc')).toBeNull();
    // });
    //
    // it('should handle trailing operators gracefully', () => {
    //     const parser = leftAssoc(numberParser, addOp);
    //     expect(parser('1+2+')).toEqual([3, '+']); // Stops at incomplete operation
    // });
});
