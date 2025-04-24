import { Errorf } from '@e22m4u/js-format';
import { Reflector } from '@e22m4u/ts-reflector';
import { MetadataKey } from '@e22m4u/ts-reflector';
import { DecoratorTargetType } from '@e22m4u/ts-reflector';
import { getDecoratorTargetType } from '@e22m4u/ts-reflector';
/**
 * Определяет область применения правила проекции.
 * - `INPUT`: Правило применяется к входящим данным (например, данные в запросе API).
 * - `OUTPUT`: Правило применяется к исходящим данным (например, данные в ответе API).
 */
export var ProjectionScope;
(function (ProjectionScope) {
    ProjectionScope["INPUT"] = "input";
    ProjectionScope["OUTPUT"] = "output";
})(ProjectionScope || (ProjectionScope = {}));
/**
 * Определяет само правило проекции.
 * - `HIDE`: Свойство должно быть скрыто (удалено) в указанной области (`ProjectionScope`).
 * - `SHOW`: Свойство является видимым в указанной области (`ProjectionScope`).
 */
export var ProjectionRule;
(function (ProjectionRule) {
    ProjectionRule["HIDE"] = "hide";
    ProjectionRule["SHOW"] = "show";
})(ProjectionRule || (ProjectionRule = {}));
/**
 * Ключ метаданных для хранения и извлечения карты
 * метаданных общих правил проекции для конструктора класса.
 */
export const PROJECTION_RULE_CLASS_METADATA_KEY = new MetadataKey('dataProjectionRuleClassMetadataKey');
/**
 * Ключ метаданных для хранения и извлечения карты
 * метаданных правил проекции для конструктора класса.
 */
export const PROJECTION_RULE_PROPERTY_METADATA_KEY = new MetadataKey('dataProjectionRulePropertyMetadataKey');
/**
 * Ключ метаданных для хранения и извлечения карты
 * метаданных вложений для конструктора класса.
 */
export const PROJECTION_EMBEDDING_PROPERTY_METADATA_KEY = new MetadataKey('dataProjectionEmbeddingPropertyMetadataKey');
/**
 * Устанавливает метаданные общих правил проекции для конструктора класса.
 * Добавляет или обновляет запись в карте метаданных правил.
 *
 * @param metadata Метаданные общих правил для установки.
 * @param target Конструктор класса, к которому привязываются метаданные.
 */
function setProjectionRuleClassMetadata(metadata, target) {
    const oldList = Reflector.getOwnMetadata(PROJECTION_RULE_CLASS_METADATA_KEY, target) ?? [];
    const newList = [...oldList, metadata];
    Reflector.defineMetadata(PROJECTION_RULE_CLASS_METADATA_KEY, newList, target);
}
/**
 * Устанавливает метаданные правила проекции для конкретного свойства
 * конструктора. Добавляет или обновляет запись в карте метаданных правил.
 *
 * @param metadata Метаданные правила для установки.
 * @param target Конструктор класса, к которому привязываются метаданные.
 * @param propertyKey Ключ свойства, для которого устанавливаются метаданные.
 */
function setProjectionRulePropertyMetadata(metadata, target, propertyKey) {
    const oldMap = Reflector.getOwnMetadata(PROJECTION_RULE_PROPERTY_METADATA_KEY, target);
    const newMap = new Map(oldMap);
    newMap.set(propertyKey, metadata);
    Reflector.defineMetadata(PROJECTION_RULE_PROPERTY_METADATA_KEY, newMap, target);
}
/**
 * Устанавливает метаданные вложения для конкретного свойства конструктора.
 * Добавляет или обновляет запись в карте метаданных вложений.
 *
 * @param metadata Метаданные вложения для установки.
 * @param target Конструктор класса, к которому привязываются метаданные.
 * @param propertyKey Ключ свойства, для которого устанавливаются метаданные.
 */
