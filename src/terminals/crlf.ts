import { create } from '../core/parser';
import { literal } from './literal';

export const crlf = create<string>(literal('\r\n'));
