import { describe, expect, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { forward } from './forward';

describe('forward', () => {
    it('should return success result unchanged', () => {
        const result = success('test', 'rest');
        const forwarded = forward<string>(result);

        assertSuccess(forwarded, 'test', 'rest');
        expect(forwarded).toBe(result);
    });

    it('should return failure result unchanged', () => {
        const result = failure('test error');
        const forwarded = forward<string>(result);

        assertFailure(result, 'test error');
        expect(forwarded).toBe(result);
    });

    it('should return failure without error unchanged', () => {
        const result = failure();
        const forwarded = forward<string>(result);

        assertFailure(result);
        expect(forwarded).toBe(result);
    });
});
