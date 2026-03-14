import type { Parser } from '../types';

import { create } from '../core/create';
import { map } from './map';

export const consume = <T>(parser: Parser<T>) => {
    return create<null>(map(parser, () => null));
};
