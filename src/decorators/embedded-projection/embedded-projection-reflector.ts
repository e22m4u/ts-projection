import {Constructor} from '../../types.js';
import {Reflector} from '@e22m4u/ts-reflector';
import {EmbeddedProjectionMetadata} from './embedded-projection-metadata.js';
import {EmbeddedProjectionMetadataMap} from './embedded-projection-metadata.js';
import {EMBEDDED_PROJECTION_PROPERTY_METADATA_KEY} from './embedded-projection-metadata.js';

/**
 * Embedded projection reflector.
 */
export class EmbeddedProjectionReflector {
  /**
   * Set property metadata.
   *
   * @param metadata
   * @param target
   * @param propertyKey
   */
  static setPropertyMetadata(
    metadata: EmbeddedProjectionMetadata,
    target: Constructor,
    propertyKey: string,
  ) {
    const oldMap = Reflector.getMetadata(
      EMBEDDED_PROJECTION_PROPERTY_METADATA_KEY,
      target,
    );
    const newMap = new Map(oldMap);
    newMap.set(propertyKey, metadata);
    Reflector.defineMetadata(
      EMBEDDED_PROJECTION_PROPERTY_METADATA_KEY,
      newMap,
      target,
    );
  }

  /**
   * Get properties metadata.
   *
   * @param target
   */
  static getPropertiesMetadata(
    target: Constructor,
  ): EmbeddedProjectionMetadataMap {
    const metadata = Reflector.getMetadata(
      EMBEDDED_PROJECTION_PROPERTY_METADATA_KEY,
      target,
    );
    return metadata ?? new Map();
  }
}
