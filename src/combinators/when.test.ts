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

const boolParser = create<boolean>((input) => {
    if (input.startsWith('*')) {
        return success(true, input.slice(1));
    }

    return success(false, input);
});

const failingCondition = create<boolean>(() => failure());

describe('when', () => {
    const thenP = createTestParser('yes');
    const elseP = createTestParser('no');

    it('should run thenParser when condition is true', () => {
        const parser = when(boolParser, thenP, elseP);
        const result = parser('*yes');

        assertSuccess<'yes' | 'no'>(result, 'yes', '');
    });

    it('should run elseParser when condition is false', () => {
        const parser = when(boolParser, thenP, elseP);
        const result = parser('no');

        assertSuccess<'yes' | 'no'>(result, 'no', '');
    });

    it('should fail when condition parser fails', () => {
        const parser = when(failingCondition, thenP, elseP);
        const result = parser('yes');

        assertFailure<'yes' | 'no'>(result);
    });
});
