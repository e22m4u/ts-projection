import {Constructor} from '../../types.js';
import {MetadataKey} from '@e22m4u/ts-reflector';

/**
 * Embedded projection metadata.
 */
export type EmbeddedProjectionMetadata = {
  model: () => Constructor;
};

/**
 * Embedded projection metadata map.
 */
export type EmbeddedProjectionMetadataMap = Map<
  string,
  EmbeddedProjectionMetadata
>;

/**
 * Embedded projection property metadata key.
 */
export const EMBEDDED_PROJECTION_PROPERTY_METADATA_KEY =
  new MetadataKey<EmbeddedProjectionMetadataMap>(
    'embeddedProjectionPropertyMetadataKey',
  );
