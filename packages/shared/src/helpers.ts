export type SetRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type SetPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Override<T, R extends { [P in keyof T]?: unknown }> = Omit<T, keyof R> & R;
