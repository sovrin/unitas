import { choice } from '../combinators/choice';
import { create } from '../core/parser';
import { float } from './float';
import { integer } from './integer';

const parser = choice(float, integer);

/**
 * Parse an integer or float.
 *
 * @example
 * number('42') // { ok: true, value: 42, index: 2, furthest: 0, expected: ['/-?\\d+\\.\\d+/'] }
 * number('3.14') // { ok: true, value: 3.14, index: 4, furthest: -1, expected: [] }
 * number('-7') // { ok: true, value: -7, index: 2, furthest: 0, expected: ['/-?\\d+\\.\\d+/'] }
 * number('-2.5') // { ok: true, value: -2.5, index: 4, furthest: -1, expected: [] }
 */
export const number = create<number>(parser);
