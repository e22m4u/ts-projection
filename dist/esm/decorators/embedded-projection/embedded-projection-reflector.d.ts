import { Constructor } from '../../types.js';
import { EmbeddedProjectionMetadata } from './embedded-projection-metadata.js';
import { EmbeddedProjectionMetadataMap } from './embedded-projection-metadata.js';
/**
 * Embedded projection reflector.
 */
export declare class EmbeddedProjectionReflector {
    /**
     * Set property metadata.
     *
     * @param metadata
     * @param target
     * @param propertyKey
     */
    static setPropertyMetadata(metadata: EmbeddedProjectionMetadata, target: Constructor, propertyKey: string): void;
    /**
     * Get properties metadata.
     *
     * @param target
     */
    static getPropertiesMetadata(target: Constructor): EmbeddedProjectionMetadataMap;
}
