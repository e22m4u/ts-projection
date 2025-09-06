import { Reflector } from '@e22m4u/ts-reflector';
import { PROJECTION_RULE_CLASS_METADATA_KEY } from './projection-rule-metadata.js';
import { PROJECTION_RULE_PROPERTY_METADATA_KEY } from './projection-rule-metadata.js';
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
    static setClassMetadata(metadata, target) {
        const oldList = Reflector.getMetadata(PROJECTION_RULE_CLASS_METADATA_KEY, target) ?? [];
        const newList = [...oldList, metadata];
        Reflector.defineMetadata(PROJECTION_RULE_CLASS_METADATA_KEY, newList, target);
    }
    /**
     * Get class metadata.
     *
     * @param target Конструктор класса для поиска метаданных.
     * @returns Список метаданных правил проекции.
     */
    static getClassMetadata(target) {
        const metadata = Reflector.getMetadata(PROJECTION_RULE_CLASS_METADATA_KEY, target);
        return metadata ?? [];
    }
    /**
     * Set property metadata.
     *
     * @param metadata
     * @param target
     * @param propertyKey
     */
    static setPropertyMetadata(metadata, target, propertyKey) {
        const oldMap = Reflector.getMetadata(PROJECTION_RULE_PROPERTY_METADATA_KEY, target);
        const newMap = new Map(oldMap);
        const oldList = newMap.get(propertyKey) ?? [];
        const newList = [...oldList, metadata];
        newMap.set(propertyKey, newList);
        Reflector.defineMetadata(PROJECTION_RULE_PROPERTY_METADATA_KEY, newMap, target);
    }
    /**
     * Get properties metadata.
     *
     * @param target
     */
    static getPropertiesMetadata(target) {
        const metadata = Reflector.getMetadata(PROJECTION_RULE_PROPERTY_METADATA_KEY, target);
        return metadata ?? new Map();
    }
}
