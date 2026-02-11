import { create } from '../core/create';
import { success } from '../core/success';
import { failure } from '../core/failure';

export function noneOf(chars: readonly string[]) {
    return create<string>((input) =>
        input.length > 0 && !chars.includes(input[0])
            ? success(input[0], input.slice(1))
            : failure(),
    );
}
