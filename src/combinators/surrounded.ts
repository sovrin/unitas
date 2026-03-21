import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { inner } from './inner';

export const surrounded = <T>(
    first: Parser,
    content: Parser<T>,
    second?: Parser,
) => {
    return create<T>(inner(first, content, second || first));
};
