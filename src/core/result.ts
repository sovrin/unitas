import { type Failure } from './failure';
import { type Success } from './success';

export type Result<T> = Success<T> | Failure;
