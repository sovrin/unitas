import { describe, expect, it } from 'vitest';
import { add, divide, identity, multiply, negate, pow, subtract } from '../src';

describe('numbers', () => {
    describe('arithmetic operation factories', () => {
        describe('identity', () => {
            it('should return identity function', () => {
                expect(identity(5)).toBe(5);
                expect(identity(-10)).toBe(-10);
                expect(identity(0)).toBe(0);
                expect(identity(3.14)).toBe(3.14);
            });

            it('should convert to number', () => {
                expect(identity('123' as any)).toBe(123);
                expect(identity(true as any)).toBe(1);
                expect(identity(false as any)).toBe(0);
            });

            it('should handle edge cases', () => {
                expect(identity(Infinity)).toBe(Infinity);
                expect(identity(-Infinity)).toBe(-Infinity);
                expect(isNaN(identity(NaN))).toBe(true);
            });
        });

        describe('negate', () => {
            it('should return negation function', () => {
                expect(negate(5)).toBe(-5);
                expect(negate(-10)).toBe(10);
                expect(negate(0)).toBe(-0);
                expect(negate(3.14)).toBe(-3.14);
            });

            it('should handle edge cases', () => {
                expect(negate(Infinity)).toBe(-Infinity);
                expect(negate(-Infinity)).toBe(Infinity);
                expect(isNaN(negate(NaN))).toBe(true);
            });

            it('should work with decimals', () => {
                expect(negate(0.5)).toBe(-0.5);
                expect(negate(-0.25)).toBe(0.25);
            });
        });

        describe('multiply', () => {
            it('should return multiplication function', () => {
                expect(multiply(3, 4)).toBe(12);
                expect(multiply(-2, 5)).toBe(-10);
                expect(multiply(-3, -4)).toBe(12);
                expect(multiply(0, 100)).toBe(0);
            });

            it('should handle decimals', () => {
                expect(multiply(2.5, 4)).toBe(10);
                expect(multiply(1.5, 2.5)).toBe(3.75);
                expect(multiply(-0.5, 6)).toBe(-3);
            });

            it('should handle edge cases', () => {
                expect(multiply(Infinity, 2)).toBe(Infinity);
                expect(multiply(-Infinity, 2)).toBe(-Infinity);
                expect(multiply(Infinity, -2)).toBe(-Infinity);
                expect(isNaN(multiply(NaN, 5))).toBe(true);
                expect(isNaN(multiply(Infinity, 0))).toBe(true);
            });
        });

        describe('divide', () => {
            it('should return division function', () => {
                expect(divide(12, 3)).toBe(4);
                expect(divide(15, 4)).toBe(3.75);
                expect(divide(-10, 2)).toBe(-5);
                expect(divide(-12, -3)).toBe(4);
            });

            it('should handle division by zero', () => {
                expect(divide(5, 0)).toBe(Infinity);
                expect(divide(-5, 0)).toBe(-Infinity);
                expect(isNaN(divide(0, 0))).toBe(true);
            });

            it('should handle decimals', () => {
                expect(divide(7.5, 2.5)).toBe(3);
                expect(divide(1, 3)).toBeCloseTo(0.3333333333333333);
                expect(divide(10, 0.5)).toBe(20);
            });

            it('should handle edge cases', () => {
                expect(divide(Infinity, 2)).toBe(Infinity);
                expect(divide(Infinity, -2)).toBe(-Infinity);
                expect(isNaN(divide(Infinity, Infinity))).toBe(true);
                expect(isNaN(divide(NaN, 5))).toBe(true);
            });
        });

        describe('add', () => {
            it('should return addition function', () => {
                expect(add(3, 4)).toBe(7);
                expect(add(-2, 5)).toBe(3);
                expect(add(-3, -4)).toBe(-7);
                expect(add(0, 100)).toBe(100);
            });

            it('should handle decimals', () => {
                expect(add(2.5, 1.5)).toBe(4);
                expect(add(0.1, 0.2)).toBeCloseTo(0.3);
                expect(add(-1.5, 2.5)).toBe(1);
            });

            it('should handle edge cases', () => {
                expect(add(Infinity, 5)).toBe(Infinity);
                expect(add(-Infinity, 5)).toBe(-Infinity);
                expect(isNaN(add(Infinity, -Infinity))).toBe(true);
                expect(isNaN(add(NaN, 5))).toBe(true);
            });
        });

        describe('subtract', () => {
            it('should return subtraction function', () => {
                expect(subtract(7, 3)).toBe(4);
                expect(subtract(5, 8)).toBe(-3);
                expect(subtract(-2, 3)).toBe(-5);
                expect(subtract(-5, -2)).toBe(-3);
            });

            it('should handle decimals', () => {
                expect(subtract(5.5, 2.5)).toBe(3);
                expect(subtract(1.1, 0.1)).toBeCloseTo(1);
                expect(subtract(-2.5, 1.5)).toBe(-4);
            });

            it('should handle edge cases', () => {
                expect(subtract(Infinity, 5)).toBe(Infinity);
                expect(subtract(-Infinity, 5)).toBe(-Infinity);
                expect(subtract(5, Infinity)).toBe(-Infinity);
                expect(isNaN(subtract(Infinity, Infinity))).toBe(true);
                expect(isNaN(subtract(NaN, 5))).toBe(true);
            });
        });

        describe('pow', () => {
            it('should return exponentiation function', () => {
                expect(pow(2, 3)).toBe(8);
                expect(pow(5, 2)).toBe(25);
                expect(pow(3, 0)).toBe(1);
                expect(pow(0, 5)).toBe(0);
            });

            it('should handle negative exponents', () => {
                expect(pow(2, -1)).toBe(0.5);
                expect(pow(4, -2)).toBe(0.0625);
                expect(pow(10, -3)).toBe(0.001);
            });

            it('should handle fractional exponents', () => {
                expect(pow(4, 0.5)).toBe(2);
                expect(pow(8, 1 / 3)).toBeCloseTo(2);
                expect(pow(16, 0.25)).toBe(2);
            });

            it('should handle negative bases', () => {
                expect(pow(-2, 3)).toBe(-8);
                expect(pow(-2, 4)).toBe(16);
                expect(pow(-3, 2)).toBe(9);
            });

            it('should handle edge cases', () => {
                expect(pow(1, Infinity)).toBeNaN();
                expect(pow(0, 0)).toBe(1); // JavaScript behavior
                expect(pow(Infinity, 2)).toBe(Infinity);
                expect(pow(2, Infinity)).toBe(Infinity);
                expect(isNaN(pow(NaN, 2))).toBe(true);
                expect(isNaN(pow(2, NaN))).toBe(true);
            });
        });
    });

    describe('integration tests', () => {
        it('should work with all operation types', () => {
            const ops = {
                add,
                subtract,
                multiply,
                divide,
                pow,
                negate,
                identity,
            };

            // Test a small expression: (-5 + 3) * 2^3 / 4 = (-2) * 8 / 4 = -4
            const step1 = ops.negate(5); // -5
            const step2 = ops.add(step1, 3); // -2
            const step3 = ops.pow(2, 3); // 8
            const step4 = ops.multiply(step2, step3); // -16
            const step5 = ops.divide(step4, 4); // -4

            expect(step5).toBe(-4);
        });
    });
});
