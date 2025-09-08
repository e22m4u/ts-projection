import {Prototype} from '../../types.js';
import {Constructor} from '../../types.js';
import {ProjectionRule} from '../../projection.js';
import {ProjectionScope} from '../../projection.js';
import {DecoratorTargetType} from '@e22m4u/ts-reflector';
import {getDecoratorTargetType} from '@e22m4u/ts-reflector';
import {ProjectionRuleMetadata} from './projection-rule-metadata.js';
import {ProjectionRuleReflector} from './projection-rule-reflector.js';

/**
 * Projection rule decorator.
 *
 * @param metadata
 */
export function projectionRule<T extends object>(
  metadata: ProjectionRuleMetadata,
) {
  return function (
    target: Constructor<T> | Prototype<T>,
    propertyKey?: string,
    descriptor?: PropertyDescriptor,
  ) {
    const decoratorType = getDecoratorTargetType(
      target,
      propertyKey,
      descriptor,
    );
    if (decoratorType === DecoratorTargetType.CONSTRUCTOR) {
      ProjectionRuleReflector.setClassMetadata(
        metadata,
        target as Constructor<T>,
      );
    } else if (decoratorType === DecoratorTargetType.INSTANCE_PROPERTY) {
      const targetCtor =
        typeof target === 'object'
          ? (target.constructor as Constructor<T>)
          : target;
      ProjectionRuleReflector.setPropertyMetadata(
        metadata,
        targetCtor,
        propertyKey!,
      );
    } else {
      throw new Error(
        'Projection rule decorator is only supported ' +
          'for a class or an instance property.',
      );
    }
  };
}

/**
 * No input decorator.
 */
export function noInput() {
  return projectionRule({
    scope: ProjectionScope.INPUT,
    rule: ProjectionRule.HIDE,
  });
}

/**
 * Allow input decorator.
 */
export function allowInput() {
  return projectionRule({
    scope: ProjectionScope.INPUT,
    rule: ProjectionRule.SHOW,
  });
}

/**
 * No output decorator.
 */
export function noOutput() {
  return projectionRule({
    scope: ProjectionScope.OUTPUT,
    rule: ProjectionRule.HIDE,
  });
}

/**
 * Allow output decorator.
 */
export function allowOutput() {
  return projectionRule({
    scope: ProjectionScope.OUTPUT,
    rule: ProjectionRule.SHOW,
  });
}

/**
 * Hidden decorator (noOutput).
 */
export const hidden = noOutput;

/**
 * Visible decorator (allowOutput).
 */
export const visible = allowOutput;
