import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { when } from './when';

const boolParser = create<boolean>((input, index = 0) => {
    if (input.startsWith('*', index)) {
        return success(true, index + 1);
    }

    return success(false, index);
});

const failingCondition = create<boolean>((_input, index = 0) =>
    failure(undefined, index),
);

describe('when', () => {
    const thenP = createTestParser('yes');
    const elseP = createTestParser('no');

    it('should run thenParser when condition is true', () => {
        const parser = when(boolParser, thenP, elseP);
        const result = parser('*yes');

        assertSuccess<'yes' | 'no'>(result, 'yes', 4);
    });

    it('should run elseParser when condition is false', () => {
        const parser = when(boolParser, thenP, elseP);
        const result = parser('no');

        assertSuccess<'yes' | 'no'>(result, 'no', 2);
    });

    it('should fail when condition parser fails', () => {
        const parser = when(failingCondition, thenP, elseP);
        const result = parser('yes');

        assertFailure<'yes' | 'no'>(result);
    });
});
