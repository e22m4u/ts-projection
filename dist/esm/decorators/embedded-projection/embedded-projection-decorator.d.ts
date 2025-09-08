import { Prototype } from '../../types.js';
import { Constructor } from '../../types.js';
import { EmbeddedProjectionMetadata } from './embedded-projection-metadata.js';
/**
 * Embedded projection decorator.
 *
 * @param metadata
 */
export declare function embeddedProjection<T extends object>(metadata: EmbeddedProjectionMetadata): (target: Prototype<T>, propertyKey: string, descriptor?: PropertyDescriptor) => void;
/**
 * Embedded decorator.
 *
 * @param model
 */
export declare function embedded(model: () => Constructor): (target: Prototype<object>, propertyKey: string, descriptor?: PropertyDescriptor) => void;
