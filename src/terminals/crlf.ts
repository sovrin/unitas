import { create } from '../core/create';
import { literal } from './literal';

export const crlf = create<string>(literal('\r\n'));
