/* eslint mocha/no-setup-in-describe: 0 */
/* eslint @typescript-eslint/no-explicit-any: 0 */
import 'mocha';
import 'reflect-metadata';
import {expect} from 'chai';
import {noInput} from './decorators/index.js';
import {noOutput} from './decorators/index.js';
import {ProjectionScope} from './projection.js';
import {isEmbedded} from './decorators/index.js';
import {allowInput} from './decorators/index.js';
import {allowOutput} from './decorators/index.js';
import {applyProjection} from './apply-projection.js';

/**
 * Простая модель с базовыми правилами свойств.
 */
class SimpleModel {
  public id: number;
  @noInput() // скрыт для INPUT
  public secretInput: string;
  @noOutput() // скрыт для OUTPUT
  public secretOutput: string;
  public commonData: string;

  constructor(id: number, si: string, so: string, cd: string) {
    this.id = id;
    this.secretInput = si;
    this.secretOutput = so;
    this.commonData = cd;
  }
}

/**
 * Модель со скрытием всех свойств для OUTPUT на уровне класса.
 */
@noOutput()
class NoOutputModel {
  public id: number;
  public data: string;
  // свойство с явным разрешением для OUTPUT
  @allowOutput()
  public visibleId: number;

  constructor(id: number, data: string, vid: number) {
    this.id = id;
    this.data = data;
    this.visibleId = vid;
  }
}

/**
 * Модель со скрытием всех свойств для INPUT на уровне класса.
 */
@noInput()
class NoInputModel {
  public id: number;
  public data: string;
  // свойство с явным разрешением для INPUT
  @allowInput()
  public writableData: string;

  constructor(id: number, data: string, wd: string) {
    this.id = id;
    this.data = data;
    this.writableData = wd;
  }
}

/**
 * Встраиваемая модель.
 */
class Address {
  public street: string;
  @noOutput() // скрыт для OUTPUT
  public zipCode: string;
  @noInput() // скрыт для INPUT
  public internalCode: string;

  constructor(street: string, zip: string, ic: string) {
    this.street = street;
    this.zipCode = zip;
    this.internalCode = ic;
  }
}

/**
 * Модель с вложением.
 */
class UserWithAddress {
  public id: number;
  @noInput() // скрыт для INPUT
  public passwordHash: string;
  @noOutput() // скрыт для OUTPUT
  public sessionToken: string;
  @isEmbedded(() => Address) // вложение
  public address: Address;

  constructor(id: number, pw: string, st: string, addr: Address) {
    this.id = id;
    this.passwordHash = pw;
    this.sessionToken = st;
    this.address = addr;
  }
}

class ExtendedSimpleModel extends SimpleModel {}
class ExtendedNoOutputModel extends NoOutputModel {}
class ExtendedNoInputModel extends NoInputModel {}
class ExtendedUserWithAddress extends UserWithAddress {}

