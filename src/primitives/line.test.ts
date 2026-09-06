import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils';
import { line } from './line';

describe('line', () => {
    it('should parse until newline', () => {
        const result = line('hello\nworld');

        assertSuccess<string>(result, 'hello', 5);
    });

    it('should parse until carriage return', () => {
        const result = line('hello\rworld');

        assertSuccess<string>(result, 'hello', 5);
    });

    it('should stop before CRLF', () => {
        const result = line('hello\r\nworld');

        assertSuccess<string>(result, 'hello', 5);
    });

    it('should allow empty line', () => {
        {
            const result = line('\nrest');

            assertSuccess<string>(result, '', 0);
        }
        {
            const result = line('\rrest');

            assertSuccess<string>(result, '', 0);
        }
    });

    it('should consume entire input when no line breaks', () => {
        const result = line('justtext');

        assertSuccess<string>(result, 'justtext', 8);
    });
});
