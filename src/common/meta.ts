export interface OptionId {
    id?: string
}

export type DeepRequired<T> = {
    [P in keyof T]-?: T[P] extends object
        ? T[P] extends infer U ? DeepRequired<U> : T[P]
        : T[P];
};