function setProjectionEmbeddingPropertyMetadata(metadata, target, propertyKey) {
    const oldMap = Reflector.getOwnMetadata(PROJECTION_EMBEDDING_PROPERTY_METADATA_KEY, target);
    const newMap = new Map(oldMap);
    newMap.set(propertyKey, metadata);
    Reflector.defineMetadata(PROJECTION_EMBEDDING_PROPERTY_METADATA_KEY, newMap, target);
}
/**
 * Получает список метаданных общих правил проекции для указанного
 * конструктора. Возвращает существующий список или новый пустой
 * список, если метаданные отсутствуют.
 *
 * @param target Конструктор класса для поиска метаданных.
 * @returns Список метаданных правил проекции.
 */
function getProjectionRuleClassMetadataList(target) {
    const metadata = Reflector.getOwnMetadata(PROJECTION_RULE_CLASS_METADATA_KEY, target);
    return metadata ?? [];
}
/**
 * Получает карту метаданных правил проекции для указанного
 * конструктора. Возвращает существующую карту или новую пустую
 * карту, если метаданные отсутствуют.
 *
 * @param target Конструктор класса для поиска метаданных.
 * @returns Карта метаданных правил проекции (свойство => метаданные правила).
 */
function getProjectionRulePropertyMetadataMap(target) {
    const metadata = Reflector.getOwnMetadata(PROJECTION_RULE_PROPERTY_METADATA_KEY, target);
    return metadata ?? new Map();
}
/**
 * Получает карту метаданных вложений для указанного конструктора.
 * Возвращает существующую карту или новую пустую карту,
 * если метаданные отсутствуют.
 *
 * @param target Конструктор класса для поиска метаданных.
 * @returns Карта метаданных вложений (свойство => метаданные вложения).
 */
function getProjectionEmbeddingPropertyMetadataMap(target) {
    const metadata = Reflector.getOwnMetadata(PROJECTION_EMBEDDING_PROPERTY_METADATA_KEY, target);
    return metadata ?? new Map();
}
/**
 * Фабрика декораторов конструктора для установки метаданных правил проекции.
 *
 * @template T Тип объекта (обычно определяется автоматически).
 * @param metadata Метаданные правила для установки.
 * @param decoratorName Имя декоратора (используется в сообщениях об ошибках).
 * @returns Функция декоратора конструктора.
 */
function projectionRuleClassDecorator(metadata, decoratorName = 'projectionRuleClassDecorator') {
    return function (target, propertyKey, descriptor) {
        const decoratorType = getDecoratorTargetType(target, propertyKey, descriptor);
        if (decoratorType !== DecoratorTargetType.CONSTRUCTOR)
            throw new Errorf('@%s decorator is only supported for a class constructor.', decoratorName);
        setProjectionRuleClassMetadata(metadata, target);
    };
}
/**
 * Фабрика декораторов свойств для установки метаданных правил проекции.
 *
 * @template T Тип объекта (обычно определяется автоматически).
 * @param metadata Метаданные правила для установки.
 * @param decoratorName Имя декоратора (используется в сообщениях об ошибках).
 * @returns Функция декоратора свойства.
 */
function projectionRulePropertyDecorator(metadata, decoratorName = 'projectionRulePropertyDecorator') {
    return function (target, propertyKey, descriptor) {
        const decoratorType = getDecoratorTargetType(target, propertyKey, descriptor);
        const targetCtor = typeof target === 'object'
            ? target.constructor
            : target;
        if (decoratorType !== DecoratorTargetType.INSTANCE_PROPERTY)
            throw new Errorf('@%s decorator is only supported for an instance property.', decoratorName);
        setProjectionRulePropertyMetadata(metadata, targetCtor, propertyKey);
    };
}
/**
 * Фабрика декораторов свойств для установки метаданных вложений.
 *
 * @template T Тип объекта (обычно определяется автоматически).
 * @param metadata Метаданные вложения для установки.
 * @param decoratorName Имя декоратора (используется в сообщениях об ошибках).
 * @returns Функция декоратора свойства.
 */
