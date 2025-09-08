/* eslint-disable @typescript-eslint/no-unused-vars */
import {expect} from 'chai';
import {embedded} from './embedded-projection-decorator.js';
import {embeddedProjection} from './embedded-projection-decorator.js';
import {EmbeddedProjectionReflector} from './embedded-projection-reflector.js';

class EmbeddedModel {}
class AnotherEmbeddedModel {}

const MD1 = {model: () => EmbeddedModel};
const MD2 = {model: () => AnotherEmbeddedModel};

/**
 * Утилита извлекает массив кортежей, содержащий
 * ключи и значения полученного Map.
 *
 * @param map
 */
function entries<K, V>(map: Map<K, V>): [K, V][] {
  return Array.from(map.entries());
}

describe('embeddedProjection', function () {
  it('should set the metadata to the target property', function () {
    class Target {
      @embeddedProjection(MD1)
      prop?: unknown;
    }
    const res = EmbeddedProjectionReflector.getPropertiesMetadata(Target);
    expect(entries(res)).to.be.eql([['prop', MD1]]);
  });

  it('should override the property metadata', function () {
    class Target {
      @embeddedProjection(MD2)
      @embeddedProjection(MD1)
      prop?: unknown;
    }
    const res = EmbeddedProjectionReflector.getPropertiesMetadata(Target);
    expect(entries(res)).to.be.eql([['prop', MD2]]);
  });

  describe('inheritance', function () {
    it('should override the inherited property metadata', function () {
      class BaseTarget {
        @embeddedProjection(MD1)
        prop?: unknown;
      }
      class Target extends BaseTarget {
        @embeddedProjection(MD2)
        declare prop?: unknown;
      }
      const res = EmbeddedProjectionReflector.getPropertiesMetadata(Target);
      expect(entries(res)).to.be.eql([['prop', MD2]]);
    });

    it('should not affect the parent property metadata', function () {
      class BaseTarget {
        @embeddedProjection(MD1)
        prop?: unknown;
      }
      class Target extends BaseTarget {
        @embeddedProjection(MD2)
        declare prop?: unknown;
      }
      const res = EmbeddedProjectionReflector.getPropertiesMetadata(BaseTarget);
      expect(entries(res)).to.be.eql([['prop', MD1]]);
    });
  });

  describe('invalid decorator target', function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const embeddedProjectionAny = embeddedProjection as any;

    it('should throw the error for the class', function () {
      const throwable = () => {
        @embeddedProjectionAny(MD1)
        class Target {}
      };
      expect(throwable).to.throw(
        'Embedded projection decorator is only supported ' +
          'for an instance property.',
      );
    });

    it('should throw the error for the static property', function () {
      const throwable = () => {
        class Target {
          @embeddedProjectionAny(MD1)
          static prop?: unknown;
        }
      };
      expect(throwable).to.throw(
        'Embedded projection decorator is only supported ' +
          'for an instance property.',
      );
    });

    it('should throw the error for the static method', function () {
      const throwable = () => {
        class Target {
          @embeddedProjectionAny(MD1)
          static method() {}
        }
      };
      expect(throwable).to.throw(
        'Embedded projection decorator is only supported ' +
          'for an instance property.',
      );
    });

    it('should throw the error for the static method parameter', function () {
      const throwable = () => {
        class Target {
          static method(
            @embeddedProjectionAny(MD1)
            param?: unknown,
          ) {}
        }
      };
      expect(throwable).to.throw(
        'Embedded projection decorator is only supported ' +
          'for an instance property.',
      );
    });

    it('should throw the error for the instance method', function () {
      const throwable = () => {
        class Target {
          @embeddedProjectionAny(MD1)
          method() {}
        }
      };
      expect(throwable).to.throw(
        'Embedded projection decorator is only supported ' +
          'for an instance property.',
      );
    });

    it('should throw the error for the static instance method parameter', function () {
      const throwable = () => {
        class Target {
          method(
            @embeddedProjectionAny(MD1)
            param?: unknown,
          ) {}
        }
      };
      expect(throwable).to.throw(
        'Embedded projection decorator is only supported ' +
          'for an instance property.',
      );
    });
  });

  describe('decorator aliases', function () {
    describe('embedded', function () {
      it('should set the given factory to the property metadata', function () {
        const factory = () => EmbeddedModel;
        class Target {
          @embedded(factory)
          param?: unknown;
        }
        const md = {model: factory};
        const res = EmbeddedProjectionReflector.getPropertiesMetadata(Target);
        expect(entries(res)).to.be.eql([['param', md]]);
      });
    });
  });
});
