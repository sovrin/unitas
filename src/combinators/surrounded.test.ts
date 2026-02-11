import { describe, it } from 'vitest';
import { assertResult, createTestParser } from '../../test/utils.test';
import { surrounded } from './surrounded';

describe('surrounded', () => {
    it('should parse content surrounded by same delimiter', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');

        const parser = surrounded(parser1, parser2);
        const result = parser('ABA');

        assertResult<'B'>(result, ['B', '']);
    });

    it('should fail if opening delimiter fails', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');

        const parser = surrounded(parser1, parser2);
        const result = parser('CBA');

        assertResult<'B'>(result);
    });

    it('should fail if content fails', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');

        const parser = surrounded(parser1, parser2);
        const result = parser('ACA');

        assertResult<'B'>(result);
    });

    it('should fail if closing delimiter fails', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');

        const parser = surrounded(parser1, parser2);
        const result = parser('ABC');

        assertResult<'B'>(result);
    });

    it('should support a second delimiter', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');
        const parser3 = createTestParser('C');

        const parser = surrounded(parser1, parser2, parser3);
        const result = parser('ABCAA');

        assertResult<'B'>(result, ['B', 'AA']);
    });

    it('should leave remaining input', () => {
        const parser1 = createTestParser('A');
        const parser2 = createTestParser('B');

        const parser = surrounded(parser1, parser2);
        const result = parser('ABAAA');

        assertResult<'B'>(result, ['B', 'AA']);
    });
});
