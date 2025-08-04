import {Constructor} from '../../types.js';
import {Reflector} from '@e22m4u/ts-reflector';
import {ProjectionRuleMetadata} from './projection-rule-metadata.js';
import {ProjectionRuleMetadataMap} from './projection-rule-metadata.js';
import {ProjectionRuleMetadataList} from './projection-rule-metadata.js';
import {PROJECTION_RULE_CLASS_METADATA_KEY} from './projection-rule-metadata.js';
import {PROJECTION_RULE_PROPERTY_METADATA_KEY} from './projection-rule-metadata.js';

/**
 * Projection rule reflector.
 */
export class ProjectionRuleReflector {
  /**
   * Set class metadata.
   *
   * @param metadata
   * @param target
   */
  static setClassMetadata(
    metadata: ProjectionRuleMetadata,
    target: Constructor,
  ) {
    const oldList =
      Reflector.getOwnMetadata(PROJECTION_RULE_CLASS_METADATA_KEY, target) ??
      [];
    const newList = [...oldList, metadata];
    Reflector.defineMetadata(
      PROJECTION_RULE_CLASS_METADATA_KEY,
      newList,
      target,
    );
  }

  /**
   * Get class metadata.
   *
   * @param target Конструктор класса для поиска метаданных.
   * @returns Список метаданных правил проекции.
   */
  static getClassMetadata(target: Constructor): ProjectionRuleMetadataList {
    const metadata = Reflector.getOwnMetadata(
      PROJECTION_RULE_CLASS_METADATA_KEY,
      target,
    );
    return metadata ?? [];
  }

  /**
   * Set propery metadata.
   *
   * @param metadata
   * @param target
   * @param propertyKey
   */
  static setPropertyMetadata(
    metadata: ProjectionRuleMetadata,
    target: Constructor,
    propertyKey: string,
  ) {
    const oldMap = Reflector.getOwnMetadata(
      PROJECTION_RULE_PROPERTY_METADATA_KEY,
      target,
    );
    const newMap = new Map(oldMap);
    const oldList = newMap.get(propertyKey) ?? [];
    const newList = [...oldList, metadata];
    newMap.set(propertyKey, newList);
    Reflector.defineMetadata(
      PROJECTION_RULE_PROPERTY_METADATA_KEY,
      newMap,
      target,
    );
  }

  /**
   * Get properties metadata.
   *
   * @param target
   */
  static getPropertiesMetadata(target: Constructor): ProjectionRuleMetadataMap {
    const metadata = Reflector.getOwnMetadata(
      PROJECTION_RULE_PROPERTY_METADATA_KEY,
      target,
    );
    return metadata ?? new Map();
  }
}
