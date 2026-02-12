import { choice } from '../combinators/choice';
import { create } from '../core/create';
import { map } from '../combinators/map';
import { eof } from './eof';
import { nl } from './nl';
import { crlf } from './crlf';

export const eol = create<string>(
    choice(
        nl,
        crlf,
        map(eof, () => ''),
    ),
);
