import {Prototype} from '../../types.js';
import {Constructor} from '../../types.js';
import {DecoratorTargetType} from '@e22m4u/ts-reflector';
import {getDecoratorTargetType} from '@e22m4u/ts-reflector';
import {EmbeddedProjectionMetadata} from './embedded-projection-metadata.js';
import {EmbeddedProjectionReflector} from './embedded-projection-reflector.js';

/**
 * Embedded projection decorator.
 *
 * @param metadata
 */
function embeddedProjection<T extends object>(
  metadata: EmbeddedProjectionMetadata,
) {
  return function (
    target: Prototype<T>,
    propertyKey: string,
    descriptor?: PropertyDescriptor,
  ) {
    const decoratorType = getDecoratorTargetType(
      target,
      propertyKey,
      descriptor,
    );
    if (decoratorType !== DecoratorTargetType.INSTANCE_PROPERTY)
      throw new Error(
        'Embedded projection decorator is only supported ' +
          'for an instance property.',
      );
    EmbeddedProjectionReflector.setPropertyMetadata(
      metadata,
      target.constructor as Constructor<T>,
      propertyKey,
    );
  };
}

/**
 * Is embedded decorator.
 *
 * @param model
 */
export function isEmbedded(model: () => Constructor) {
  return embeddedProjection({model});
}
