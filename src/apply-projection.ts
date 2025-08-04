import {Constructor} from './types.js';
import {ProjectionRule} from './projection.js';
import {ProjectionScope} from './projection.js';
import {ProjectionRuleReflector} from './decorators/index.js';
import {EmbeddedProjectionReflector} from './decorators/index.js';

/**
 * Применяет правила проекции OUTPUT к объекту или массиву объектов,
 * удаляя или рекурсивно обрабатывая поля на основе метаданных модели.
 * Не модифицирует исходные данные.
 *
 * @param model Конструктор класса модели с метаданными проекции.
 * @param data Объект или массив объектов для обработки.
 *
 * @returns Новый объект или массив объектов с примененными правилами
 *   проекции OUTPUT, или исходное значение, если data не объект/массив.
 */
export function applyProjection<T>(model: Constructor, data: T): T;

/**
 * Применяет правила проекции к объекту или массиву объектов для указанной
 * области, удаляя или рекурсивно обрабатывая поля на основе метаданных модели.
 * Не модифицирует исходные данные.
 *
 * @param scope Область применения правил (INPUT или OUTPUT).
 * @param model Конструктор класса модели с метаданными проекции.
 * @param data Объект или массив объектов для обработки.
 *
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
  let inputData: T;
  // определение вызываемой перегрузки используя
  // проверку первого или наличие третьего аргумента
  const isThreeArgCall = typeof scopeOrModel === 'string';
  // вызов с тремя аргументами:
  // applyProjection(scope, model, data)
  if (isThreeArgCall) {
    scope = scopeOrModel as ProjectionScope;
    model = modelOrData as Constructor;
    inputData = data as T;
  }
  // вызов с двумя аргументами:
  // applyProjection(model, data)
  else {
    scope = ProjectionScope.OUTPUT;
    model = scopeOrModel as Constructor;
    inputData = modelOrData as T;
  }
  // вызываем внутренней функции
  // с определенными параметрами
  return _applyProjection(scope, model, inputData);
}

/**
 * Применяет правила проекции к объекту или массиву объектов,
 * удаляя или рекурсивно обрабатывая поля на основе метаданных
 * модели. Не модифицирует исходные данные.
 *
 * @param scope Область применения правил (INPUT или OUTPUT).
 * @param model Конструктор класса модели с метаданными проекции.
 * @param data Объект или массив объектов для обработки.
 *
 * @returns Новый объект или массив объектов с примененными правилами
 *   проекции, или исходное значение, если data не объект/массив.
 */
function _applyProjection<T>(
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
    return data.map(item => _applyProjection(scope, model, item)) as T;
  }
  // извлечение карты метаданных правил и встроенных
  // моделей для указанного конструктора
  const prClassMetadataList = ProjectionRuleReflector.getClassMetadata(model);
  const prPropertyMetadataMap =
    ProjectionRuleReflector.getPropertiesMetadata(model);
  const epPropertyMetadataMap =
    EmbeddedProjectionReflector.getPropertyMetadata(model);
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
    const prPropertyMetadataList = prPropertyMetadataMap.get(key) ?? [];
    // поиск правила свойства для текущей области проекции
    // выполняется с конца, чтобы последнее примененное
    // правило имело приоритет
    const prPropertyMetadata = prPropertyMetadataList
      .reverse()
      .find(md => md.scope === scope);
    if (prPropertyMetadata) {
      effectiveRule = prPropertyMetadata.rule;
    } else {
      // поиск общего правила для текущей области проекции
      // выполняется с конца, чтобы последнее примененное
      // правило имело приоритет
      const prClassMetadata = prClassMetadataList
        .reverse()
        .find(md => md.scope === scope);
      if (prClassMetadata) effectiveRule = prClassMetadata.rule;
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
      const epPropertyMetadata = epPropertyMetadataMap.get(key);
      // если определены метаданные вложенной модели,
      // то выполняется рекурсивная проекция
      if (epPropertyMetadata) {
        // извлечение конструктора вложенной
        // модели и значения данного свойства
        const embeddedModelCtor = epPropertyMetadata.model();
        const embeddedValue = result[key];
        // применяется рекурсивная проекция к вложенному
        // значению и обновление данного свойства
        // в результирующем объекте
        result[key] = _applyProjection(scope, embeddedModelCtor, embeddedValue);
      }
      // если свойство не скрыто и не является
      // вложенным, то свойство остается
      // без изменений
    }
  }
  return result as T;
}
