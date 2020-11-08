export type PickRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Override<T, R extends { [P in keyof T]?: unknown }> = Omit<T, keyof R> & R;
