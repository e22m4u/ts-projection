/* eslint mocha/no-setup-in-describe: 0 */
/* eslint @typescript-eslint/no-explicit-any: 0 */
import 'mocha';
import 'reflect-metadata';
import {expect} from 'chai';
import {isEmbedded} from './projection.js';
import {hiddenProperty} from './projection.js';
import {lockedProperty} from './projection.js';
import {visibleProperty} from './projection.js';
import {ProjectionScope} from './projection.js';
import {applyProjection} from './projection.js';
import {lockedProperties} from './projection.js';
import {hiddenProperties} from './projection.js';
import {writableProperty} from './projection.js';

// --- Определим тестовые модели ---

// 1. Простая модель с базовыми правилами свойств
class SimpleModel {
  public id: number;
  @lockedProperty() // Скрыт для INPUT
  public secretInput: string;
  @hiddenProperty() // Скрыт для OUTPUT
  public secretOutput: string;
  public commonData: string;

  constructor(id: number, si: string, so: string, cd: string) {
    this.id = id;
    this.secretInput = si;
    this.secretOutput = so;
    this.commonData = cd;
  }
}

// 2. Модель со скрытием всех свойств для OUTPUT на уровне класса
@hiddenProperties()
class HiddenOutputModel {
  public id: number;
  public data: string;
  // Свойство с явным разрешением для OUTPUT
  @visibleProperty()
  public visibleId: number;

  constructor(id: number, data: string, vid: number) {
    this.id = id;
    this.data = data;
    this.visibleId = vid;
  }
}

// 3. Модель со скрытием всех свойств для INPUT на уровне класса
@lockedProperties()
class LockedInputModel {
  public id: number;
  public data: string;
  // Свойство с явным разрешением для INPUT
  @writableProperty()
  public writableData: string;

  constructor(id: number, data: string, wd: string) {
    this.id = id;
    this.data = data;
    this.writableData = wd;
  }
}

// 4. Вложенная модель
class Address {
  public street: string;
  @hiddenProperty() // Скрыт для OUTPUT
  public zipCode: string;
  @lockedProperty() // Скрыт для INPUT
  public internalCode: string;

  constructor(street: string, zip: string, ic: string) {
    this.street = street;
    this.zipCode = zip;
    this.internalCode = ic;
  }
}

// 5. Модель с вложением
class UserWithAddress {
  public id: number;
  @lockedProperty() // Скрыт для INPUT
  public passwordHash: string;
  @hiddenProperty() // Скрыт для OUTPUT
  public sessionToken: string;
  @isEmbedded(() => Address) // Указываем, что это вложение
  public address: Address;

  constructor(id: number, pw: string, st: string, addr: Address) {
    this.id = id;
    this.passwordHash = pw;
    this.sessionToken = st;
    this.address = addr;
  }
}

// --- Начинаем тесты ---

