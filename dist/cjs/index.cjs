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
  PROJECTION_EMBEDDING_PROPERTY_METADATA_KEY: () => PROJECTION_EMBEDDING_PROPERTY_METADATA_KEY,
  PROJECTION_RULE_CLASS_METADATA_KEY: () => PROJECTION_RULE_CLASS_METADATA_KEY,
  PROJECTION_RULE_PROPERTY_METADATA_KEY: () => PROJECTION_RULE_PROPERTY_METADATA_KEY,
  ProjectionRule: () => ProjectionRule,
  ProjectionScope: () => ProjectionScope,
  applyProjection: () => applyProjection,
  hiddenProperties: () => hiddenProperties,
  hiddenProperty: () => hiddenProperty,
  isEmbedded: () => isEmbedded,
  lockedProperties: () => lockedProperties,
  lockedProperty: () => lockedProperty,
  visibleProperty: () => visibleProperty,
  writableProperty: () => writableProperty
});
module.exports = __toCommonJS(index_exports);

// dist/esm/projection.js
var import_js_format = require("@e22m4u/js-format");
var import_ts_reflector = require("@e22m4u/ts-reflector");
var import_ts_reflector2 = require("@e22m4u/ts-reflector");
var import_ts_reflector3 = require("@e22m4u/ts-reflector");
var import_ts_reflector4 = require("@e22m4u/ts-reflector");
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
var PROJECTION_RULE_CLASS_METADATA_KEY = new import_ts_reflector2.MetadataKey("dataProjectionRuleClassMetadataKey");
var PROJECTION_RULE_PROPERTY_METADATA_KEY = new import_ts_reflector2.MetadataKey("dataProjectionRulePropertyMetadataKey");
var PROJECTION_EMBEDDING_PROPERTY_METADATA_KEY = new import_ts_reflector2.MetadataKey("dataProjectionEmbeddingPropertyMetadataKey");
function setProjectionRuleClassMetadata(metadata, target) {
  var _a;
  const oldList = (_a = import_ts_reflector.Reflector.getOwnMetadata(PROJECTION_RULE_CLASS_METADATA_KEY, target)) != null ? _a : [];
  const newList = [...oldList, metadata];
  import_ts_reflector.Reflector.defineMetadata(PROJECTION_RULE_CLASS_METADATA_KEY, newList, target);
}
__name(setProjectionRuleClassMetadata, "setProjectionRuleClassMetadata");
function setProjectionRulePropertyMetadata(metadata, target, propertyKey) {
  const oldMap = import_ts_reflector.Reflector.getOwnMetadata(PROJECTION_RULE_PROPERTY_METADATA_KEY, target);
  const newMap = new Map(oldMap);
  newMap.set(propertyKey, metadata);
  import_ts_reflector.Reflector.defineMetadata(PROJECTION_RULE_PROPERTY_METADATA_KEY, newMap, target);
}
__name(setProjectionRulePropertyMetadata, "setProjectionRulePropertyMetadata");
function setProjectionEmbeddingPropertyMetadata(metadata, target, propertyKey) {
  const oldMap = import_ts_reflector.Reflector.getOwnMetadata(PROJECTION_EMBEDDING_PROPERTY_METADATA_KEY, target);
  const newMap = new Map(oldMap);
  newMap.set(propertyKey, metadata);
  import_ts_reflector.Reflector.defineMetadata(PROJECTION_EMBEDDING_PROPERTY_METADATA_KEY, newMap, target);
}
__name(setProjectionEmbeddingPropertyMetadata, "setProjectionEmbeddingPropertyMetadata");
function getProjectionRuleClassMetadataList(target) {
  const metadata = import_ts_reflector.Reflector.getOwnMetadata(PROJECTION_RULE_CLASS_METADATA_KEY, target);
  return metadata != null ? metadata : [];
}
__name(getProjectionRuleClassMetadataList, "getProjectionRuleClassMetadataList");
function getProjectionRulePropertyMetadataMap(target) {
  const metadata = import_ts_reflector.Reflector.getOwnMetadata(PROJECTION_RULE_PROPERTY_METADATA_KEY, target);
  return metadata != null ? metadata : /* @__PURE__ */ new Map();
}
__name(getProjectionRulePropertyMetadataMap, "getProjectionRulePropertyMetadataMap");
function getProjectionEmbeddingPropertyMetadataMap(target) {
  const metadata = import_ts_reflector.Reflector.getOwnMetadata(PROJECTION_EMBEDDING_PROPERTY_METADATA_KEY, target);
  return metadata != null ? metadata : /* @__PURE__ */ new Map();
}
__name(getProjectionEmbeddingPropertyMetadataMap, "getProjectionEmbeddingPropertyMetadataMap");
function projectionRuleClassDecorator(metadata, decoratorName = "projectionRuleClassDecorator") {
  return function(target, propertyKey, descriptor) {
    const decoratorType = (0, import_ts_reflector4.getDecoratorTargetType)(target, propertyKey, descriptor);
    if (decoratorType !== import_ts_reflector3.DecoratorTargetType.CONSTRUCTOR)
      throw new import_js_format.Errorf("@%s decorator is only supported for a class constructor.", decoratorName);
    setProjectionRuleClassMetadata(metadata, target);
  };
}
__name(projectionRuleClassDecorator, "projectionRuleClassDecorator");
function projectionRulePropertyDecorator(metadata, decoratorName = "projectionRulePropertyDecorator") {
  return function(target, propertyKey, descriptor) {
    const decoratorType = (0, import_ts_reflector4.getDecoratorTargetType)(target, propertyKey, descriptor);
    const targetCtor = typeof target === "object" ? target.constructor : target;
    if (decoratorType !== import_ts_reflector3.DecoratorTargetType.INSTANCE_PROPERTY)
      throw new import_js_format.Errorf("@%s decorator is only supported for an instance property.", decoratorName);
    setProjectionRulePropertyMetadata(metadata, targetCtor, propertyKey);
  };
}
__name(projectionRulePropertyDecorator, "projectionRulePropertyDecorator");
function projectionEmbeddingPropertyDecorator(metadata, decoratorName = "projectionEmbeddingPropertyDecorator") {
  return function(target, propertyKey, descriptor) {
    const decoratorType = (0, import_ts_reflector4.getDecoratorTargetType)(target, propertyKey, descriptor);
    const targetCtor = typeof target === "object" ? target.constructor : target;
    if (decoratorType !== import_ts_reflector3.DecoratorTargetType.INSTANCE_PROPERTY)
      throw new import_js_format.Errorf("@%s decorator is only supported for an instance property.", decoratorName);
    setProjectionEmbeddingPropertyMetadata(metadata, targetCtor, propertyKey);
  };
}
__name(projectionEmbeddingPropertyDecorator, "projectionEmbeddingPropertyDecorator");
function lockedProperties() {
  return projectionRuleClassDecorator({ scope: ProjectionScope.INPUT, rule: ProjectionRule.HIDE }, "lockedProperties");
}
__name(lockedProperties, "lockedProperties");
function hiddenProperties() {
  return projectionRuleClassDecorator({ scope: ProjectionScope.OUTPUT, rule: ProjectionRule.HIDE }, "hiddenProperties");
}
__name(hiddenProperties, "hiddenProperties");
function writableProperty() {
  return projectionRulePropertyDecorator({ scope: ProjectionScope.INPUT, rule: ProjectionRule.SHOW }, "writableProperty");
}
__name(writableProperty, "writableProperty");
function lockedProperty() {
  return projectionRulePropertyDecorator({ scope: ProjectionScope.INPUT, rule: ProjectionRule.HIDE }, "lockedProperty");
}
__name(lockedProperty, "lockedProperty");
function visibleProperty() {
  return projectionRulePropertyDecorator({ scope: ProjectionScope.OUTPUT, rule: ProjectionRule.SHOW }, "visibleProperty");
}
__name(visibleProperty, "visibleProperty");
function hiddenProperty() {
  return projectionRulePropertyDecorator({ scope: ProjectionScope.OUTPUT, rule: ProjectionRule.HIDE }, "hiddenProperty");
}
__name(hiddenProperty, "hiddenProperty");
function isEmbedded(model) {
  return projectionEmbeddingPropertyDecorator({ model }, "isEmbedded");
}
__name(isEmbedded, "isEmbedded");
function _applyProjectionInternal(scope, model, data) {
  if (data === null || typeof data !== "object") {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => _applyProjectionInternal(scope, model, item));
  }
  const classRules = getProjectionRuleClassMetadataList(model);
  const propertyRuleMap = getProjectionRulePropertyMetadataMap(model);
  const embeddingMap = getProjectionEmbeddingPropertyMetadataMap(model);
  const result = { ...data };
  for (const key in result) {
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      continue;
    }
    let effectiveRule = ProjectionRule.SHOW;
    const propertyRuleMeta = propertyRuleMap.get(key);
    if (propertyRuleMeta && propertyRuleMeta.scope === scope) {
      effectiveRule = propertyRuleMeta.rule;
    } else {
      const classRuleMeta = classRules.slice().reverse().find((rule) => rule.scope === scope);
      if (classRuleMeta)
        effectiveRule = classRuleMeta.rule;
    }
    const shouldHide = effectiveRule === ProjectionRule.HIDE;
    if (shouldHide) {
      delete result[key];
    } else {
      const embeddingMeta = embeddingMap.get(key);
      if (embeddingMeta) {
        const embeddedModelConstructor = embeddingMeta.model();
        const embeddedValue = result[key];
        result[key] = _applyProjectionInternal(scope, embeddedModelConstructor, embeddedValue);
      }
    }
  }
  return result;
}
__name(_applyProjectionInternal, "_applyProjectionInternal");
function applyProjection(scopeOrModel, modelOrData, data) {
  let scope;
  let model;
  let actualData;
  const isThreeArgCall = typeof scopeOrModel === "string";
  if (isThreeArgCall) {
    scope = scopeOrModel;
    model = modelOrData;
    actualData = data;
  } else {
    scope = ProjectionScope.OUTPUT;
    model = scopeOrModel;
    actualData = modelOrData;
  }
  return _applyProjectionInternal(scope, model, actualData);
}
__name(applyProjection, "applyProjection");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PROJECTION_EMBEDDING_PROPERTY_METADATA_KEY,
  PROJECTION_RULE_CLASS_METADATA_KEY,
  PROJECTION_RULE_PROPERTY_METADATA_KEY,
  ProjectionRule,
  ProjectionScope,
  applyProjection,
  hiddenProperties,
  hiddenProperty,
  isEmbedded,
  lockedProperties,
  lockedProperty,
  visibleProperty,
  writableProperty
});
