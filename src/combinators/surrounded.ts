import type { Parser } from '../types';

import { create } from '../core/create';
import { middle } from './middle';

export const surrounded = <T>(
    first: Parser,
    content: Parser<T>,
    second?: Parser,
) => {
    return create<T>(middle(first, content, second || first));
};