function projectionEmbeddingPropertyDecorator(metadata, decoratorName = 'projectionEmbeddingPropertyDecorator') {
    return function (target, propertyKey, descriptor) {
        const decoratorType = getDecoratorTargetType(target, propertyKey, descriptor);
        const targetCtor = typeof target === 'object'
            ? target.constructor
            : target;
        if (decoratorType !== DecoratorTargetType.INSTANCE_PROPERTY)
            throw new Errorf('@%s decorator is only supported for an instance property.', decoratorName);
        setProjectionEmbeddingPropertyMetadata(metadata, targetCtor, propertyKey);
    };
}
/**
 * Декоратор класса: помечает все свойства класса как скрытые для области
 * INPUT. Обычно используется для классов, свойства которого не должны
 * приниматься от клиента (например, пароли).
 *
 * @returns Функция декоратора класса.
 */
export function lockedProperties() {
    return projectionRuleClassDecorator({ scope: ProjectionScope.INPUT, rule: ProjectionRule.HIDE }, 'lockedProperties');
}
/**
 * Декоратор класса: помечает все свойства класса как скрытые для области
 * OUTPUT. Обычно используется для классов, свойства которого не должны
 * отправляться клиенту (например, пароль пользователя).
 *
 * @returns Функция декоратора класса.
 */
export function hiddenProperties() {
    return projectionRuleClassDecorator({ scope: ProjectionScope.OUTPUT, rule: ProjectionRule.HIDE }, 'hiddenProperties');
}
/**
 * Декоратор свойства: явно помечает свойство как видимое (разрешенное)
 * для области INPUT. Может использоваться для переопределения
 * правила HIDE, установленного декоратором класса @lockedProperties.
 *
 * @returns Функция декоратора свойства.
 */
export function writableProperty() {
    return projectionRulePropertyDecorator({ scope: ProjectionScope.INPUT, rule: ProjectionRule.SHOW }, 'writableProperty');
}
/**
 * Декоратор свойства: помечает свойство как скрытое для области INPUT.
 * Обычно используется для свойств, которые не должны приниматься
 * от клиента (например, пароли).
 *
 * @returns Функция декоратора свойства.
 */
export function lockedProperty() {
    return projectionRulePropertyDecorator({ scope: ProjectionScope.INPUT, rule: ProjectionRule.HIDE }, 'lockedProperty');
}
/**
 * Декоратор свойства: явно помечает свойство как видимое (разрешенное)
 * для области OUTPUT. Может использоваться для переопределения
 * правила HIDE, установленного декоратором класса @hiddenProperties.
 *
 * @returns Функция декоратора свойства.
 */
export function visibleProperty() {
    return projectionRulePropertyDecorator({ scope: ProjectionScope.OUTPUT, rule: ProjectionRule.SHOW }, 'visibleProperty');
}
/**
 * Декоратор свойства: помечает свойство как скрытое для области OUTPUT.
 * Обычно используется для свойств, которые не должны отправляться
 * клиенту (например, внутренние заметки).
 *
 * @returns Функция декоратора свойства.
 */
export function hiddenProperty() {
    return projectionRulePropertyDecorator({ scope: ProjectionScope.OUTPUT, rule: ProjectionRule.HIDE }, 'hiddenProperty');
}
/**
 * Декоратор свойства: помечает свойство как содержащее вложенную модель,
 * к которой также должны применяться правила проекции.
 *
 * @param model Фабричная функция, возвращающая конструктор вложенной
 *   модели. Использование фабрики (`() => RelatedModel`) позволяет обойти
 *   циклические зависимости.
 * @returns Функция декоратора свойства.
 */
export function isEmbedded(model) {
    return projectionEmbeddingPropertyDecorator({ model }, 'isEmbedded');
}
/**
 * Применяет правила проекции к объекту или массиву объектов,
 * удаляя или рекурсивно обрабатывая поля на основе метаданных модели.
 * Не модифицирует исходные данные.
 *
 * @param scope Область применения правил (INPUT или OUTPUT).
 * @param model Конструктор класса модели с метаданными проекции.
 * @param data Объект или массив объектов для обработки.
 * @returns Новый объект или массив объектов с примененными
 *   правилами проекции, или исходное значение, если data не объект/массив.
 */
