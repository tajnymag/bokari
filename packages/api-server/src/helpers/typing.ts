import { FindConditions } from 'typeorm';

export type TypeormQuery<T> = FindConditions<T>;
