/**
 * A callable type with the "new" operator
 * that allows class and constructor types.
 */
export interface Constructor<T = object> {
    new (...args: any[]): T;
}
/**
 * An object prototype that excludes
 * function and scalar values.
 */
export type Prototype<T = object> = T & object & {
    bind?: never;
} & {
    call?: never;
} & {
    prototype?: object;
};