function _applyProjectionInternal(scope, model, data) {
    // если данные не являются объектом или массивом,
    // то аргумент возвращается без изменений
    if (data === null || typeof data !== 'object') {
        return data;
    }
    // если данные являются массивом, то выполняется
    // рекурсивная обработка каждого элемента с учетом
    // иммутабельности аргументов
    if (Array.isArray(data)) {
        return data.map(item => _applyProjectionInternal(scope, model, item));
    }
    // извлечение карты метаданных правил и встроенных
    // моделей для указанного конструктора
    const classRules = getProjectionRuleClassMetadataList(model);
    const propertyRuleMap = getProjectionRulePropertyMetadataMap(model);
    const embeddingMap = getProjectionEmbeddingPropertyMetadataMap(model);
    // создание неглубокой копии объекта
    // для сохранения иммутабельности
    const result = { ...data };
    // фильтрация каждого ключа результирующего
    // объекта согласно метаданным модели
    for (const key in result) {
        // если ключ не принадлежит объекту,
        // то свойство остается без изменений
        if (!Object.prototype.hasOwnProperty.call(result, key)) {
            continue;
        }
        // определение эффективного правила для текущего ключа
        // и области проекции, с учетом приоритета правила
        // свойств над общими правилами
        let effectiveRule = ProjectionRule.SHOW;
        const propertyRuleMeta = propertyRuleMap.get(key);
        if (propertyRuleMeta && propertyRuleMeta.scope === scope) {
            effectiveRule = propertyRuleMeta.rule;
        }
        else {
            // поиск общего правила для текущей области проекции
            // выполняется с конца, чтобы последнее примененное
            // правило имело приоритет
            const classRuleMeta = classRules
                .slice()
                .reverse()
                .find(rule => rule.scope === scope);
            if (classRuleMeta)
                effectiveRule = classRuleMeta.rule;
            // если правило не найдено, то остается
            // значение по умолчанию SHOW
        }
        const shouldHide = effectiveRule === ProjectionRule.HIDE;
        // если найдено правило HIDE в текущей
        // области проекции, то свойство удаляется
        if (shouldHide) {
            delete result[key];
        }
        // если свойство не скрыто, то проверяется
        // наличие вложенной модели и выполнение
        // рекурсивной проекции при ее наличии
        else {
            const embeddingMeta = embeddingMap.get(key);
            // если определены метаданные вложенной модели,
            // то выполняется рекурсивная проекция
            if (embeddingMeta) {
                // извлечение конструктора вложенной
                // модели и значения данного свойства
                const embeddedModelConstructor = embeddingMeta.model();
                const embeddedValue = result[key];
                // применяется рекурсивная проекция к вложенному
                // значению и обновление данного свойства
                // в результирующем объекте
                result[key] = _applyProjectionInternal(scope, embeddedModelConstructor, embeddedValue);
            }
            // если свойство не скрыто и не является
            // вложенным, то свойство остается
            // без изменений
        }
    }
    return result;
}
// функция-реализация для обработки
// двух перегрузок
export function applyProjection(scopeOrModel, modelOrData, data) {
    let scope;
    let model;
    let actualData;
    // определение вызываемой перегрузки используя
    // проверку первого или наличие третьего аргумента
    const isThreeArgCall = typeof scopeOrModel === 'string';
    // вызов с тремя аргументами:
    // applyProjection(scope, model, data)
    if (isThreeArgCall) {
        scope = scopeOrModel;
        model = modelOrData;
        actualData = data;
    }
    // вызов с двумя аргументами:
    // applyProjection(model, data)
    else {
        scope = ProjectionScope.OUTPUT;
        model = scopeOrModel;
        actualData = modelOrData;
    }
    // вызываем внутренней функции
    // с определенными параметрами
    return _applyProjectionInternal(scope, model, actualData);
}
