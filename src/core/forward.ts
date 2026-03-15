import { type Result } from '../types';

export const forward = <T>(result: Result<T>): Result<T> => result;
