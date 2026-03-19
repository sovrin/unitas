import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

export function noneOf(chars: readonly string[]) {
    return create<string>((input) =>
        input.length > 0 && !chars.includes(input[0])
            ? success(input[0], input.slice(1))
            : failure(),
    );
}
