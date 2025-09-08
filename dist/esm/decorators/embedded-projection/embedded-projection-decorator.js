import { DecoratorTargetType } from '@e22m4u/ts-reflector';
import { getDecoratorTargetType } from '@e22m4u/ts-reflector';
import { EmbeddedProjectionReflector } from './embedded-projection-reflector.js';
/**
 * Embedded projection decorator.
 *
 * @param metadata
 */
export function embeddedProjection(metadata) {
    return function (target, propertyKey, descriptor) {
        const decoratorType = getDecoratorTargetType(target, propertyKey, descriptor);
        if (decoratorType !== DecoratorTargetType.INSTANCE_PROPERTY)
            throw new Error('Embedded projection decorator is only supported ' +
                'for an instance property.');
        EmbeddedProjectionReflector.setPropertyMetadata(metadata, target.constructor, propertyKey);
    };
}
/**
 * Embedded decorator.
 *
 * @param model
 */
export function embedded(model) {
    return embeddedProjection({ model });
}
