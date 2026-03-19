import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { map } from './map';

export const consume = <T>(parser: Parser<T>) => {
    return create<null>(map(parser, () => null));
};
