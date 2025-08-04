import { Prototype } from '../../types.js';
import { Constructor } from '../../types.js';
/**
 * No input decorator.
 */
export declare function noInput(): (target: Constructor<object> | Prototype<object>, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
/**
 * Allow input decorator.
 */
export declare function allowInput(): (target: Constructor<object> | Prototype<object>, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
/**
 * No output decorator.
 */
export declare function noOutput(): (target: Constructor<object> | Prototype<object>, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
/**
 * Allow output decorator.
 */
export declare function allowOutput(): (target: Constructor<object> | Prototype<object>, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
/**
 * Hidden decorator (noOutput).
 */
export declare const hidden: typeof noOutput;
/**
 * Visible decorator (allowOutput).
 */
export declare const visible: typeof allowOutput;
