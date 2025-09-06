"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// dist/esm/index.js
var index_exports = {};
__export(index_exports, {
  EMBEDDED_PROJECTION_PROPERTY_METADATA_KEY: () => EMBEDDED_PROJECTION_PROPERTY_METADATA_KEY,
  EmbeddedProjectionReflector: () => EmbeddedProjectionReflector,
  PROJECTION_RULE_CLASS_METADATA_KEY: () => PROJECTION_RULE_CLASS_METADATA_KEY,
  PROJECTION_RULE_PROPERTY_METADATA_KEY: () => PROJECTION_RULE_PROPERTY_METADATA_KEY,
  ProjectionRule: () => ProjectionRule,
  ProjectionRuleReflector: () => ProjectionRuleReflector,
  ProjectionScope: () => ProjectionScope,
  allowInput: () => allowInput,
  allowOutput: () => allowOutput,
  applyProjection: () => applyProjection,
  hidden: () => hidden,
  isEmbedded: () => isEmbedded,
  noInput: () => noInput,
  noOutput: () => noOutput,
  visible: () => visible
});
module.exports = __toCommonJS(index_exports);

// dist/esm/projection.js
var ProjectionScope;
(function(ProjectionScope2) {
  ProjectionScope2["INPUT"] = "input";
  ProjectionScope2["OUTPUT"] = "output";
})(ProjectionScope || (ProjectionScope = {}));
var ProjectionRule;
(function(ProjectionRule2) {
  ProjectionRule2["HIDE"] = "hide";
  ProjectionRule2["SHOW"] = "show";
})(ProjectionRule || (ProjectionRule = {}));

// dist/esm/decorators/projection-rule/projection-rule-metadata.js
var import_ts_reflector = require("@e22m4u/ts-reflector");
var PROJECTION_RULE_CLASS_METADATA_KEY = new import_ts_reflector.MetadataKey("projectionRuleClassMetadataKey");
var PROJECTION_RULE_PROPERTY_METADATA_KEY = new import_ts_reflector.MetadataKey("projectionRulePropertyMetadataKey");

// dist/esm/decorators/projection-rule/projection-rule-decorator.js
var import_ts_reflector3 = require("@e22m4u/ts-reflector");
var import_ts_reflector4 = require("@e22m4u/ts-reflector");

// dist/esm/decorators/projection-rule/projection-rule-reflector.js
var import_ts_reflector2 = require("@e22m4u/ts-reflector");
var _ProjectionRuleReflector = class _ProjectionRuleReflector {
  /**
   * Set class metadata.
   *
   * @param metadata
   * @param target
   */
  static setClassMetadata(metadata, target) {
    var _a;
    const oldList = (_a = import_ts_reflector2.Reflector.getMetadata(PROJECTION_RULE_CLASS_METADATA_KEY, target)) != null ? _a : [];
    const newList = [...oldList, metadata];
    import_ts_reflector2.Reflector.defineMetadata(PROJECTION_RULE_CLASS_METADATA_KEY, newList, target);
  }
  /**
   * Get class metadata.
   *
   * @param target Конструктор класса для поиска метаданных.
   * @returns Список метаданных правил проекции.
   */
  static getClassMetadata(target) {
    const metadata = import_ts_reflector2.Reflector.getMetadata(PROJECTION_RULE_CLASS_METADATA_KEY, target);
    return metadata != null ? metadata : [];
  }
  /**
   * Set property metadata.
   *
   * @param metadata
   * @param target
   * @param propertyKey
   */
  static setPropertyMetadata(metadata, target, propertyKey) {
    var _a;
    const oldMap = import_ts_reflector2.Reflector.getMetadata(PROJECTION_RULE_PROPERTY_METADATA_KEY, target);
    const newMap = new Map(oldMap);
    const oldList = (_a = newMap.get(propertyKey)) != null ? _a : [];
    const newList = [...oldList, metadata];
    newMap.set(propertyKey, newList);
    import_ts_reflector2.Reflector.defineMetadata(PROJECTION_RULE_PROPERTY_METADATA_KEY, newMap, target);
  }
  /**
   * Get properties metadata.
   *
   * @param target
   */
  static getPropertiesMetadata(target) {
    const metadata = import_ts_reflector2.Reflector.getMetadata(PROJECTION_RULE_PROPERTY_METADATA_KEY, target);
    return metadata != null ? metadata : /* @__PURE__ */ new Map();
  }
};
__name(_ProjectionRuleReflector, "ProjectionRuleReflector");
var ProjectionRuleReflector = _ProjectionRuleReflector;

// dist/esm/decorators/projection-rule/projection-rule-decorator.js
function projectionRule(metadata) {
  return function(target, propertyKey, descriptor) {
    const decoratorType = (0, import_ts_reflector4.getDecoratorTargetType)(target, propertyKey, descriptor);
    if (decoratorType === import_ts_reflector3.DecoratorTargetType.CONSTRUCTOR) {
      ProjectionRuleReflector.setClassMetadata(metadata, target);
    } else if (decoratorType === import_ts_reflector3.DecoratorTargetType.INSTANCE_PROPERTY) {
      const targetCtor = typeof target === "object" ? target.constructor : target;
      ProjectionRuleReflector.setPropertyMetadata(metadata, targetCtor, propertyKey);
    } else {
      throw new Error("Projection rule decorator is only supported for a class or an instance property.");
    }
  };
}
__name(projectionRule, "projectionRule");
function noInput() {
  return projectionRule({
    scope: ProjectionScope.INPUT,
    rule: ProjectionRule.HIDE
  });
}
__name(noInput, "noInput");
function allowInput() {
  return projectionRule({
    scope: ProjectionScope.INPUT,
    rule: ProjectionRule.SHOW
  });
}
__name(allowInput, "allowInput");
function noOutput() {
  return projectionRule({
    scope: ProjectionScope.OUTPUT,
    rule: ProjectionRule.HIDE
  });
}
__name(noOutput, "noOutput");
function allowOutput() {
  return projectionRule({
    scope: ProjectionScope.OUTPUT,
    rule: ProjectionRule.SHOW
  });
}
__name(allowOutput, "allowOutput");
var hidden = noOutput;
var visible = allowOutput;

