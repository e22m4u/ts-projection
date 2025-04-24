import { Prototype } from './types.js';
import { Constructor } from './types.js';
import { MetadataKey } from '@e22m4u/ts-reflector';
/**
 * Определяет область применения правила проекции.
 * - `INPUT`: Правило применяется к входящим данным (например, данные в запросе API).
 * - `OUTPUT`: Правило применяется к исходящим данным (например, данные в ответе API).
 */
export declare enum ProjectionScope {
    INPUT = "input",
    OUTPUT = "output"
}
/**
 * Определяет само правило проекции.
 * - `HIDE`: Свойство должно быть скрыто (удалено) в указанной области (`ProjectionScope`).
 * - `SHOW`: Свойство является видимым в указанной области (`ProjectionScope`).
 */
export declare enum ProjectionRule {
    HIDE = "hide",
    SHOW = "show"
}
/**
 * Тип, описывающий метаданные одного правила проекции для свойства.
 * Содержит область применения (`scope`) и само правило (`rule`).
 */
export type ProjectionRuleMetadata = {
    scope: ProjectionScope;
    rule: ProjectionRule;
};
/**
 * Тип списка для хранения метаданных правил проекции класса,
 * где значением являются метаданные общих правил проекции
 * для всех свойств данного класса.
 */
export type ProjectionRuleMetadataList = ProjectionRuleMetadata[];
/**
 * Тип карты для хранения метаданных правил проекции класса, где ключ
 * является именем свойства класса, а значение метаданными правила
 * проекции для этого свойства.
 */
export type ProjectionRuleMetadataMap = Map<string, ProjectionRuleMetadata>;
/**
 * Тип, описывающий метаданные для свойства, содержащего вложенную модель.
 * Содержит фабричную функцию (`model`), которая возвращает конструктор
 * вложенной модели. Использование фабрики позволяет избежать проблем
 * с циклическими зависимостями модулей.
 */
export type ProjectionEmbeddingMetadata = {
    model: () => Constructor;
};
/**
 * Тип карты для хранения метаданных вложений для свойств класса,
 * где ключ является именем свойства класса, а значение метаданными
 * вложения для этого свойства.
 */
export type ProjectionEmbeddingMetadataMap = Map<string, ProjectionEmbeddingMetadata>;
/**
 * Ключ метаданных для хранения и извлечения карты
 * метаданных общих правил проекции для конструктора класса.
 */
export declare const PROJECTION_RULE_CLASS_METADATA_KEY: MetadataKey<ProjectionRuleMetadataList>;
/**
 * Ключ метаданных для хранения и извлечения карты
 * метаданных правил проекции для конструктора класса.
 */
export declare const PROJECTION_RULE_PROPERTY_METADATA_KEY: MetadataKey<ProjectionRuleMetadataMap>;
/**
 * Ключ метаданных для хранения и извлечения карты
 * метаданных вложений для конструктора класса.
 */
export declare const PROJECTION_EMBEDDING_PROPERTY_METADATA_KEY: MetadataKey<ProjectionEmbeddingMetadataMap>;
/**
 * Декоратор класса: помечает все свойства класса как скрытые для области
 * INPUT. Обычно используется для классов, свойства которого не должны
 * приниматься от клиента (например, пароли).
 *
 * @returns Функция декоратора класса.
 */
export declare function lockedProperties(): (target: Constructor<object>, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
/**
 * Декоратор класса: помечает все свойства класса как скрытые для области
 * OUTPUT. Обычно используется для классов, свойства которого не должны
 * отправляться клиенту (например, пароль пользователя).
 *
 * @returns Функция декоратора класса.
 */
export declare function hiddenProperties(): (target: Constructor<object>, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
/**
 * Декоратор свойства: явно помечает свойство как видимое (разрешенное)
 * для области INPUT. Может использоваться для переопределения
 * правила HIDE, установленного декоратором класса @lockedProperties.
 *
 * @returns Функция декоратора свойства.
 */
export declare function writableProperty(): (target: Prototype<object>, propertyKey: string, descriptor?: PropertyDescriptor) => void;
/**
 * Декоратор свойства: помечает свойство как скрытое для области INPUT.
 * Обычно используется для свойств, которые не должны приниматься
 * от клиента (например, пароли).
 *
 * @returns Функция декоратора свойства.
 */
export declare function lockedProperty(): (target: Prototype<object>, propertyKey: string, descriptor?: PropertyDescriptor) => void;
/**
 * Декоратор свойства: явно помечает свойство как видимое (разрешенное)
 * для области OUTPUT. Может использоваться для переопределения
 * правила HIDE, установленного декоратором класса @hiddenProperties.
 *
 * @returns Функция декоратора свойства.
 */
export declare function visibleProperty(): (target: Prototype<object>, propertyKey: string, descriptor?: PropertyDescriptor) => void;
/**
 * Декоратор свойства: помечает свойство как скрытое для области OUTPUT.
 * Обычно используется для свойств, которые не должны отправляться
 * клиенту (например, внутренние заметки).
 *
 * @returns Функция декоратора свойства.
 */
export declare function hiddenProperty(): (target: Prototype<object>, propertyKey: string, descriptor?: PropertyDescriptor) => void;
/**
 * Декоратор свойства: помечает свойство как содержащее вложенную модель,
 * к которой также должны применяться правила проекции.
 *
 * @param model Фабричная функция, возвращающая конструктор вложенной
 *   модели. Использование фабрики (`() => RelatedModel`) позволяет обойти
 *   циклические зависимости.
 * @returns Функция декоратора свойства.
 */
export declare function isEmbedded(model: () => Constructor): (target: Constructor<object> | Prototype<object>, propertyKey: string, descriptor?: PropertyDescriptor) => void;
/**
 * Применяет правила проекции OUTPUT к объекту или массиву объектов,
 * удаляя или рекурсивно обрабатывая поля на основе метаданных модели.
 * Не модифицирует исходные данные.
 *
 * @param model Конструктор класса модели с метаданными проекции.
 * @param data Объект или массив объектов для обработки.
 * @returns Новый объект или массив объектов с примененными правилами
 *   проекции OUTPUT, или исходное значение, если data не объект/массив.
 */
export declare function applyProjection<T>(model: Constructor, data: T): T;
/**
 * Применяет правила проекции к объекту или массиву объектов для указанной области,
 * удаляя или рекурсивно обрабатывая поля на основе метаданных модели.
 * Не модифицирует исходные данные.
 *
 * @param scope Область применения правил (INPUT или OUTPUT).
 * @param model Конструктор класса модели с метаданными проекции.
 * @param data Объект или массив объектов для обработки.
 * @returns Новый объект или массив объектов с примененными
 *   правилами проекции, или исходное значение, если data не объект/массив.
 */
export declare function applyProjection<T>(scope: ProjectionScope, model: Constructor, data: T): T;
