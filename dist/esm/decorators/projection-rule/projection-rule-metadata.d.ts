import { MetadataKey } from '@e22m4u/ts-reflector';
import { ProjectionRule } from '../../projection.js';
import { ProjectionScope } from '../../projection.js';
/**
 * Projection rule metadata.
 */
export type ProjectionRuleMetadata = {
    scope: ProjectionScope;
    rule: ProjectionRule;
};
/**
 * Projection rule metadata list.
 */
export type ProjectionRuleMetadataList = ProjectionRuleMetadata[];
/**
 * Projection rule metadata map.
 */
export type ProjectionRuleMetadataMap = Map<string, ProjectionRuleMetadataList>;
/**
 * Projection rule class metadata key.
 */
export declare const PROJECTION_RULE_CLASS_METADATA_KEY: MetadataKey<ProjectionRuleMetadataList>;
/**
 * Projection rule property metadata key.
 */
export declare const PROJECTION_RULE_PROPERTY_METADATA_KEY: MetadataKey<ProjectionRuleMetadataMap>;
