import { expect } from 'chai';
import { ProjectionRule } from '../../projection.js';
import { ProjectionScope } from '../../projection.js';
import { ProjectionRuleReflector as PRR } from './projection-rule-reflector.js';
const MD1 = {
    scope: ProjectionScope.INPUT,
    rule: ProjectionRule.HIDE,
};
const MD2 = {
    scope: ProjectionScope.INPUT,
    rule: ProjectionRule.SHOW,
};
const MD3 = {
    scope: ProjectionScope.OUTPUT,
    rule: ProjectionRule.SHOW,
};
/**
 * Утилита извлекает массив кортежей, содержащий
 * ключи и значения полученного Map.
 *
 * @param map
 */
function entries(map) {
    return Array.from(map.entries());
}
describe('ProjectionRuleReflector', function () {
    describe('setClassMetadata', function () {
        it('should set the given metadata to the target', function () {
            class MyClass {
            }
            const res1 = PRR.getClassMetadata(MyClass);
            expect(res1).to.be.eql([]);
            PRR.setClassMetadata(MD1, MyClass);
            const res2 = PRR.getClassMetadata(MyClass);
            expect(res2).to.be.eql([MD1]);
        });
        it('should not affect the parent metadata', function () {
            class BaseClass {
            }
            class ChildClass extends BaseClass {
            }
            const res1 = PRR.getClassMetadata(BaseClass);
            expect(res1).to.be.eql([]);
            PRR.setClassMetadata(MD1, ChildClass);
            const res2 = PRR.getClassMetadata(BaseClass);
            expect(res2).to.be.eql([]);
        });
        it('should extend children metadata that inherited from the parent', function () {
            class BaseClass {
            }
            class ChildClass extends BaseClass {
            }
            const res1 = PRR.getClassMetadata(BaseClass);
            const res2 = PRR.getClassMetadata(ChildClass);
            expect(res1).to.be.eql([]);
            expect(res2).to.be.eql([]);
            // установка метаданных в базовый класс
            PRR.setClassMetadata(MD1, BaseClass);
            const res3 = PRR.getClassMetadata(BaseClass);
            const res4 = PRR.getClassMetadata(ChildClass);
            expect(res3).to.be.eql([MD1]);
            expect(res4).to.be.eql([MD1]);
            // установка метаданных в родительский класс
            PRR.setClassMetadata(MD2, ChildClass);
            const res5 = PRR.getClassMetadata(BaseClass);
            const res6 = PRR.getClassMetadata(ChildClass);
            expect(res5).to.be.eql([MD1]);
            expect(res6).to.be.eql([MD1, MD2]);
        });
    });
    describe('getClassMetadata', function () {
        it('should return the target metadata', function () {
            class MyClass {
            }
            const res1 = PRR.getClassMetadata(MyClass);
            expect(res1).to.be.eql([]);
            PRR.setClassMetadata(MD1, MyClass);
            const res2 = PRR.getClassMetadata(MyClass);
            expect(res2).to.be.eql([MD1]);
        });
        it('should return the parent metadata', function () {
            class BaseClass {
            }
            class ChildClass extends BaseClass {
            }
            const res1 = PRR.getClassMetadata(ChildClass);
            expect(res1).to.be.eql([]);
            PRR.setClassMetadata(MD1, BaseClass);
            const res2 = PRR.getClassMetadata(ChildClass);
            expect(res2).to.be.eql([MD1]);
        });
    });
    describe('setPropertyMetadata', function () {
        it('should set the given metadata to the target', function () {
            class MyClass {
            }
            const res1 = PRR.getPropertiesMetadata(MyClass);
            expect(entries(res1)).to.be.eql([]);
            PRR.setPropertyMetadata(MD1, MyClass, 'prop');
            const res2 = PRR.getPropertiesMetadata(MyClass);
            expect(entries(res2)).to.be.eql([['prop', [MD1]]]);
        });
        it('should not affect the parent metadata', function () {
            class BaseClass {
            }
            class ChildClass extends BaseClass {
            }
            const res1 = PRR.getPropertiesMetadata(BaseClass);
            expect(entries(res1)).to.be.eql([]);
            PRR.setPropertyMetadata(MD1, ChildClass, 'prop');
            const res2 = PRR.getPropertiesMetadata(BaseClass);
            expect(entries(res2)).to.be.eql([]);
        });
        it('should extend children metadata that inherited from the parent', function () {
            class BaseClass {
            }
            class ChildClass extends BaseClass {
            }
            const res1 = PRR.getPropertiesMetadata(BaseClass);
            const res2 = PRR.getPropertiesMetadata(ChildClass);
            expect(entries(res1)).to.be.eql([]);
            expect(entries(res2)).to.be.eql([]);
            // установка метаданных для нового свойства в базовый класс
            PRR.setPropertyMetadata(MD1, BaseClass, 'prop1');
            const res3 = PRR.getPropertiesMetadata(BaseClass);
            const res4 = PRR.getPropertiesMetadata(ChildClass);
            expect(entries(res3)).to.be.eql([['prop1', [MD1]]]);
            expect(entries(res4)).to.be.eql([['prop1', [MD1]]]);
            // установка метаданных нового свойства в дочерний класс
            PRR.setPropertyMetadata(MD2, ChildClass, 'prop2');
            const res5 = PRR.getPropertiesMetadata(BaseClass);
            const res6 = PRR.getPropertiesMetadata(ChildClass);
            expect(entries(res5)).to.be.eql([['prop1', [MD1]]]);
            expect(entries(res6)).to.be.eql([
                ['prop1', [MD1]],
                ['prop2', [MD2]],
            ]);
            // дополнение метаданных свойства родителя в дочернем классе
            PRR.setPropertyMetadata(MD3, ChildClass, 'prop1');
            const res7 = PRR.getPropertiesMetadata(BaseClass);
            const res8 = PRR.getPropertiesMetadata(ChildClass);
            expect(entries(res7)).to.be.eql([['prop1', [MD1]]]);
            expect(entries(res8)).to.be.eql([
                ['prop1', [MD1, MD3]],
                ['prop2', [MD2]],
            ]);
        });
    });
    describe('getPropertyMetadata', function () {
        it('should return the target metadata', function () {
            class MyClass {
            }
            const res1 = PRR.getPropertiesMetadata(MyClass);
            expect(entries(res1)).to.be.eql([]);
            PRR.setPropertyMetadata(MD1, MyClass, 'prop');
            const res2 = PRR.getPropertiesMetadata(MyClass);
            expect(entries(res2)).to.be.eql([['prop', [MD1]]]);
        });
        it('should return the parent metadata', function () {
            class BaseClass {
            }
            class ChildClass extends BaseClass {
            }
            const res1 = PRR.getPropertiesMetadata(ChildClass);
            expect(entries(res1)).to.be.eql([]);
            PRR.setPropertyMetadata(MD1, BaseClass, 'prop');
            const res2 = PRR.getPropertiesMetadata(ChildClass);
            expect(entries(res2)).to.be.eql([['prop', [MD1]]]);
        });
    });
});