// dist/esm/decorators/embedded-projection/embedded-projection-metadata.js
var import_ts_reflector5 = require("@e22m4u/ts-reflector");
var EMBEDDED_PROJECTION_PROPERTY_METADATA_KEY = new import_ts_reflector5.MetadataKey("embeddedProjectionPropertyMetadataKey");

// dist/esm/decorators/embedded-projection/embedded-projection-decorator.js
var import_ts_reflector7 = require("@e22m4u/ts-reflector");
var import_ts_reflector8 = require("@e22m4u/ts-reflector");

// dist/esm/decorators/embedded-projection/embedded-projection-reflector.js
var import_ts_reflector6 = require("@e22m4u/ts-reflector");
var _EmbeddedProjectionReflector = class _EmbeddedProjectionReflector {
  /**
   * Set property metadata.
   *
   * @param metadata
   * @param target
   * @param propertyKey
   */
  static setPropertyMetadata(metadata, target, propertyKey) {
    const oldMap = import_ts_reflector6.Reflector.getMetadata(EMBEDDED_PROJECTION_PROPERTY_METADATA_KEY, target);
    const newMap = new Map(oldMap);
    newMap.set(propertyKey, metadata);
    import_ts_reflector6.Reflector.defineMetadata(EMBEDDED_PROJECTION_PROPERTY_METADATA_KEY, newMap, target);
  }
  /**
   * Get properties metadata.
   *
   * @param target
   */
  static getPropertiesMetadata(target) {
    const metadata = import_ts_reflector6.Reflector.getMetadata(EMBEDDED_PROJECTION_PROPERTY_METADATA_KEY, target);
    return metadata != null ? metadata : /* @__PURE__ */ new Map();
  }
};
__name(_EmbeddedProjectionReflector, "EmbeddedProjectionReflector");
var EmbeddedProjectionReflector = _EmbeddedProjectionReflector;

// dist/esm/decorators/embedded-projection/embedded-projection-decorator.js
function embeddedProjection(metadata) {
  return function(target, propertyKey, descriptor) {
    const decoratorType = (0, import_ts_reflector8.getDecoratorTargetType)(target, propertyKey, descriptor);
    if (decoratorType !== import_ts_reflector7.DecoratorTargetType.INSTANCE_PROPERTY)
      throw new Error("Embedded projection decorator is only supported for an instance property.");
    EmbeddedProjectionReflector.setPropertyMetadata(metadata, target.constructor, propertyKey);
  };
}
__name(embeddedProjection, "embeddedProjection");
function isEmbedded(model) {
  return embeddedProjection({ model });
}
__name(isEmbedded, "isEmbedded");

// dist/esm/apply-projection.js
function applyProjection(scopeOrModel, modelOrData, data) {
  let scope;
  let model;
  let inputData;
  const isThreeArgCall = typeof scopeOrModel === "string";
  if (isThreeArgCall) {
    scope = scopeOrModel;
    model = modelOrData;
    inputData = data;
  } else {
    scope = ProjectionScope.OUTPUT;
    model = scopeOrModel;
    inputData = modelOrData;
  }
  return _applyProjection(scope, model, inputData);
}
__name(applyProjection, "applyProjection");
function _applyProjection(scope, model, data) {
  var _a;
  if (data === null || typeof data !== "object") {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => _applyProjection(scope, model, item));
  }
  const prClassMetadataList = ProjectionRuleReflector.getClassMetadata(model);
  const prPropertyMetadataMap = ProjectionRuleReflector.getPropertiesMetadata(model);
  const epPropertyMetadataMap = EmbeddedProjectionReflector.getPropertiesMetadata(model);
  const result = { ...data };
  for (const key in result) {
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      continue;
    }
    let effectiveRule = ProjectionRule.SHOW;
    const prPropertyMetadataList = (_a = prPropertyMetadataMap.get(key)) != null ? _a : [];
    const prPropertyMetadata = prPropertyMetadataList.reverse().find((md) => md.scope === scope);
    if (prPropertyMetadata) {
      effectiveRule = prPropertyMetadata.rule;
    } else {
      const prClassMetadata = prClassMetadataList.reverse().find((md) => md.scope === scope);
      if (prClassMetadata)
        effectiveRule = prClassMetadata.rule;
    }
    const shouldHide = effectiveRule === ProjectionRule.HIDE;
    if (shouldHide) {
      delete result[key];
    } else {
      const epPropertyMetadata = epPropertyMetadataMap.get(key);
      if (epPropertyMetadata) {
        const embeddedModelCtor = epPropertyMetadata.model();
        const embeddedValue = result[key];
        result[key] = _applyProjection(scope, embeddedModelCtor, embeddedValue);
      }
    }
  }
  return result;
}
__name(_applyProjection, "_applyProjection");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EMBEDDED_PROJECTION_PROPERTY_METADATA_KEY,
  EmbeddedProjectionReflector,
  PROJECTION_RULE_CLASS_METADATA_KEY,
  PROJECTION_RULE_PROPERTY_METADATA_KEY,
  ProjectionRule,
  ProjectionRuleReflector,
  ProjectionScope,
  allowInput,
  allowOutput,
  applyProjection,
  hidden,
  isEmbedded,
  noInput,
  noOutput,
  visible
});
