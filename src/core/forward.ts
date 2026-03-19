import { type Result } from './result';

export const forward = <T>(result: Result<T>): Result<T> => result;
