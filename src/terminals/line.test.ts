import { describe, it } from 'vitest';
import { line } from './line';
import { assertResult } from '../../test/utils.test';

describe('line', () => {
    it('should parse until newline', () => {
        const result = line('hello\nworld');

        assertResult<string>(result, ['hello', '\nworld']);
    });

    it('should parse until carriage return', () => {
        const result = line('hello\rworld');

        assertResult<string>(result, ['hello', '\rworld']);
    });

    it('should stop before CRLF', () => {
        const result = line('hello\r\nworld');

        assertResult<string>(result, ['hello', '\r\nworld']);
    });

    it('should allow empty line', () => {
        {
            const result = line('\nrest');

            assertResult<string>(result, ['', '\nrest']);
        }
        {
            const result = line('\rrest');

            assertResult<string>(result, ['', '\rrest']);
        }
    });

    it('should consume entire input when no line breaks', () => {
        const result = line('justtext');

        assertResult<string>(result, ['justtext', '']);
    });
});
