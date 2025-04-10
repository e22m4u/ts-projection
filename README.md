# @e22m4u/ts-projection

Модуль для управления проекцией данных в TypeScript, позволяющий легко
скрывать или показывать поля объектов на основе предопределенных правил.
Идеально подходит для формирования данных API ответов, скрывая внутренние
или чувствительные поля. Использует декораторы TypeScript для определения
правил видимости.

      
# Содержание

* [Установка](#установка)
  * [Поддержка декораторов](#поддержка-декораторов)
* [Базовое использование](#базовое-использование)
* [Область проекции INPUT](#область-проекции-input)
* [Белый список](#белый-список)
* [Вложенные модели](#вложенные-модели)
* [API Справка](#api-справка)
  * [Перечисления](#перечисления)
  * [Декораторы](#декораторы)
  * [Функции](#функции)
* [Тесты](#тесты)
* [Лицензия](#лицензия)

## Установка

```bash
npm install @e22m4u/ts-projection
```

#### Поддержка декораторов

Для включения поддержки декораторов, добавьте указанные
ниже опции в файл `tsconfig.json` вашего проекта.

```json
{
  "emitDecoratorMetadata": true,
  "experimentalDecorators": true
}
```

## Базовое использование

Скрытие пароля пользователя перед отправкой данных клиенту.

**1. Определение модели пользователя с декоратором:**

Используйте декоратор `@hiddenProperty()` на свойстве `password`.

```typescript
import {hiddenProperty} from '@e22m4u/ts-projection';
import {applyProjection} from '@e22m4u/ts-projection';

class User {
  name: string;
  surname: string;

  // свойство содержащее пароль
  // будет скрыто на проекции
  @hiddenProperty()
  password: string;

  constructor(name: string, surname: string, password: string) {
    this.name = name;
    this.surname = surname;
    this.password = password;
  }
}
```

**2. Применение проекции:**

Вызов функции `applyProjection` с двумя аргументами создаст новый объект
исключающий свойства помеченные декоратором `@hiddenProperty()`.

```typescript
const user = new User('Alice', 'Smith', 'myPass');

// применение проекции (скроет password)
const userForApi = applyProjection(User, user);
console.log(userForApi);
// {
//   name: 'Alice'
//   surname: 'Smith',
// }

// исходный объект пользователя не изменился
console.log(user);
// {
//   name: 'Alice',
//   surname: 'Smith',
//   password: 'myPass'
// }
```

Поле `password`, помеченное `@hiddenProperty()`, было удалено
из результирующего объекта, что делает отправку данных клиенту
более безопасной.

## Область проекции `INPUT`

В базовом примере мы неявно работали в области проекции `OUTPUT` (вывод данных),
которая используется по умолчанию функцией `applyProjection` при вызове с двумя
аргументами. Эта область хорошо подходит для фильтрации данных *перед отправкой*
пользователю.

Однако часто возникает необходимость отфильтровать данные, *получаемые*
от пользователя, например, чтобы запретить ему изменять определенные поля
(статус блокировки, роль и т.д.). Для этого существует область
проекции `INPUT`.

**Пример с `INPUT` областью:**

Дополним наш класс `User`, добавив поле `isBlocked`, которое пользователь
не должен устанавливать через API. Мы также оставим скрытие пароля для вывода.

**1. Модификация модели `User`:**

Используем `@lockedProperty()` для `isBlocked`.

```typescript
import {hiddenProperty} from '@e22m4u/ts-projection';
import {lockedProperty} from '@e22m4u/ts-projection';
import {applyProjection} from '@e22m4u/ts-projection';
import {ProjectionScope} from '@e22m4u/ts-projection';

class User {
  name: string;
  surname: string;

  @hiddenProperty() // запрет для ВЫВОДА (нельзя получить через API)
  password: string;

  @lockedProperty() // запрет для ВВОДА (нельзя установить через API)
  isBlocked: boolean;

  constructor(
    name: string,
    surname: string,
    password: string,
    isBlocked: boolean = false,
  ) {
    this.name = name;
    this.surname = surname;
    this.password = password;
    this.isBlocked = isBlocked;
  }
}
```

**2. Фильтрация входных данных:**

Представим, что мы получили данные от пользователя, и он попытался
установить `isBlocked`. Мы используем `applyProjection` с тремя аргументами,
явно указав `ProjectionScope.INPUT`.

```typescript
// гипотетические данные, полученные из API запроса
const incomingData = {
  name: 'Bob',
  surname: 'Smith',
  password: 'myPass',
  isBlocked: true, // пользователь пытается заблокировать себя или другого
};

// применение проекции для INPUT области
const safeDataToProcess = applyProjection(
  ProjectionScope.INPUT,
  User,
  incomingData,
);

console.log(safeDataToProcess);
// {
//   name: 'Bob',
//   surname: 'Smith',
//   password: 'myPass'
// }
// поле isBlocked было удалено благодаря @lockedProperty()
// password остался, т.к. @hiddenProperty() скрывает только для OUTPUT

// Обратите внимание: password не был удален, т.к. @hiddenProperty()
// действует только для OUTPUT scope. Если вы не хотите принимать и его,
// добавьте к password также декоратор @lockedProperty().
```

Таким образом, области проекции позволяют гранулярно управлять тем,
какие поля доступны для чтения (`OUTPUT`) и для записи (`INPUT`).

## Белый список

Иногда удобнее не скрывать отдельные поля, а наоборот, скрыть *все* поля
по умолчанию и явно указать только те, которые должны быть видны при выводе
данных. Это можно сделать с помощью декоратора класса `@hiddenProperties()`
и декоратора свойства `@visibleProperty()`.

**1. Модификация модели `User`:**

Применяем `@hiddenProperties()` к классу и `@visibleProperty()`
к полям `name` и `surname`, которые мы хотим видеть в ответе.
Добавим поле `surname`.

```typescript
import {
  hiddenProperties, // скрыть всё по умолчанию для OUTPUT
  visibleProperty,  // явно показать это свойство для OUTPUT
  lockedProperty,   // правила для INPUT остаются
  applyProjection,
  ProjectionScope
} from '@e22m4u/ts-projection';

@hiddenProperties() // все поля скрыты для OUTPUT по умолчанию
class User {
  @visibleProperty() // показываем name в OUTPUT
  name: string;
  
  @visibleProperty() // показываем surname в OUTPUT
  surname: string;

  // password не будет виден в OUTPUT (т.к. нет @visibleProperty),
  // и он также скрыт для INPUT
  @lockedProperty()
  password: string;

  // isBlocked не будет виден в OUTPUT (т.к. нет @visibleProperty),
  // и он также скрыт для INPUT
  @lockedProperty()
  isBlocked: boolean;

  constructor(
    name: string,
    surname: string,
    password: string,
    isBlocked: boolean = false,
  ) {
    this.name = name;
    this.surname = surname;
    this.password = password;
    this.isBlocked = isBlocked;
  }
}
```

Правила, установленные для конкретного свойства, имеют приоритет над общими
правилами, установленными для класса, в рамках одной и той же области
проекции (`INPUT` или `OUTPUT`).

**2. Применение проекции (для вывода):**

Используем вызов с двумя аргументами, так как `@hiddenProperties`
и `@visibleProperty` работают в области `OUTPUT`, которая используется
по умолчанию.

```typescript
const user = new User('Alice', 'Smith', 'myPass', false);

// применение проекции (OUTPUT по умолчанию)
const userForApi = applyProjection(User, user);

console.log(userForApi);
// {
//   name: 'Alice',
//   surname: 'Smith'
// }
// поля password и isBlocked отсутствуют, как и ожидалось

// проверка INPUT области для сравнения
const userInputData = {
  name: 'Bob',
  surname: 'Jones',
  password: 'myPass',
  isBlocked: true,
};

const safeUserInput = applyProjection(
  ProjectionScope.INPUT,
  User,
  userInputData,
);
console.log(safeUserInput);
// {
//   name: 'Bob',
//   surname: 'Jones'
// }
// password и isBlocked скрыты для INPUT декораторами @lockedProperty
```

Этот подход "белого списка" может быть очень удобен для
DTO (Data Transfer Objects), где вы хотите явно контролировать,
какие именно поля будут доступны во внешнем API, минимизируя
риск случайной утечки данных.

## Вложенные модели

Часто свойства модели содержат вложенные объекты (например, пользователь имеет
профиль или адрес). Данный модуль позволяет применять правила проекции
рекурсивно к таким вложенным объектам с помощью декоратора `@isEmbedded`.

**1. Определение модели:**

Создадим модель `Profile` с собственными правилами проекции и модель `User`,
которая содержит `Profile`.

```typescript
import {
  isEmbedded,      // определение вложенной модели
  hiddenProperty,  // исключение свойства для вывода
  lockedProperty,  // исключение свойства для ввода
  applyProjection,
  ProjectionScope
} from '@e22m4u/ts-projection';

// модель профиля
class Profile {
  city: string;
  address: string;

  @lockedProperty() // запрет для INPUT
  reputation: number;

  @hiddenProperty() // запрет для OUTPUT
  inviter: string;

  constructor(
    city: string,
    address: string,
    inviter: string,
    reputation: number,
  ) {
    this.city = city;
    this.address = address;
    this.reputation = reputation;
    this.inviter = inviter;
  }
}

// модель пользователя
class User {
  name: string;
  surname: string;
  
  @lockedProperty() // запрет для INPUT
  status: string;

  @hiddenProperty() // запрет для OUTPUT
  password: string;

  @isEmbedded(() => Profile) // определение вложенной модели
  profile: Profile;

  constructor(
    name: string,
    surname: string,
    status: string,
    password: string,
    profile: Profile,
  ) {
    this.name = name;
    this.surname = surname;
    this.status = status;
    this.password = password;
    this.profile = profile;
  }
}
```

**Важно:** В `@isEmbedded(() => Profile)` используется функция-фабрика
`() => Profile`. Это необходимо для корректной работы, если между `User`
и `Profile` могут возникать циклические зависимости при импорте модулей
в TypeScript.

**2. Применение проекции:**

Создадим экземпляры и применим `applyProjection` для разных областей проекции.

```typescript
const userProfile = new Profile('Москва', 'ул. Тверская, 1', 'Admin', 100);
const user = new User('Tommy', 'Smith', 'active', 'myPass', userProfile);

// фильтрация отдаваемых данных (проекция для OUTPUT)
const userOutput = applyProjection(User, user);
console.log(userOutput);
// {
//   name: 'Tommy',
//   surname: 'Smith',
//   status: 'active',             // виден в OUTPUT
//   profile: {
//     city: 'Москва',
//     address: 'ул. Тверская, 1',
//     reputation: 100             // виден в OUTPUT
//   }
// }
//
// password скрыт декоратором @hiddenProperty в User
// profile.inviter скрыт декоратором @hiddenProperty в Profile

// принимаемые данные
const incomingUserData = {
  name: 'John',
  surname: 'Doe',
  status: 'vip',                // попытка установить статус
  password: 'newPassword',      // установка нового пароля
  profile: {
    city: 'Санкт-Петербург',
    address: 'Невский пр., 10',
    reputation: 999,            // попытка установить репутацию
    inviter: 'Hacker',          // установка инвайтера
  }
};

// фильтрация принимаемых данных (проекция для INPUT)
const safeUserInput = applyProjection(
  ProjectionScope.INPUT,
  User,
  incomingUserData,
);
console.log(safeUserInput);
// {
//   name: 'John',
//   surname: 'Doe',
//   password: 'newPassword',      // виден в INPUT
//   profile: {
//     city: 'Санкт-Петербург',
//     address: 'Невский пр., 10',
//     inviter: 'Hacker'           // виден в INPUT
//   }
// }
//
// status скрыт декоратором @lockedProperty в User
// profile.reputation скрыт декоратором @lockedProperty в Profile
```

Как видно из примеров, `applyProjection` автоматически "погружается" в объекты,
помеченные `@isEmbedded`, и применяет к ним правила проекции, определенные
в их собственном классе (`Profile`), учитывая текущую область проекции
(`scope`). Это позволяет легко управлять сложными структурами данных.

## API Справка

### Перечисления

* `ProjectionScope`
  * `INPUT`
  * `OUTPUT`
* `ProjectionRule`
  * `HIDE`
  * `SHOW`

### Декораторы

* **Класса:**
  * `@lockedProperties()`: применяет `HIDE` для `INPUT`;
  * `@hiddenProperties()`: применяет `HIDE` для `OUTPUT`;
* **Свойства (для INPUT):**
  * `@lockedProperty()`: применяет `HIDE` для `INPUT`;
  * `@writableProperty()`: применяет `SHOW` для `INPUT`;
* **Свойства (для OUTPUT):**
  * `@hiddenProperty()`: применяет `HIDE` для `OUTPUT`;
  * `@visibleProperty()`: применяет `SHOW` для `OUTPUT`;
* **Свойства (структурный):**
  * `@isEmbedded(modelFactory: () => Constructor)`:  
  *\- помечает вложенную модель для рекурсивной обработки;*

### Функции

* `applyProjection<T>(model: Constructor, data: T): T`  
  *\- Применяет проекцию `OUTPUT` (по умолчанию);*
* `applyProjection<T>(scope: ProjectionScope, model: Constructor, data: T): T`  
  *\- Применяет проекцию для указанного `scope`;*

Функция `applyProjection` всегда возвращает новый объект или массив,
не модифицируя исходные данные. Обрабатывает примитивы, `null`, `undefined`,
возвращая их без изменений.

## Тесты

```bash
npm run test
```

## Лицензия

MIT
