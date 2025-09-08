/* eslint-disable @typescript-eslint/no-unused-vars */
import {expect} from 'chai';
import {ProjectionRule} from '../../projection.js';
import {ProjectionScope} from '../../projection.js';
import {hidden} from './projection-rule-decorator.js';
import {noInput} from './projection-rule-decorator.js';
import {visible} from './projection-rule-decorator.js';
import {noOutput} from './projection-rule-decorator.js';
import {allowInput} from './projection-rule-decorator.js';
import {allowOutput} from './projection-rule-decorator.js';
import {projectionRule} from './projection-rule-decorator.js';
import {ProjectionRuleReflector} from './projection-rule-reflector.js';

const MD1 = {
  scope: ProjectionScope.INPUT,
  rule: ProjectionRule.HIDE,
};

const MD2 = {
  scope: ProjectionScope.INPUT,
  rule: ProjectionRule.SHOW,
};

/**
 * Утилита извлекает массив кортежей, содержащий
 * ключи и значения полученного Map.
 *
 * @param map
 */
function entries<K, V>(map: Map<K, V>): [K, V][] {
  return Array.from(map.entries());
}

describe('projectionRule', function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projectionRuleAny = projectionRule as any;

  it('should throw the error for the static property', function () {
    const throwable = () => {
      class Target {
        @projectionRuleAny(MD1)
        static prop?: unknown;
      }
    };
    expect(throwable).to.throw(
      'Projection rule decorator is only supported ' +
        'for a class or an instance property.',
    );
  });

  it('should throw the error for the static method', function () {
    const throwable = () => {
      class Target {
        @projectionRuleAny(MD1)
        method() {}
      }
    };
    expect(throwable).to.throw(
      'Projection rule decorator is only supported ' +
        'for a class or an instance property.',
    );
  });

  it('should throw the error for the static method parameter', function () {
    const throwable = () => {
      class Target {
        static method(
          @projectionRuleAny(MD1)
          param?: unknown,
        ) {}
      }
    };
    expect(throwable).to.throw(
      'Projection rule decorator is only supported ' +
        'for a class or an instance property.',
    );
  });

  it('should throw the error for the instance method', function () {
    const throwable = () => {
      class Target {
        @projectionRuleAny(MD1)
        method() {}
      }
    };
    expect(throwable).to.throw(
      'Projection rule decorator is only supported ' +
        'for a class or an instance property.',
    );
  });

  it('should throw the error for the instance method parameter', function () {
    const throwable = () => {
      class Target {
        method(
          @projectionRuleAny(MD1)
          param?: unknown,
        ) {}
      }
    };
    expect(throwable).to.throw(
      'Projection rule decorator is only supported ' +
        'for a class or an instance property.',
    );
  });

  describe('class level rules', function () {
    it('should set the metadata to the target', function () {
      @projectionRule(MD1)
      class Target {}
      const res = ProjectionRuleReflector.getClassMetadata(Target);
      expect(res).to.be.eql([MD1]);
    });

    it('should set multiple metadata to the target', function () {
      @projectionRule(MD2)
      @projectionRule(MD1)
      class Target {}
      const res = ProjectionRuleReflector.getClassMetadata(Target);
      expect(res).to.be.eql([MD1, MD2]);
    });

    it('should extend the inherited metadata', function () {
      @projectionRule(MD1)
      class BaseTarget {}
      @projectionRule(MD2)
      class Target extends BaseTarget {}
      const res = ProjectionRuleReflector.getClassMetadata(Target);
      expect(res).to.be.eql([MD1, MD2]);
    });

    it('should not affect the parent metadata', function () {
      @projectionRule(MD1)
      class BaseTarget {}
      @projectionRule(MD2)
      class Target extends BaseTarget {}
      const res = ProjectionRuleReflector.getClassMetadata(BaseTarget);
      expect(res).to.be.eql([MD1]);
    });

    describe('decorator aliases', function () {
      describe('hidden', function () {
        it('should set the HIDE rule for INPUT scope', function () {
          @hidden()
          class Target {}
          const md = {scope: ProjectionScope.OUTPUT, rule: ProjectionRule.HIDE};
          const res = ProjectionRuleReflector.getClassMetadata(Target);
          expect(res).to.be.eql([md]);
        });
      });

      describe('visible', function () {
        it('should set the SHOW rule for INPUT scope', function () {
          @visible()
          class Target {}
          const res = ProjectionRuleReflector.getClassMetadata(Target);
          const md = {scope: ProjectionScope.OUTPUT, rule: ProjectionRule.SHOW};
          expect(res).to.be.eql([md]);
        });
      });

      describe('noInput', function () {
        it('should set the HIDE rule for INPUT scope', function () {
          @noInput()
          class Target {}
          const md = {scope: ProjectionScope.INPUT, rule: ProjectionRule.HIDE};
          const res = ProjectionRuleReflector.getClassMetadata(Target);
          expect(res).to.be.eql([md]);
        });
      });

      describe('allowInput', function () {
        it('should set the SHOW rule for INPUT scope', function () {
          @allowInput()
          class Target {}
          const md = {scope: ProjectionScope.INPUT, rule: ProjectionRule.SHOW};
          const res = ProjectionRuleReflector.getClassMetadata(Target);
          expect(res).to.be.eql([md]);
        });
      });

      describe('noOutput', function () {
        it('should set the HIDE rule for OUTPUT scope', function () {
          @noOutput()
          class Target {}
          const md = {scope: ProjectionScope.OUTPUT, rule: ProjectionRule.HIDE};
          const res = ProjectionRuleReflector.getClassMetadata(Target);
          expect(res).to.be.eql([md]);
        });
      });

      describe('allowOutput', function () {
        it('should set the SHOW rule for OUTPUT scope', function () {
          @allowOutput()
          class Target {}
          const md = {scope: ProjectionScope.OUTPUT, rule: ProjectionRule.SHOW};
          const res = ProjectionRuleReflector.getClassMetadata(Target);
          expect(res).to.be.eql([md]);
        });
      });
    });
  });

  describe('property level rules', function () {
    it('should set the metadata to the target property', function () {
      class Target {
        @projectionRule(MD1)
        prop?: string;
      }
      const res = ProjectionRuleReflector.getPropertiesMetadata(Target);
      expect(entries(res)).to.be.eql([['prop', [MD1]]]);
    });

    it('should set multiple metadata to the target property', function () {
      class Target {
        @projectionRule(MD2)
        @projectionRule(MD1)
        prop?: string;
      }
      const res = ProjectionRuleReflector.getPropertiesMetadata(Target);
      expect(entries(res)).to.be.eql([['prop', [MD1, MD2]]]);
    });

    it('should set metadata to the target properties', function () {
      class Target {
        @projectionRule(MD1)
        prop1?: string;

        @projectionRule(MD2)
        prop2?: string;
      }
      const res = ProjectionRuleReflector.getPropertiesMetadata(Target);
      expect(entries(res)).to.be.eql([
        ['prop1', [MD1]],
        ['prop2', [MD2]],
      ]);
    });

    describe('inheritance', function () {
      it('should extend the inherited property metadata', function () {
        class BaseTarget {
          @projectionRule(MD1)
          param?: unknown;
        }
        class Target extends BaseTarget {
          @projectionRule(MD2)
          declare param?: unknown;
        }
        const res = ProjectionRuleReflector.getPropertiesMetadata(Target);
        expect(entries(res)).to.be.eql([['param', [MD1, MD2]]]);
      });

      it('should not affect the parent property metadata', function () {
        class BaseTarget {
          @projectionRule(MD1)
          param?: unknown;
        }
        class Target extends BaseTarget {
          @projectionRule(MD2)
          declare param?: unknown;
        }
        const res = ProjectionRuleReflector.getPropertiesMetadata(BaseTarget);
        expect(entries(res)).to.be.eql([['param', [MD1]]]);
      });
    });

    describe('decorator aliases', function () {
      describe('hidden', function () {
        it('should set the HIDE rule for OUTPUT scope', function () {
          class Target {
            @hidden()
            prop?: unknown;
          }
          const md = {scope: ProjectionScope.OUTPUT, rule: ProjectionRule.HIDE};
          const res = ProjectionRuleReflector.getPropertiesMetadata(Target);
          expect(entries(res)).to.be.eql([['prop', [md]]]);
        });
      });

      describe('visible', function () {
        it('should set the SHOW rule for OUTPUT scope', function () {
          class Target {
            @visible()
            prop?: unknown;
          }
          const md = {scope: ProjectionScope.OUTPUT, rule: ProjectionRule.SHOW};
          const res = ProjectionRuleReflector.getPropertiesMetadata(Target);
          expect(entries(res)).to.be.eql([['prop', [md]]]);
        });
      });

      describe('noInput', function () {
        it('should set the HIDE rule for INPUT scope', function () {
          class Target {
            @noInput()
            prop?: unknown;
          }
          const md = {scope: ProjectionScope.INPUT, rule: ProjectionRule.HIDE};
          const res = ProjectionRuleReflector.getPropertiesMetadata(Target);
          expect(entries(res)).to.be.eql([['prop', [md]]]);
        });
      });

      describe('allowInput', function () {
        it('should set the SHOW rule for INPUT scope', function () {
          class Target {
            @allowInput()
            prop?: unknown;
          }
          const md = {scope: ProjectionScope.INPUT, rule: ProjectionRule.SHOW};
          const res = ProjectionRuleReflector.getPropertiesMetadata(Target);
          expect(entries(res)).to.be.eql([['prop', [md]]]);
        });
      });

      describe('noOutput', function () {
        it('should set the HIDE rule for OUTPUT scope', function () {
          class Target {
            @noOutput()
            prop?: unknown;
          }
          const md = {scope: ProjectionScope.OUTPUT, rule: ProjectionRule.HIDE};
          const res = ProjectionRuleReflector.getPropertiesMetadata(Target);
          expect(entries(res)).to.be.eql([['prop', [md]]]);
        });
      });

      describe('allowOutput', function () {
        it('should set the SHOW rule for OUTPUT scope', function () {
          class Target {
            @allowOutput()
            prop?: unknown;
          }
          const md = {scope: ProjectionScope.OUTPUT, rule: ProjectionRule.SHOW};
          const res = ProjectionRuleReflector.getPropertiesMetadata(Target);
          expect(entries(res)).to.be.eql([['prop', [md]]]);
        });
      });
    });
  });
});
