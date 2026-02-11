import { describe, it } from 'vitest';
import { noneOf } from './noneOf';
import { assertResult } from '../../test/utils.test';

describe('noneOf', () => {
    it('should match character not in forbidden set', () => {
        const parser = noneOf(['X', 'Y', 'Z']);
        const result = parser('ABC');

        assertResult<string>(result, ['A', 'BC']);
    });

    it('should fail when character is in forbidden set', () => {
        const parser = noneOf(['X', 'Y', 'Z']);
        const result = parser('XYZ');

        assertResult<string>(result);
    });

    it('should match any character when set is empty', () => {
        const parser = noneOf([]);
        const result = parser('ABC');

        assertResult<string>(result, ['A', 'BC']);
    });
});
