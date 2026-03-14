import type { Parser } from '../types';

import { create } from '../core/create';
import { success } from '../core/success';
import { separatedBy } from './separatedBy';

/**
 * zero or more
 * consumes the separator even if there is no following match
 */
export const separatedEndBy = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input) => {
        const result = separatedBy(parser, separator)(input);

        const [values, remaining] = result!;
        const sepResult = separator(remaining);

        return success(values, sepResult ? sepResult[1] : remaining);
    });
};
