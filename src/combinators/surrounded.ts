import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { middle } from './middle';

export const surrounded = <T>(
    first: Parser,
    content: Parser<T>,
    second?: Parser,
) => {
    return create<T>(middle(first, content, second || first));
};