describe('applyProjection function', function () {
  describe('property level rules', function () {
    const input = new SimpleModel(1, 'in_secret', 'out_secret', 'common');
    const originalInput = {...input}; // для проверки иммутабельности

    it('should hide @noInput in INPUT scope', function () {
      const result = applyProjection(ProjectionScope.INPUT, SimpleModel, input);
      expect(result).to.deep.equal({
        id: 1,
        secretOutput: 'out_secret', // не скрыто в INPUT
        commonData: 'common',
      });
      expect(result).not.to.have.property('secretInput');
      expect(result).not.to.equal(input); // проверка иммутабельности
      expect(input).to.deep.equal(originalInput); // проверка, что оригинал не изменился
    });

    it('should hide @noOutput in OUTPUT scope', function () {
      const result = applyProjection(
        ProjectionScope.OUTPUT,
        SimpleModel,
        input,
      );
      expect(result).to.deep.equal({
        id: 1,
        secretInput: 'in_secret', // не скрыто в OUTPUT
        commonData: 'common',
      });
      expect(result).not.to.have.property('secretOutput');
      expect(result).not.to.equal(input); // проверка иммутабельности
      expect(input).to.deep.equal(originalInput);
    });

    it('should show all relevant properties in other scopes', function () {
      // в INPUT scope должен быть secretOutput
      const resultInput = applyProjection(
        ProjectionScope.INPUT,
        SimpleModel,
        input,
      );
      expect(resultInput).to.have.property('secretOutput');

      // в OUTPUT scope должен быть secretInput
      const resultOutput = applyProjection(
        ProjectionScope.OUTPUT,
        SimpleModel,
        input,
      );
      expect(resultOutput).to.have.property('secretInput');
    });

    describe('inheritance', function () {
      it('should hide @noInput in INPUT scope', function () {
        const result = applyProjection(
          ProjectionScope.INPUT,
          ExtendedSimpleModel,
          input,
        );
        expect(result).to.deep.equal({
          id: 1,
          secretOutput: 'out_secret', // Не скрыто в INPUT
          commonData: 'common',
        });
        expect(result).not.to.have.property('secretInput');
        expect(result).not.to.equal(input); // проверка иммутабельности
        expect(input).to.deep.equal(originalInput); // Проверка, что оригинал не изменился
      });

      it('should hide @noOutput in OUTPUT scope', function () {
        const result = applyProjection(
          ProjectionScope.OUTPUT,
          ExtendedSimpleModel,
          input,
        );
        expect(result).to.deep.equal({
          id: 1,
          secretInput: 'in_secret', // не скрыто в OUTPUT
          commonData: 'common',
        });
        expect(result).not.to.have.property('secretOutput');
        expect(result).not.to.equal(input); // проверка иммутабельности
        expect(input).to.deep.equal(originalInput);
      });

      it('should show all relevant properties in other scopes', function () {
        // в INPUT scope должен быть secretOutput
        const resultInput = applyProjection(
          ProjectionScope.INPUT,
          ExtendedSimpleModel,
          input,
        );
        expect(resultInput).to.have.property('secretOutput');

        // в OUTPUT scope должен быть secretInput
        const resultOutput = applyProjection(
          ProjectionScope.OUTPUT,
          SimpleModel,
          input,
        );
        expect(resultOutput).to.have.property('secretInput');
      });
    });
  });

  describe('class level rules and overrides', function () {
    const hiddenOutputInput = new NoOutputModel(1, 'data', 101);
    const originalHiddenOutputInput = {...hiddenOutputInput};

    it('should hide all properties by default with @noOutput in OUTPUT scope', function () {
      const result = applyProjection(
        ProjectionScope.OUTPUT,
        NoOutputModel,
        hiddenOutputInput,
      );
      // только visibleId должен остаться,
      // т.к. он помечен @allowOutput
      expect(result).to.deep.equal({
        visibleId: 101,
      });
      expect(result).not.to.have.property('id');
      expect(result).not.to.have.property('data');
      expect(result).not.to.equal(hiddenOutputInput);
      expect(hiddenOutputInput).to.deep.equal(originalHiddenOutputInput);
    });

    it('should show all properties with @noOutput in INPUT scope', function () {
      const result = applyProjection(
        ProjectionScope.INPUT,
        NoOutputModel,
        hiddenOutputInput,
      );
      // в INPUT scope @noOutput не действует
      expect(result).to.deep.equal({
        id: 1,
        data: 'data',
        visibleId: 101,
      });
      expect(result).not.to.equal(hiddenOutputInput);
      expect(hiddenOutputInput).to.deep.equal(originalHiddenOutputInput);
    });

    const lockedInputInput = new NoInputModel(2, 'data2', 'writable');
    const originalLockedInputInput = {...lockedInputInput};

    it('should hide all properties by default with @noInput in INPUT scope', function () {
      const result = applyProjection(
        ProjectionScope.INPUT,
        NoInputModel,
        lockedInputInput,
      );
      // только writableData должен остаться,
      // т.к. он помечен @allowInput
      expect(result).to.deep.equal({
        writableData: 'writable',
      });
      expect(result).not.to.have.property('id');
      expect(result).not.to.have.property('data');
      expect(result).not.to.equal(lockedInputInput);
      expect(lockedInputInput).to.deep.equal(originalLockedInputInput);
    });

    it('should show all properties with @noInput in OUTPUT scope', function () {
      const result = applyProjection(
        ProjectionScope.OUTPUT,
        NoInputModel,
        lockedInputInput,
      );
      // в OUTPUT scope @noInput не действует
      expect(result).to.deep.equal({
        id: 2,
        data: 'data2',
        writableData: 'writable',
      });
      expect(result).not.to.equal(lockedInputInput);
      expect(lockedInputInput).to.deep.equal(originalLockedInputInput);
    });

    describe('inheritance', function () {
      it('should hide all properties by default with @noOutput in OUTPUT scope', function () {
        const result = applyProjection(
          ProjectionScope.OUTPUT,
          ExtendedNoOutputModel,
          hiddenOutputInput,
        );
        // только visibleId должен остаться,
        //  т.к. он помечен @allowOutput
        expect(result).to.deep.equal({
          visibleId: 101,
        });
        expect(result).not.to.have.property('id');
        expect(result).not.to.have.property('data');
        expect(result).not.to.equal(hiddenOutputInput);
        expect(hiddenOutputInput).to.deep.equal(originalHiddenOutputInput);
      });

      it('should show all properties with @noOutput in INPUT scope', function () {
        const result = applyProjection(
          ProjectionScope.INPUT,
          ExtendedNoOutputModel,
          hiddenOutputInput,
        );
        // в INPUT scope @noOutput не действует
        expect(result).to.deep.equal({
          id: 1,
          data: 'data',
          visibleId: 101,
        });
        expect(result).not.to.equal(hiddenOutputInput);
        expect(hiddenOutputInput).to.deep.equal(originalHiddenOutputInput);
      });

      it('should hide all properties by default with @noInput in INPUT scope', function () {
        const result = applyProjection(
          ProjectionScope.INPUT,
          ExtendedNoInputModel,
          lockedInputInput,
        );
        // только writableData должен остаться,
        // т.к. он помечен @allowInput
        expect(result).to.deep.equal({
          writableData: 'writable',
        });
        expect(result).not.to.have.property('id');
        expect(result).not.to.have.property('data');
        expect(result).not.to.equal(lockedInputInput);
        expect(lockedInputInput).to.deep.equal(originalLockedInputInput);
      });

      it('should show all properties with @noInput in OUTPUT scope', function () {
        const result = applyProjection(
          ProjectionScope.OUTPUT,
          ExtendedNoInputModel,
          lockedInputInput,
        );
        // в OUTPUT scope @noInput не действует
        expect(result).to.deep.equal({
          id: 2,
          data: 'data2',
          writableData: 'writable',
        });
        expect(result).not.to.equal(lockedInputInput);
        expect(lockedInputInput).to.deep.equal(originalLockedInputInput);
      });
    });
  });

  describe('embedded models', function () {
    const address = new Address('123 Main St', '90210', 'internal1');
    const user = new UserWithAddress(10, 'hash123', 'tokenABC', address);
    const originalUser = JSON.parse(JSON.stringify(user));

    it('should apply projection rules recursively in INPUT scope', function () {
      const result = applyProjection(
        ProjectionScope.INPUT,
        UserWithAddress,
        user,
      );
      expect(result).to.deep.equal({
        id: 10,
        sessionToken: 'tokenABC', // не скрыт в INPUT
        address: {
          street: '123 Main St',
          zipCode: '90210', // не скрыт в INPUT
          // internalCode скрыт через @noInput в Address
        },
      });
      expect(result).not.to.have.property('passwordHash'); // скрыт в UserWithAddress
      expect(result.address).not.to.have.property('internalCode'); // скрыт в Address
      expect(result).not.to.equal(user);
      // сравниваем с глубокой копией, т.к. result.address - новый объект
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
        passwordHash: 'hash123', // не скрыт в OUTPUT
        address: {
          street: '123 Main St',
          // zipCode скрыт через @noOutput в Address
          internalCode: 'internal1', // не скрыт в OUTPUT
        },
      });
      expect(result).not.to.have.property('sessionToken'); // скрыт в UserWithAddress
      expect(result.address).not.to.have.property('zipCode'); // скрыт в Address
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

    describe('inheritance', function () {
      it('should apply projection rules recursively in INPUT scope', function () {
        const result = applyProjection(
          ProjectionScope.INPUT,
          ExtendedUserWithAddress,
          user,
        );
        expect(result).to.deep.equal({
          id: 10,
          sessionToken: 'tokenABC', // не скрыт в INPUT
          address: {
            street: '123 Main St',
            zipCode: '90210', // не скрыт в INPUT
            // internalCode скрыт через @noInput в Address
          },
        });
        expect(result).not.to.have.property('passwordHash'); // скрыт в UserWithAddress
        expect(result.address).not.to.have.property('internalCode'); // скрыт в Address
        expect(result).not.to.equal(user);
        // сравниваем с глубокой копией, т.к. result.address - новый объект
        expect(user).to.deep.equal(originalUser);
      });

      it('should apply projection rules recursively in OUTPUT scope', function () {
        const result = applyProjection(
          ProjectionScope.OUTPUT,
          ExtendedUserWithAddress,
          user,
        );
        expect(result).to.deep.equal({
          id: 10,
          passwordHash: 'hash123', // не скрыт в OUTPUT
          address: {
            street: '123 Main St',
            // zipCode скрыт через @noOutput в Address
            internalCode: 'internal1', // не скрыт в OUTPUT
          },
        });
        expect(result).not.to.have.property('sessionToken'); // скрыт в UserWithAddress
        expect(result.address).not.to.have.property('zipCode'); // скрыт в Address
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
          ExtendedUserWithAddress,
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
  });

  describe('array handling', function () {
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
      expect(result).not.to.equal(users); // новый массив
      expect(users).to.deep.equal(originalUsers); // исходный не изменен
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

    describe('inheritance', function () {
      it('should apply projection to each element in the array for INPUT scope', function () {
        const result = applyProjection(
          ProjectionScope.INPUT,
          ExtendedSimpleModel,
          users,
        );
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
        expect(result).not.to.equal(users); // новый массив
        expect(users).to.deep.equal(originalUsers); // исходный не изменен
      });

      it('should apply projection to each element in the array for OUTPUT scope', function () {
        const result = applyProjection(
          ProjectionScope.OUTPUT,
          ExtendedSimpleModel,
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
        const result = applyProjection(
          ProjectionScope.OUTPUT,
          ExtendedSimpleModel,
          [],
        );
        expect(result).to.be.an('array').with.lengthOf(0);
      });
    });
  });

  describe('non-object handling', function () {
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

    describe('inheritance', function () {
      it('should return null if input is null', function () {
        const result = applyProjection(
          ProjectionScope.OUTPUT,
          ExtendedSimpleModel,
          null,
        );
        expect(result).to.be.null;
      });

      it('should return undefined if input is undefined', function () {
        const result = applyProjection(
          ProjectionScope.OUTPUT,
          ExtendedSimpleModel,
          undefined,
        );
        expect(result).to.be.undefined;
      });

      it('should return primitives unchanged', function () {
        expect(
          applyProjection(ProjectionScope.OUTPUT, ExtendedSimpleModel, 123),
        ).to.equal(123);
        expect(
          applyProjection(
            ProjectionScope.OUTPUT,
            ExtendedSimpleModel,
            'string',
          ),
        ).to.equal('string');
        expect(
          applyProjection(ProjectionScope.OUTPUT, ExtendedSimpleModel, true),
        ).to.equal(true);
      });
    });
  });

  describe('function overloads', function () {
    // используем SimpleModel, так как у него разные правила для INPUT и OUTPUT
    const inputData = new SimpleModel(
      100,
      'input_secret',
      'output_secret',
      'common_value',
    );
    const originalInputData = {...inputData};

    it('should default to ProjectionScope.OUTPUT when called with two arguments', function () {
      // вызываем с двумя аргументами
      const resultTwoArgs = applyProjection(SimpleModel, inputData);
      // проверяем, что результат соответствует OUTPUT scope
      // (secretOutput должен быть скрыт, secretInput - нет)
      expect(resultTwoArgs).to.deep.equal({
        id: 100,
        secretInput: 'input_secret',
        commonData: 'common_value',
      });
      expect(resultTwoArgs).not.to.have.property('secretOutput');
      expect(resultTwoArgs).to.have.property('secretInput');
      // дополнительно сравним с явным вызовом OUTPUT для уверенности
      const resultOutputExplicit = applyProjection(
        ProjectionScope.OUTPUT,
        SimpleModel,
        inputData,
      );
      expect(resultTwoArgs).to.deep.equal(resultOutputExplicit);
      // проверка иммутабельности
      expect(resultTwoArgs).not.to.equal(inputData);
      expect(inputData).to.deep.equal(originalInputData);
    });

    it('should use ProjectionScope.INPUT when called with three arguments and INPUT scope', function () {
      // вызываем с тремя аргументами и INPUT
      const resultInputExplicit = applyProjection(
        ProjectionScope.INPUT,
        SimpleModel,
        inputData,
      );
      // проверяем, что результат соответствует INPUT scope
      // (secretInput должен быть скрыт, secretOutput - нет)
      expect(resultInputExplicit).to.deep.equal({
        id: 100,
        secretOutput: 'output_secret',
        commonData: 'common_value',
      });
      expect(resultInputExplicit).not.to.have.property('secretInput');
      expect(resultInputExplicit).to.have.property('secretOutput');
      // проверка иммутабельности
      expect(resultInputExplicit).not.to.equal(inputData);
      expect(inputData).to.deep.equal(originalInputData);
    });

    it('should use ProjectionScope.OUTPUT when called with three arguments and OUTPUT scope', function () {
      // вызываем с тремя аргументами и OUTPUT
      const resultOutputExplicit = applyProjection(
        ProjectionScope.OUTPUT,
        SimpleModel,
        inputData,
      );
      // проверяем, что результат соответствует OUTPUT scope
      // (secretOutput должен быть скрыт, secretInput - нет)
      expect(resultOutputExplicit).to.deep.equal({
        id: 100,
        secretInput: 'input_secret',
        commonData: 'common_value',
      });
      expect(resultOutputExplicit).not.to.have.property('secretOutput');
      expect(resultOutputExplicit).to.have.property('secretInput');
      // проверка иммутабельности
      expect(resultOutputExplicit).not.to.equal(inputData);
      expect(inputData).to.deep.equal(originalInputData);
    });

    describe('inheritance', function () {
      it('should default to ProjectionScope.OUTPUT when called with two arguments', function () {
        // вызываем с двумя аргументами
        const resultTwoArgs = applyProjection(ExtendedSimpleModel, inputData);
        // проверяем, что результат соответствует OUTPUT scope
        // (secretOutput должен быть скрыт, secretInput - нет)
        expect(resultTwoArgs).to.deep.equal({
          id: 100,
          secretInput: 'input_secret',
          commonData: 'common_value',
        });
        expect(resultTwoArgs).not.to.have.property('secretOutput');
        expect(resultTwoArgs).to.have.property('secretInput');
        // дополнительно сравним с явным вызовом OUTPUT для уверенности
        const resultOutputExplicit = applyProjection(
          ProjectionScope.OUTPUT,
          ExtendedSimpleModel,
          inputData,
        );
        expect(resultTwoArgs).to.deep.equal(resultOutputExplicit);
        // проверка иммутабельности
        expect(resultTwoArgs).not.to.equal(inputData);
        expect(inputData).to.deep.equal(originalInputData);
      });

      it('should use ProjectionScope.INPUT when called with three arguments and INPUT scope', function () {
        // вызываем с тремя аргументами и INPUT
        const resultInputExplicit = applyProjection(
          ProjectionScope.INPUT,
          ExtendedSimpleModel,
          inputData,
        );
        // проверяем, что результат соответствует INPUT scope
        // (secretInput должен быть скрыт, secretOutput - нет)
        expect(resultInputExplicit).to.deep.equal({
          id: 100,
          secretOutput: 'output_secret',
          commonData: 'common_value',
        });
        expect(resultInputExplicit).not.to.have.property('secretInput');
        expect(resultInputExplicit).to.have.property('secretOutput');
        // проверка иммутабельности
        expect(resultInputExplicit).not.to.equal(inputData);
        expect(inputData).to.deep.equal(originalInputData);
      });

      it('should use ProjectionScope.OUTPUT when called with three arguments and OUTPUT scope', function () {
        // вызываем с тремя аргументами и OUTPUT
        const resultOutputExplicit = applyProjection(
          ProjectionScope.OUTPUT,
          ExtendedSimpleModel,
          inputData,
        );
        // проверяем, что результат соответствует OUTPUT scope
        // (secretOutput должен быть скрыт, secretInput - нет)
        expect(resultOutputExplicit).to.deep.equal({
          id: 100,
          secretInput: 'input_secret',
          commonData: 'common_value',
        });
        expect(resultOutputExplicit).not.to.have.property('secretOutput');
        expect(resultOutputExplicit).to.have.property('secretInput');
        // проверка иммутабельности
        expect(resultOutputExplicit).not.to.equal(inputData);
        expect(inputData).to.deep.equal(originalInputData);
      });
    });
  });
});
