import { choice } from '../combinators/choice';
import { map } from '../combinators/map';
import { create } from '../core/parser';
import { crlf } from './crlf';
import { eof } from './eof';
import { nl } from './nl';

export const eol = create<string>(
    choice(
        nl,
        crlf,
        map(eof, () => ''),
    ),
);
