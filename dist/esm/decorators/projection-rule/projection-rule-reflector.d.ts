import { Constructor } from '../../types.js';
import { ProjectionRuleMetadata } from './projection-rule-metadata.js';
import { ProjectionRuleMetadataMap } from './projection-rule-metadata.js';
import { ProjectionRuleMetadataList } from './projection-rule-metadata.js';
/**
 * Projection rule reflector.
 */
export declare class ProjectionRuleReflector {
    /**
     * Set class metadata.
     *
     * @param metadata
     * @param target
     */
    static setClassMetadata(metadata: ProjectionRuleMetadata, target: Constructor): void;
    /**
     * Get class metadata.
     *
     * @param target Конструктор класса для поиска метаданных.
     * @returns Список метаданных правил проекции.
     */
    static getClassMetadata(target: Constructor): ProjectionRuleMetadataList;
    /**
     * Set property metadata.
     *
     * @param metadata
     * @param target
     * @param propertyKey
     */
    static setPropertyMetadata(metadata: ProjectionRuleMetadata, target: Constructor, propertyKey: string): void;
    /**
     * Get properties metadata.
     *
     * @param target
     */
    static getPropertiesMetadata(target: Constructor): ProjectionRuleMetadataMap;
}
