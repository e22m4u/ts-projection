import {Prototype} from './types.js';
import {Constructor} from './types.js';
import {Errorf} from '@e22m4u/js-format';
import {Reflector} from '@e22m4u/ts-reflector';
import {MetadataKey} from '@e22m4u/ts-reflector';
import {DecoratorTargetType} from '@e22m4u/ts-reflector';
import {getDecoratorTargetType} from '@e22m4u/ts-reflector';

/**
 * Определяет область применения правила проекции.
 * - `INPUT`: Правило применяется к входящим данным (например, данные в запросе API).
 * - `OUTPUT`: Правило применяется к исходящим данным (например, данные в ответе API).
 */
export enum ProjectionScope {
  INPUT = 'input',
  OUTPUT = 'output',
}

/**
 * Определяет само правило проекции.
 * - `HIDE`: Свойство должно быть скрыто (удалено) в указанной области (`ProjectionScope`).
 * - `SHOW`: Свойство является видимым в указанной области (`ProjectionScope`).
 */
export enum ProjectionRule {
  HIDE = 'hide',
  SHOW = 'show',
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
export type ProjectionEmbeddingMetadataMap = Map<
  string,
  ProjectionEmbeddingMetadata
>;

/**
 * Ключ метаданных для хранения и извлечения карты
 * метаданных общих правил проекции для конструктора класса.
 */
export const PROJECTION_RULE_CLASS_METADATA_KEY =
  new MetadataKey<ProjectionRuleMetadataList>(
    'dataProjectionRuleClassMetadataKey',
  );

/**
 * Ключ метаданных для хранения и извлечения карты
 * метаданных правил проекции для конструктора класса.
 */
export const PROJECTION_RULE_PROPERTY_METADATA_KEY =
  new MetadataKey<ProjectionRuleMetadataMap>(
    'dataProjectionRulePropertyMetadataKey',
  );

/**
 * Ключ метаданных для хранения и извлечения карты
 * метаданных вложений для конструктора класса.
 */
export const PROJECTION_EMBEDDING_PROPERTY_METADATA_KEY =
  new MetadataKey<ProjectionEmbeddingMetadataMap>(
    'dataProjectionEmbeddingPropertyMetadataKey',
  );

/**
 * Устанавливает метаданные общих правил проекции для конструктора класса.
 * Добавляет или обновляет запись в карте метаданных правил.
 *
 * @param metadata Метаданные общих правил для установки.
 * @param target Конструктор класса, к которому привязываются метаданные.
 */
function setProjectionRuleClassMetadata(
  metadata: ProjectionRuleMetadata,
  target: Constructor,
) {
  const oldList =
    Reflector.getOwnMetadata(PROJECTION_RULE_CLASS_METADATA_KEY, target) ?? [];
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
function setProjectionRulePropertyMetadata(
  metadata: ProjectionRuleMetadata,
  target: Constructor,
  propertyKey: string,
) {
  const oldMap = Reflector.getOwnMetadata(
    PROJECTION_RULE_PROPERTY_METADATA_KEY,
    target,
  );
  const newMap = new Map(oldMap);
  newMap.set(propertyKey, metadata);
  Reflector.defineMetadata(
    PROJECTION_RULE_PROPERTY_METADATA_KEY,
    newMap,
    target,
  );
}

/**
 * Устанавливает метаданные вложения для конкретного свойства конструктора.
 * Добавляет или обновляет запись в карте метаданных вложений.
 *
 * @param metadata Метаданные вложения для установки.
 * @param target Конструктор класса, к которому привязываются метаданные.
 * @param propertyKey Ключ свойства, для которого устанавливаются метаданные.
 */
function setProjectionEmbeddingPropertyMetadata(
  metadata: ProjectionEmbeddingMetadata,
  target: Constructor,
  propertyKey: string,
) {
  const oldMap = Reflector.getOwnMetadata(
    PROJECTION_EMBEDDING_PROPERTY_METADATA_KEY,
    target,
  );
  const newMap = new Map(oldMap);
  newMap.set(propertyKey, metadata);
  Reflector.defineMetadata(
    PROJECTION_EMBEDDING_PROPERTY_METADATA_KEY,
    newMap,
    target,
  );
}

/**
 * Получает список метаданных общих правил проекции для указанного
 * конструктора. Возвращает существующий список или новый пустой
 * список, если метаданные отсутствуют.
 *
 * @param target Конструктор класса для поиска метаданных.
 * @returns Список метаданных правил проекции.
 */
function getProjectionRuleClassMetadataList(
  target: Constructor,
): ProjectionRuleMetadataList {
  const metadata = Reflector.getOwnMetadata(
    PROJECTION_RULE_CLASS_METADATA_KEY,
    target,
  );
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
function getProjectionRulePropertyMetadataMap(
  target: Constructor,
): ProjectionRuleMetadataMap {
  const metadata = Reflector.getOwnMetadata(
    PROJECTION_RULE_PROPERTY_METADATA_KEY,
    target,
  );
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
function getProjectionEmbeddingPropertyMetadataMap(
  target: Constructor,
): ProjectionEmbeddingMetadataMap {
  const metadata = Reflector.getOwnMetadata(
    PROJECTION_EMBEDDING_PROPERTY_METADATA_KEY,
    target,
  );
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
function projectionRuleClassDecorator<T extends object>(
  metadata: ProjectionRuleMetadata,
  decoratorName = 'projectionRuleClassDecorator',
) {
  return function (
    target: Constructor<T>,
    propertyKey?: string,
    descriptor?: PropertyDescriptor,
  ) {
    const decoratorType = getDecoratorTargetType(
      target,
      propertyKey,
      descriptor,
    );
    if (decoratorType !== DecoratorTargetType.CONSTRUCTOR)
      throw new Errorf(
        '@%s decorator is only supported for a class constructor.',
        decoratorName,
      );
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
function projectionRulePropertyDecorator<T extends object>(
  metadata: ProjectionRuleMetadata,
  decoratorName = 'projectionRulePropertyDecorator',
) {
  return function (
    target: Prototype<T>,
    propertyKey: string,
    descriptor?: PropertyDescriptor,
  ) {
    const decoratorType = getDecoratorTargetType(
      target,
      propertyKey,
      descriptor,
    );
    const targetCtor =
      typeof target === 'object'
        ? (target.constructor as Constructor<T>)
        : target;
    if (decoratorType !== DecoratorTargetType.INSTANCE_PROPERTY)
      throw new Errorf(
        '@%s decorator is only supported for an instance property.',
        decoratorName,
      );
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
function projectionEmbeddingPropertyDecorator<T extends object>(
  metadata: ProjectionEmbeddingMetadata,
  decoratorName = 'projectionEmbeddingPropertyDecorator',
) {
  return function (
    target: Constructor<T> | Prototype<T>,
    propertyKey: string,
    descriptor?: PropertyDescriptor,
  ) {
    const decoratorType = getDecoratorTargetType(
      target,
      propertyKey,
      descriptor,
    );
    const targetCtor =
      typeof target === 'object'
        ? (target.constructor as Constructor<T>)
        : target;
    if (decoratorType !== DecoratorTargetType.INSTANCE_PROPERTY)
      throw new Errorf(
        '@%s decorator is only supported for an instance property.',
        decoratorName,
      );
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
  return projectionRuleClassDecorator(
    {scope: ProjectionScope.INPUT, rule: ProjectionRule.HIDE},
    'lockedProperties',
  );
}

/**
 * Декоратор класса: помечает все свойства класса как скрытые для области
 * OUTPUT. Обычно используется для классов, свойства которого не должны
 * отправляться клиенту (например, пароль пользователя).
 *
 * @returns Функция декоратора класса.
 */
export function hiddenProperties() {
  return projectionRuleClassDecorator(
    {scope: ProjectionScope.OUTPUT, rule: ProjectionRule.HIDE},
    'hiddenProperties',
  );
}

/**
 * Декоратор свойства: явно помечает свойство как видимое (разрешенное)
 * для области INPUT. Может использоваться для переопределения
 * правила HIDE, установленного декоратором класса @lockedProperties.
 *
 * @returns Функция декоратора свойства.
 */
export function writableProperty() {
  return projectionRulePropertyDecorator(
    {scope: ProjectionScope.INPUT, rule: ProjectionRule.SHOW},
    'writableProperty',
  );
}

/**
 * Декоратор свойства: помечает свойство как скрытое для области INPUT.
 * Обычно используется для свойств, которые не должны приниматься
 * от клиента (например, пароли).
 *
 * @returns Функция декоратора свойства.
 */
export function lockedProperty() {
  return projectionRulePropertyDecorator(
    {scope: ProjectionScope.INPUT, rule: ProjectionRule.HIDE},
    'lockedProperty',
  );
}

/**
 * Декоратор свойства: явно помечает свойство как видимое (разрешенное)
 * для области OUTPUT. Может использоваться для переопределения
 * правила HIDE, установленного декоратором класса @hiddenProperties.
 *
 * @returns Функция декоратора свойства.
 */
export function visibleProperty() {
  return projectionRulePropertyDecorator(
    {scope: ProjectionScope.OUTPUT, rule: ProjectionRule.SHOW},
    'visibleProperty',
  );
}

/**
 * Декоратор свойства: помечает свойство как скрытое для области OUTPUT.
 * Обычно используется для свойств, которые не должны отправляться
 * клиенту (например, внутренние заметки).
 *
 * @returns Функция декоратора свойства.
 */
export function hiddenProperty() {
  return projectionRulePropertyDecorator(
    {scope: ProjectionScope.OUTPUT, rule: ProjectionRule.HIDE},
    'hiddenProperty',
  );
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
export function isEmbedded(model: () => Constructor) {
  return projectionEmbeddingPropertyDecorator({model}, 'isEmbedded');
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
function _applyProjectionInternal<T>(
  scope: ProjectionScope,
  model: Constructor,
  data: T,
): T {
  // если данные не являются объектом или массивом,
  // то аргумент возвращается без изменений
  if (data === null || typeof data !== 'object') {
    return data;
  }
  // если данные являются массивом, то выполняется
  // рекурсивная обработка каждого элемента с учетом
  // иммутабельности аргументов
  if (Array.isArray(data)) {
    return data.map(item => _applyProjectionInternal(scope, model, item)) as T;
  }
  // извлечение карты метаданных правил и встроенных
  // моделей для указанного конструктора
  const classRules = getProjectionRuleClassMetadataList(model);
  const propertyRuleMap = getProjectionRulePropertyMetadataMap(model);
  const embeddingMap = getProjectionEmbeddingPropertyMetadataMap(model);
  // создание неглубокой копии объекта
  // для сохранения иммутабельности
  const result = {...data};
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
    let effectiveRule: ProjectionRule = ProjectionRule.SHOW;
    const propertyRuleMeta = propertyRuleMap.get(key);
    if (propertyRuleMeta && propertyRuleMeta.scope === scope) {
      effectiveRule = propertyRuleMeta.rule;
    } else {
      // поиск общего правила для текущей области проекции
      // выполняется с конца, чтобы последнее примененное
      // правило имело приоритет
      const classRuleMeta = classRules
        .slice()
        .reverse()
        .find(rule => rule.scope === scope);
      if (classRuleMeta) effectiveRule = classRuleMeta.rule;
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
        result[key] = _applyProjectionInternal(
          scope,
          embeddedModelConstructor,
          embeddedValue,
        );
      }
      // если свойство не скрыто и не является
      // вложенным, то свойство остается
      // без изменений
    }
  }
  return result as T;
}

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
export function applyProjection<T>(model: Constructor, data: T): T;

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
export function applyProjection<T>(
  scope: ProjectionScope,
  model: Constructor,
  data: T,
): T;

// функция-реализация для обработки
// двух перегрузок
export function applyProjection<T>(
  scopeOrModel: ProjectionScope | Constructor,
  modelOrData: Constructor | T,
  data?: T,
): T {
  let scope: ProjectionScope;
  let model: Constructor;
  let actualData: T;
  // определение вызываемой перегрузки используя
  // проверку первого или наличие третьего аргумента
  const isThreeArgCall = typeof scopeOrModel === 'string';
  // вызов с тремя аргументами:
  // applyProjection(scope, model, data)
  if (isThreeArgCall) {
    scope = scopeOrModel as ProjectionScope;
    model = modelOrData as Constructor;
    actualData = data as T;
  }
  // вызов с двумя аргументами:
  // applyProjection(model, data)
  else {
    scope = ProjectionScope.OUTPUT;
    model = scopeOrModel as Constructor;
    actualData = modelOrData as T;
  }
  // вызываем внутренней функции
  // с определенными параметрами
  return _applyProjectionInternal(scope, model, actualData);
}