describe('applyProjection Function', function () {
  describe('Basic Scopes and Property Rules', function () {
    const input = new SimpleModel(1, 'in_secret', 'out_secret', 'common');
    const originalInput = {...input}; // Для проверки иммутабельности

    it('should hide @lockedProperty in INPUT scope', function () {
      const result = applyProjection(ProjectionScope.INPUT, SimpleModel, input);
      expect(result).to.deep.equal({
        id: 1,
        secretOutput: 'out_secret', // Не скрыто в INPUT
        commonData: 'common',
      });
      expect(result).not.to.have.property('secretInput');
      expect(result).not.to.equal(input); // Проверка иммутабельности
      expect(input).to.deep.equal(originalInput); // Проверка, что оригинал не изменился
    });

    it('should hide @hiddenProperty in OUTPUT scope', function () {
      const result = applyProjection(
        ProjectionScope.OUTPUT,
        SimpleModel,
        input,
      );
      expect(result).to.deep.equal({
        id: 1,
        secretInput: 'in_secret', // Не скрыто в OUTPUT
        commonData: 'common',
      });
      expect(result).not.to.have.property('secretOutput');
      expect(result).not.to.equal(input); // Проверка иммутабельности
      expect(input).to.deep.equal(originalInput);
    });

    it('should show all relevant properties in other scopes', function () {
      // В INPUT scope должен быть secretOutput
      const resultInput = applyProjection(
        ProjectionScope.INPUT,
        SimpleModel,
        input,
      );
      expect(resultInput).to.have.property('secretOutput');

      // В OUTPUT scope должен быть secretInput
      const resultOutput = applyProjection(
        ProjectionScope.OUTPUT,
        SimpleModel,
        input,
      );
      expect(resultOutput).to.have.property('secretInput');
    });
  });

  describe('Class Level Rules and Overrides', function () {
    const hiddenOutputInput = new HiddenOutputModel(1, 'data', 101);
    const originalHiddenOutputInput = {...hiddenOutputInput};

    it('should hide all properties by default with @hiddenProperties in OUTPUT scope', function () {
      const result = applyProjection(
        ProjectionScope.OUTPUT,
        HiddenOutputModel,
        hiddenOutputInput,
      );
      // Только visibleId должен остаться, т.к. он помечен @visibleProperty
      expect(result).to.deep.equal({
        visibleId: 101,
      });
      expect(result).not.to.have.property('id');
      expect(result).not.to.have.property('data');
      expect(result).not.to.equal(hiddenOutputInput);
      expect(hiddenOutputInput).to.deep.equal(originalHiddenOutputInput);
    });

    it('should show all properties with @hiddenProperties in INPUT scope', function () {
      const result = applyProjection(
        ProjectionScope.INPUT,
        HiddenOutputModel,
        hiddenOutputInput,
      );
      // В INPUT scope @hiddenProperties не действует
      expect(result).to.deep.equal({
        id: 1,
        data: 'data',
        visibleId: 101,
      });
      expect(result).not.to.equal(hiddenOutputInput);
      expect(hiddenOutputInput).to.deep.equal(originalHiddenOutputInput);
    });

    const lockedInputInput = new LockedInputModel(2, 'data2', 'writable');
    const originalLockedInputInput = {...lockedInputInput};

    it('should hide all properties by default with @lockedProperties in INPUT scope', function () {
      const result = applyProjection(
        ProjectionScope.INPUT,
        LockedInputModel,
        lockedInputInput,
      );
      // Только writableData должен остаться, т.к. он помечен @writableProperty
      expect(result).to.deep.equal({
        writableData: 'writable',
      });
      expect(result).not.to.have.property('id');
      expect(result).not.to.have.property('data');
      expect(result).not.to.equal(lockedInputInput);
      expect(lockedInputInput).to.deep.equal(originalLockedInputInput);
    });

    it('should show all properties with @lockedProperties in OUTPUT scope', function () {
      const result = applyProjection(
        ProjectionScope.OUTPUT,
        LockedInputModel,
        lockedInputInput,
      );
      // В OUTPUT scope @lockedProperties не действует
      expect(result).to.deep.equal({
        id: 2,
        data: 'data2',
        writableData: 'writable',
      });
      expect(result).not.to.equal(lockedInputInput);
      expect(lockedInputInput).to.deep.equal(originalLockedInputInput);
    });
  });

  describe('Embedded Models', function () {
    const address = new Address('123 Main St', '90210', 'internal1');
    const user = new UserWithAddress(10, 'hash123', 'tokenABC', address);
    const originalUser = JSON.parse(JSON.stringify(user)); // Глубокая копия для вложенности

    it('should apply projection rules recursively in INPUT scope', function () {
      const result = applyProjection(
        ProjectionScope.INPUT,
        UserWithAddress,
        user,
      );
      expect(result).to.deep.equal({
        id: 10,
        sessionToken: 'tokenABC', // Не скрыт в INPUT
        address: {
          street: '123 Main St',
          zipCode: '90210', // Не скрыт в INPUT
          // internalCode скрыт через @lockedProperty в Address
        },
      });
      expect(result).not.to.have.property('passwordHash'); // Скрыт в UserWithAddress
      expect(result.address).not.to.have.property('internalCode'); // Скрыт в Address
      expect(result).not.to.equal(user);
      // Сравниваем с глубокой копией, т.к. result.address - новый объект
      expect(user).to.deep.equal(originalUser);
    });

    it('should apply projection rules recursively in OUTPUT scope', function () {
      const result = applyProjection(
        ProjectionScope.OUTPUT,
        UserWithAddress,
        user,
      );
      expect(result).to.deep.equal({
        id: 10,
        passwordHash: 'hash123', // Не скрыт в OUTPUT
        address: {
          street: '123 Main St',
          // zipCode скрыт через @hiddenProperty в Address
          internalCode: 'internal1', // Не скрыт в OUTPUT
        },
      });
      expect(result).not.to.have.property('sessionToken'); // Скрыт в UserWithAddress
      expect(result.address).not.to.have.property('zipCode'); // Скрыт в Address
      expect(result).not.to.equal(user);
      expect(user).to.deep.equal(originalUser);
    });

    it('should handle null or undefined embedded properties gracefully', function () {
      const userWithNullAddress = new UserWithAddress(
        11,
        'hash456',
        'tokenDEF',
        null as any,
      );
      const result = applyProjection(
        ProjectionScope.OUTPUT,
        UserWithAddress,
        userWithNullAddress,
      );
      expect(result).to.deep.equal({
        id: 11,
        passwordHash: 'hash456',
        address: null, // null должен остаться null
      });
      expect(result).not.to.have.property('sessionToken');
    });
  });

  describe('Array Handling', function () {
    const users = [
      new SimpleModel(1, 'in1', 'out1', 'common1'),
      new SimpleModel(2, 'in2', 'out2', 'common2'),
    ];
    const originalUsers = JSON.parse(JSON.stringify(users));

    it('should apply projection to each element in the array for INPUT scope', function () {
      const result = applyProjection(ProjectionScope.INPUT, SimpleModel, users);
      expect(result).to.be.an('array').with.lengthOf(2);
      expect(result[0]).to.deep.equal({
        id: 1,
        secretOutput: 'out1',
        commonData: 'common1',
      });
      expect(result[1]).to.deep.equal({
        id: 2,
        secretOutput: 'out2',
        commonData: 'common2',
      });
      expect(result).not.to.equal(users); // Новый массив
      expect(users).to.deep.equal(originalUsers); // Исходный не изменен
    });

    it('should apply projection to each element in the array for OUTPUT scope', function () {
      const result = applyProjection(
        ProjectionScope.OUTPUT,
        SimpleModel,
        users,
      );
      expect(result).to.be.an('array').with.lengthOf(2);
      expect(result[0]).to.deep.equal({
        id: 1,
        secretInput: 'in1',
        commonData: 'common1',
      });
      expect(result[1]).to.deep.equal({
        id: 2,
        secretInput: 'in2',
        commonData: 'common2',
      });
      expect(result).not.to.equal(users);
      expect(users).to.deep.equal(originalUsers);
    });

    it('should return an empty array if input is an empty array', function () {
      const result = applyProjection(ProjectionScope.OUTPUT, SimpleModel, []);
      expect(result).to.be.an('array').with.lengthOf(0);
    });
  });

  describe('Non-Object Handling', function () {
    it('should return null if input is null', function () {
      const result = applyProjection(ProjectionScope.OUTPUT, SimpleModel, null);
      expect(result).to.be.null;
    });

    it('should return undefined if input is undefined', function () {
      const result = applyProjection(
        ProjectionScope.OUTPUT,
        SimpleModel,
        undefined,
      );
      expect(result).to.be.undefined;
    });

    it('should return primitives unchanged', function () {
      expect(
        applyProjection(ProjectionScope.OUTPUT, SimpleModel, 123),
      ).to.equal(123);
      expect(
        applyProjection(ProjectionScope.OUTPUT, SimpleModel, 'string'),
      ).to.equal('string');
      expect(
        applyProjection(ProjectionScope.OUTPUT, SimpleModel, true),
      ).to.equal(true);
    });
  });

  // --- Новый блок тестов для перегрузки ---
  describe('Function Overloads', function () {
    // Используем SimpleModel, так как у него разные правила для INPUT и OUTPUT
    const inputData = new SimpleModel(
      100,
      'input_secret',
      'output_secret',
      'common_value',
    );
    const originalInputData = {...inputData};

    it('should default to ProjectionScope.OUTPUT when called with two arguments', function () {
      // Вызываем с двумя аргументами
      const resultTwoArgs = applyProjection(SimpleModel, inputData);

      // Проверяем, что результат соответствует OUTPUT scope
      // (secretOutput должен быть скрыт, secretInput - нет)
      expect(resultTwoArgs).to.deep.equal({
        id: 100,
        secretInput: 'input_secret',
        commonData: 'common_value',
      });
      expect(resultTwoArgs).not.to.have.property('secretOutput');
      expect(resultTwoArgs).to.have.property('secretInput');

      // Дополнительно сравним с явным вызовом OUTPUT для уверенности
      const resultOutputExplicit = applyProjection(
        ProjectionScope.OUTPUT,
        SimpleModel,
        inputData,
      );
      expect(resultTwoArgs).to.deep.equal(resultOutputExplicit);

      // Проверка иммутабельности
      expect(resultTwoArgs).not.to.equal(inputData);
      expect(inputData).to.deep.equal(originalInputData);
    });

    it('should use ProjectionScope.INPUT when called with three arguments and INPUT scope', function () {
      // Вызываем с тремя аргументами и INPUT
      const resultInputExplicit = applyProjection(
        ProjectionScope.INPUT,
        SimpleModel,
        inputData,
      );

      // Проверяем, что результат соответствует INPUT scope
      // (secretInput должен быть скрыт, secretOutput - нет)
      expect(resultInputExplicit).to.deep.equal({
        id: 100,
        secretOutput: 'output_secret',
        commonData: 'common_value',
      });
      expect(resultInputExplicit).not.to.have.property('secretInput');
      expect(resultInputExplicit).to.have.property('secretOutput');

      // Проверка иммутабельности
      expect(resultInputExplicit).not.to.equal(inputData);
      expect(inputData).to.deep.equal(originalInputData);
    });

    it('should use ProjectionScope.OUTPUT when called with three arguments and OUTPUT scope', function () {
      // Вызываем с тремя аргументами и OUTPUT
      const resultOutputExplicit = applyProjection(
        ProjectionScope.OUTPUT,
        SimpleModel,
        inputData,
      );

      // Проверяем, что результат соответствует OUTPUT scope
      // (secretOutput должен быть скрыт, secretInput - нет)
      expect(resultOutputExplicit).to.deep.equal({
        id: 100,
        secretInput: 'input_secret',
        commonData: 'common_value',
      });
      expect(resultOutputExplicit).not.to.have.property('secretOutput');
      expect(resultOutputExplicit).to.have.property('secretInput');

      // Проверка иммутабельности
      expect(resultOutputExplicit).not.to.equal(inputData);
      expect(inputData).to.deep.equal(originalInputData);
    });
  });
});
