import {expect} from 'chai';
import {EmbeddedProjectionReflector as EPR} from './embedded-projection-reflector.js';

class TargetModel1 {}
class TargetModel2 {}
class TargetModel3 {}

const MD1 = {model: () => TargetModel1};
const MD2 = {model: () => TargetModel2};
const MD3 = {model: () => TargetModel3};

/**
 * Утилита извлекает массив кортежей, содержащий
 * ключи и значения полученного Map.
 *
 * @param map
 */
function entries<K, V>(map: Map<K, V>): [K, V][] {
  return Array.from(map.entries());
}

describe('EmbeddedProjectionReflector', function () {
  describe('setPropertyMetadata', function () {
    it('should set the given metadata to the target', function () {
      class MyClass {}
      const res1 = EPR.getPropertiesMetadata(MyClass);
      expect(entries(res1)).to.be.eql([]);
      EPR.setPropertyMetadata(MD1, MyClass, 'prop');
      const res2 = EPR.getPropertiesMetadata(MyClass);
      expect(entries(res2)).to.be.eql([['prop', MD1]]);
    });

    it('should not affect the parent metadata', function () {
      class BaseClass {}
      class ChildClass extends BaseClass {}
      const res1 = EPR.getPropertiesMetadata(BaseClass);
      expect(entries(res1)).to.be.eql([]);
      EPR.setPropertyMetadata(MD1, ChildClass, 'prop');
      const res2 = EPR.getPropertiesMetadata(BaseClass);
      expect(entries(res2)).to.be.eql([]);
    });

    it('should override the target metadata', function () {
      class MyClass {}
      const res1 = EPR.getPropertiesMetadata(MyClass);
      expect(entries(res1)).to.be.eql([]);
      EPR.setPropertyMetadata(MD1, MyClass, 'prop');
      const res2 = EPR.getPropertiesMetadata(MyClass);
      expect(entries(res2)).to.be.eql([['prop', MD1]]);
      EPR.setPropertyMetadata(MD2, MyClass, 'prop');
      const res3 = EPR.getPropertiesMetadata(MyClass);
      expect(entries(res3)).to.be.eql([['prop', MD2]]);
    });

    it('should extend children metadata that inherited from the parent', function () {
      class BaseClass {}
      class ChildClass extends BaseClass {}
      const res1 = EPR.getPropertiesMetadata(BaseClass);
      const res2 = EPR.getPropertiesMetadata(ChildClass);
      expect(entries(res1)).to.be.eql([]);
      expect(entries(res2)).to.be.eql([]);
      // установка метаданных для нового свойства в базовый класс
      EPR.setPropertyMetadata(MD1, BaseClass, 'prop1');
      const res3 = EPR.getPropertiesMetadata(BaseClass);
      const res4 = EPR.getPropertiesMetadata(ChildClass);
      expect(entries(res3)).to.be.eql([['prop1', MD1]]);
      expect(entries(res4)).to.be.eql([['prop1', MD1]]);
      // установка метаданных нового свойства в дочерний класс
      EPR.setPropertyMetadata(MD2, ChildClass, 'prop2');
      const res5 = EPR.getPropertiesMetadata(BaseClass);
      const res6 = EPR.getPropertiesMetadata(ChildClass);
      expect(entries(res5)).to.be.eql([['prop1', MD1]]);
      expect(entries(res6)).to.be.eql([
        ['prop1', MD1],
        ['prop2', MD2],
      ]);
      // перезапись метаданных свойства родителя в дочернем классе
      EPR.setPropertyMetadata(MD3, ChildClass, 'prop1');
      const res7 = EPR.getPropertiesMetadata(BaseClass);
      const res8 = EPR.getPropertiesMetadata(ChildClass);
      expect(entries(res7)).to.be.eql([['prop1', MD1]]);
      expect(entries(res8)).to.be.eql([
        ['prop1', MD3],
        ['prop2', MD2],
      ]);
    });
  });

  describe('getPropertiesMetadata', function () {
    it('should return the target metadata', function () {
      class MyClass {}
      const res1 = EPR.getPropertiesMetadata(MyClass);
      expect(entries(res1)).to.be.eql([]);
      EPR.setPropertyMetadata(MD1, MyClass, 'prop');
      const res2 = EPR.getPropertiesMetadata(MyClass);
      expect(entries(res2)).to.be.eql([['prop', MD1]]);
    });

    it('should return the parent metadata', function () {
      class BaseClass {}
      class ChildClass extends BaseClass {}
      const res1 = EPR.getPropertiesMetadata(ChildClass);
      expect(entries(res1)).to.be.eql([]);
      EPR.setPropertyMetadata(MD1, BaseClass, 'prop');
      const res2 = EPR.getPropertiesMetadata(ChildClass);
      expect(entries(res2)).to.be.eql([['prop', MD1]]);
    });
  });
});
