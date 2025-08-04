import { Prototype } from '../../types.js';
import { Constructor } from '../../types.js';
/**
 * Is embedded decorator.
 *
 * @param model
 */
export declare function isEmbedded(model: () => Constructor): (target: Prototype<object>, propertyKey: string, descriptor?: PropertyDescriptor) => void;
