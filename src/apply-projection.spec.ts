import {expect} from 'chai';
import {noInput} from './decorators/index.js';
import {embedded} from './decorators/index.js';
import {noOutput} from './decorators/index.js';
import {ProjectionScope} from './projection.js';
import {allowInput} from './decorators/index.js';
import {allowOutput} from './decorators/index.js';
import {applyProjection} from './apply-projection.js';

describe('applyProjection', function () {
  it('should handle null and undefined properties gracefully for the INPUT scope', function () {
    class Target {}
    const res1 = applyProjection(ProjectionScope.INPUT, Target, null);
    const res2 = applyProjection(ProjectionScope.INPUT, Target, undefined);
    expect(res1).to.be.null;
    expect(res2).to.be.undefined;
  });

  it('should handle null and undefined properties gracefully for the OUTPUT scope', function () {
    class Target {}
    const res1 = applyProjection(ProjectionScope.OUTPUT, Target, null);
    const res2 = applyProjection(ProjectionScope.OUTPUT, Target, undefined);
    expect(res1).to.be.null;
    expect(res2).to.be.undefined;
  });

  it('should return primitives unchanged for the INPUT scope', function () {
    class Target {}
    const res1 = applyProjection(ProjectionScope.OUTPUT, Target, 'string');
    const res2 = applyProjection(ProjectionScope.OUTPUT, Target, 10);
    const res3 = applyProjection(ProjectionScope.OUTPUT, Target, true);
    expect(res1).to.be.eq('string');
    expect(res2).to.be.eq(10);
    expect(res3).to.be.eq(true);
  });

  it('should return primitives unchanged for the OUTPUT scope', function () {
    class Target {}
    const res1 = applyProjection(ProjectionScope.OUTPUT, Target, 'string');
    const res2 = applyProjection(ProjectionScope.OUTPUT, Target, 10);
    const res3 = applyProjection(ProjectionScope.OUTPUT, Target, true);
    expect(res1).to.be.eq('string');
    expect(res2).to.be.eq(10);
    expect(res3).to.be.eq(true);
  });

  describe('class level rules', function () {
    it('should apply OUTPUT scope by default', function () {
      @noOutput()
      class Target {
        foo?: string;
        bar?: number;
      }
      const res = applyProjection(Target, {foo: 'str', bar: 10});
      expect(res).to.be.eql({});
    });

    it('should not hide properties without rules for the OUTPUT scope', function () {
      class Target {
        foo?: string;
        bar?: number;
      }
      const res = applyProjection(ProjectionScope.OUTPUT, Target, {
        foo: 'str',
        bar: 10,
      });
      expect(res).to.be.eql({foo: 'str', bar: 10});
    });

    it('should not hide properties without rules for the INPUT scope', function () {
      class Target {
        foo?: string;
        bar?: number;
      }
      const res = applyProjection(ProjectionScope.INPUT, Target, {
        foo: 'str',
        bar: 10,
      });
      expect(res).to.be.eql({foo: 'str', bar: 10});
    });

    describe('INPUT scope', function () {
      it('should hide properties with the HIDE rule for the INPUT scope', function () {
        @noInput()
        class Target {
          foo?: string;
          bar?: number;
        }
        const res = applyProjection(ProjectionScope.INPUT, Target, {
          foo: 'str',
          bar: 10,
        });
        expect(res).to.be.eql({});
      });

      it('should not hide properties with the SHOW rule for the INPUT scope', function () {
        @allowInput()
        class Target {
          foo?: string;
          bar?: number;
        }
        const res = applyProjection(ProjectionScope.INPUT, Target, {
          foo: 'str',
          bar: 10,
        });
        expect(res).to.be.eql({foo: 'str', bar: 10});
      });

      it('should not hide properties with the HIDE rule for the OUTPUT scope', function () {
        @noOutput()
        class Target {
          foo?: string;
          bar?: number;
        }
        const res = applyProjection(ProjectionScope.INPUT, Target, {
          foo: 'str',
          bar: 10,
        });
        expect(res).to.be.eql({foo: 'str', bar: 10});
      });

      it('should not hide properties with the SHOW rule for the OUTPUT scope', function () {
        @allowOutput()
        class Target {
          foo?: string;
          bar?: number;
        }
        const res = applyProjection(ProjectionScope.INPUT, Target, {
          foo: 'str',
          bar: 10,
        });
        expect(res).to.be.eql({foo: 'str', bar: 10});
      });

      it('should not hide properties without rules', function () {
        class Target {
          foo?: string;
          bar?: number;
        }
        const res = applyProjection(ProjectionScope.INPUT, Target, {
          foo: 'str',
          bar: 10,
        });
        expect(res).to.be.eql({foo: 'str', bar: 10});
      });

      it('should not hide the property with the SHOW rule for the INPUT scope in the properties level', function () {
        @noInput()
        class Target {
          foo?: string;
          @allowInput()
          bar?: number;
        }
        const res = applyProjection(ProjectionScope.INPUT, Target, {
          foo: 'str',
          bar: 10,
        });
        expect(res).to.be.eql({bar: 10});
      });
    });

    describe('OUTPUT scope', function () {
      it('should not hide properties with the HIDE rule for the INPUT scope', function () {
        @noInput()
        class Target {
          foo?: string;
          bar?: number;
        }
        const res = applyProjection(ProjectionScope.OUTPUT, Target, {
          foo: 'str',
          bar: 10,
        });
        expect(res).to.be.eql({foo: 'str', bar: 10});
      });

      it('should not hide properties with the SHOW rule for the INPUT scope', function () {
        @allowInput()
        class Target {
          foo?: string;
          bar?: number;
        }
        const res = applyProjection(ProjectionScope.OUTPUT, Target, {
          foo: 'str',
          bar: 10,
        });
        expect(res).to.be.eql({foo: 'str', bar: 10});
      });

      it('should hide properties with the HIDE rule for the OUTPUT scope', function () {
        @noOutput()
        class Target {
          foo?: string;
          bar?: number;
        }
        const res = applyProjection(ProjectionScope.OUTPUT, Target, {
          foo: 'str',
          bar: 10,
        });
        expect(res).to.be.eql({});
      });

      it('should not hide properties with the SHOW rule for the OUTPUT scope', function () {
        @allowOutput()
        class Target {
          foo?: string;
          bar?: number;
        }
        const res = applyProjection(ProjectionScope.OUTPUT, Target, {
          foo: 'str',
          bar: 10,
        });
        expect(res).to.be.eql({foo: 'str', bar: 10});
      });

      it('should not hide the property with the SHOW rule for the OUTPUT scope in the property level', function () {
        @noOutput()
        class Target {
          @allowOutput()
          foo?: string;
        }
        const res = applyProjection(ProjectionScope.OUTPUT, Target, {
          foo: 'str',
        });
        expect(res).to.be.eql({foo: 'str'});
      });
    });
  });

  describe('property level rules', function () {
    it('should apply OUTPUT scope by default', function () {
      class Target {
        @noInput()
        foo?: string;
        @noOutput()
        bar?: number;
      }
      const res = applyProjection(Target, {foo: 'str', bar: 10});
      expect(res).to.be.eql({foo: 'str'});
    });

    describe('INPUT scope', function () {
      it('should hide the property with the HIDE rule for the INPUT scope', function () {
        class Target {
          @noInput()
          foo?: string;
        }
        const res = applyProjection(ProjectionScope.INPUT, Target, {
          foo: 'str',
        });
        expect(res).to.be.eql({});
      });

      it('should not hide the property with the SHOW rule for the INPUT scope', function () {
        class Target {
          @allowInput()
          foo?: string;
        }
        const res = applyProjection(ProjectionScope.INPUT, Target, {
          foo: 'str',
        });
        expect(res).to.be.eql({foo: 'str'});
      });

      it('should not hide the property with the HIDE rule for the OUTPUT scope', function () {
        class Target {
          @noOutput()
          foo?: string;
        }
        const res = applyProjection(ProjectionScope.INPUT, Target, {
          foo: 'str',
        });
        expect(res).to.be.eql({foo: 'str'});
      });

      it('should not hide the property with the SHOW rule for the OUTPUT scope', function () {
        class Target {
          @allowOutput()
          foo?: string;
        }
        const res = applyProjection(ProjectionScope.INPUT, Target, {
          foo: 'str',
        });
        expect(res).to.be.eql({foo: 'str'});
      });
    });

    describe('OUTPUT scope', function () {
      it('should not hide the property with the HIDE rule for the INPUT scope', function () {
        class Target {
          @noInput()
          foo?: string;
        }
        const res = applyProjection(ProjectionScope.OUTPUT, Target, {
          foo: 'str',
        });
        expect(res).to.be.eql({foo: 'str'});
      });

      it('should not hide the property with the SHOW rule for the INPUT scope', function () {
        class Target {
          @allowInput()
          foo?: string;
        }
        const res = applyProjection(ProjectionScope.OUTPUT, Target, {
          foo: 'str',
        });
        expect(res).to.be.eql({foo: 'str'});
      });

      it('should hide the property with the HIDE rule for the OUTPUT scope', function () {
        class Target {
          @noOutput()
          foo?: string;
        }
        const res = applyProjection(ProjectionScope.OUTPUT, Target, {
          foo: 'str',
        });
        expect(res).to.be.eql({});
      });

      it('should not hide the property with the SHOW rule for the OUTPUT scope', function () {
        class Target {
          @allowOutput()
          foo?: string;
        }
        const res = applyProjection(ProjectionScope.OUTPUT, Target, {
          foo: 'str',
        });
        expect(res).to.be.eql({foo: 'str'});
      });
    });
  });

  describe('embedded models', function () {
    it('should handle null and undefined properties gracefully for the INPUT scope', function () {
      class Embedded {
        foo?: string;
        bar?: number;
      }
      class Target {
        @embedded(() => Embedded)
        emb1?: Embedded;
        @embedded(() => Embedded)
        emb2?: Embedded;
      }
      const res = applyProjection(ProjectionScope.INPUT, Target, {
        emb1: null,
        emb2: undefined,
      });
      expect(res).to.be.eql({emb1: null, emb2: undefined});
    });

    it('should handle null and undefined properties gracefully for the OUTPUT scope', function () {
      class Embedded {
        foo?: string;
        bar?: number;
      }
      class Target {
        @embedded(() => Embedded)
        emb1?: Embedded;
        @embedded(() => Embedded)
        emb2?: Embedded;
      }
      const res = applyProjection(ProjectionScope.OUTPUT, Target, {
        emb1: null,
        emb2: undefined,
      });
      expect(res).to.be.eql({emb1: null, emb2: undefined});
    });

    describe('class level rules', function () {
      it('should apply OUTPUT scope by default', function () {
        @noOutput()
        class Embedded {
          foo?: string;
          bar?: number;
        }
        class Target {
          @embedded(() => Embedded)
          emb?: Embedded;
        }
        const res = applyProjection(Target, {emb: {foo: 'str', bar: 10}});
        expect(res).to.be.eql({emb: {}});
      });

      it('should not hide properties without rules for the OUTPUT scope', function () {
        class Embedded {
          foo?: string;
          bar?: number;
        }
        class Target {
          @embedded(() => Embedded)
          emb?: Embedded;
        }
        const res = applyProjection(ProjectionScope.OUTPUT, Target, {
          emb: {foo: 'str', bar: 10},
        });
        expect(res).to.be.eql({emb: {foo: 'str', bar: 10}});
      });

      it('should not hide properties without rules for the INPUT scope', function () {
        class Embedded {
          foo?: string;
          bar?: number;
        }
        class Target {
          @embedded(() => Embedded)
          emb?: Embedded;
        }
        const res = applyProjection(ProjectionScope.INPUT, Target, {
          emb: {foo: 'str', bar: 10},
        });
        expect(res).to.be.eql({emb: {foo: 'str', bar: 10}});
      });

      describe('INPUT scope', function () {
        it('should hide properties with the HIDE rule for the INPUT scope', function () {
          @noInput()
          class Embedded {
            foo?: string;
            bar?: number;
          }
          class Target {
            @embedded(() => Embedded)
            emb?: Embedded;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, {
            emb: {foo: 'str', bar: 10},
          });
          expect(res).to.be.eql({emb: {}});
        });

        it('should not hide properties with the SHOW rule for the INPUT scope', function () {
          @allowInput()
          class Embedded {
            foo?: string;
            bar?: number;
          }
          class Target {
            emb?: Embedded;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, {
            emb: {foo: 'str', bar: 10},
          });
          expect(res).to.be.eql({emb: {foo: 'str', bar: 10}});
        });

        it('should not hide properties with the HIDE rule for the OUTPUT scope', function () {
          @noOutput()
          class Embedded {
            foo?: string;
            bar?: number;
          }
          class Target {
            @embedded(() => Embedded)
            emb?: Embedded;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, {
            emb: {foo: 'str', bar: 10},
          });
          expect(res).to.be.eql({emb: {foo: 'str', bar: 10}});
        });

        it('should not hide properties with the SHOW rule for the OUTPUT scope', function () {
          @allowOutput()
          class Embedded {
            foo?: string;
            bar?: number;
          }
          class Target {
            @embedded(() => Embedded)
            emb?: Embedded;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, {
            emb: {foo: 'str', bar: 10},
          });
          expect(res).to.be.eql({emb: {foo: 'str', bar: 10}});
        });

        it('should not hide properties without rules', function () {
          class Embedded {
            foo?: string;
            bar?: number;
          }
          class Target {
            @embedded(() => Embedded)
            emb?: Embedded;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, {
            emb: {foo: 'str', bar: 10},
          });
          expect(res).to.be.eql({emb: {foo: 'str', bar: 10}});
        });

        it('should not hide the property with the SHOW rule for the INPUT scope in the properties level', function () {
          @noInput()
          class Embedded {
            foo?: string;
            @allowInput()
            bar?: number;
          }
          class Target {
            @embedded(() => Embedded)
            emb?: Embedded;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, {
            emb: {foo: 'str', bar: 10},
          });
          expect(res).to.be.eql({emb: {bar: 10}});
        });
      });

      describe('OUTPUT scope', function () {
        it('should not hide properties with the HIDE rule for the INPUT scope', function () {
          @noInput()
          class Embedded {
            foo?: string;
            bar?: number;
          }
          class Target {
            emb?: Embedded;
          }
          const res = applyProjection(ProjectionScope.OUTPUT, Target, {
            emb: {foo: 'str', bar: 10},
          });
          expect(res).to.be.eql({emb: {foo: 'str', bar: 10}});
        });

        it('should not hide properties with the SHOW rule for the INPUT scope', function () {
          @allowInput()
          class Embedded {
            foo?: string;
            bar?: number;
          }
          class Target {
            @embedded(() => Embedded)
            emb?: Embedded;
          }
          const res = applyProjection(ProjectionScope.OUTPUT, Target, {
            emb: {foo: 'str', bar: 10},
          });
          expect(res).to.be.eql({emb: {foo: 'str', bar: 10}});
        });

        it('should hide properties with the HIDE rule for the OUTPUT scope', function () {
          @noOutput()
          class Embedded {
            foo?: string;
            bar?: number;
          }
          class Target {
            @embedded(() => Embedded)
            emb?: Embedded;
          }
          const res = applyProjection(ProjectionScope.OUTPUT, Target, {
            emb: {foo: 'str', bar: 10},
          });
          expect(res).to.be.eql({emb: {}});
        });

        it('should not hide properties with the SHOW rule for the OUTPUT scope', function () {
          @allowOutput()
          class Embedded {
            foo?: string;
            bar?: number;
          }
          class Target {
            @embedded(() => Embedded)
            emb?: Embedded;
          }
          const res = applyProjection(ProjectionScope.OUTPUT, Target, {
            emb: {foo: 'str', bar: 10},
          });
          expect(res).to.be.eql({emb: {foo: 'str', bar: 10}});
        });

        it('should not hide the property with the SHOW rule for the OUTPUT scope in the property level', function () {
          @noOutput()
          class Embedded {
            @allowOutput()
            foo?: string;
          }
          class Target {
            @embedded(() => Embedded)
            emb?: Embedded;
          }
          const res = applyProjection(ProjectionScope.OUTPUT, Target, {
            emb: {foo: 'str'},
          });
          expect(res).to.be.eql({emb: {foo: 'str'}});
        });
      });
    });

    describe('property level rules', function () {
      it('should apply OUTPUT scope by default', function () {
        class Embedded {
          @noInput()
          foo?: string;
          @noOutput()
          bar?: number;
        }
        class Target {
          @embedded(() => Embedded)
          emb?: Embedded;
        }
        const res = applyProjection(Target, {emb: {foo: 'str', bar: 10}});
        expect(res).to.be.eql({emb: {foo: 'str'}});
      });

      describe('INPUT scope', function () {
        it('should hide the property with the HIDE rule for the INPUT scope', function () {
          class Embedded {
            @noInput()
            foo?: string;
          }
          class Target {
            @embedded(() => Embedded)
            emb?: Embedded;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, {
            emb: {foo: 'str'},
          });
          expect(res).to.be.eql({emb: {}});
        });

        it('should not hide the property with the SHOW rule for the INPUT scope', function () {
          class Embedded {
            @allowInput()
            foo?: string;
          }
          class Target {
            @embedded(() => Embedded)
            emb?: Embedded;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, {
            emb: {foo: 'str'},
          });
          expect(res).to.be.eql({emb: {foo: 'str'}});
        });

        it('should not hide the property with the HIDE rule for the OUTPUT scope', function () {
          class Embedded {
            @noOutput()
            foo?: string;
          }
          class Target {
            emb?: Embedded;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, {
            emb: {foo: 'str'},
          });
          expect(res).to.be.eql({emb: {foo: 'str'}});
        });

        it('should not hide the property with the SHOW rule for the OUTPUT scope', function () {
          class Embedded {
            @allowOutput()
            foo?: string;
          }
          class Target {
            @embedded(() => Embedded)
            emb?: Embedded;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, {
            emb: {foo: 'str'},
          });
          expect(res).to.be.eql({emb: {foo: 'str'}});
        });
      });

      describe('OUTPUT scope', function () {
        it('should not hide the property with the HIDE rule for the INPUT scope', function () {
          class Embedded {
            @noInput()
            foo?: string;
          }
          class Target {
            emb?: Embedded;
          }
          const res = applyProjection(ProjectionScope.OUTPUT, Target, {
            emb: {foo: 'str'},
          });
          expect(res).to.be.eql({emb: {foo: 'str'}});
        });

        it('should not hide the property with the SHOW rule for the INPUT scope', function () {
          class Embedded {
            @allowInput()
            foo?: string;
          }
          class Target {
            @embedded(() => Embedded)
            emb?: Embedded;
          }
          const res = applyProjection(ProjectionScope.OUTPUT, Target, {
            emb: {foo: 'str'},
          });
          expect(res).to.be.eql({emb: {foo: 'str'}});
        });

        it('should hide the property with the HIDE rule for the OUTPUT scope', function () {
          class Embedded {
            @noOutput()
            foo?: string;
          }
          class Target {
            @embedded(() => Embedded)
            emb?: Embedded;
          }
          const res = applyProjection(ProjectionScope.OUTPUT, Target, {
            emb: {foo: 'str'},
          });
          expect(res).to.be.eql({emb: {}});
        });

        it('should not hide the property with the SHOW rule for the OUTPUT scope', function () {
          class Embedded {
            @allowOutput()
            foo?: string;
          }
          class Target {
            @embedded(() => Embedded)
            emb?: Embedded;
          }
          const res = applyProjection(ProjectionScope.OUTPUT, Target, {
            emb: {foo: 'str'},
          });
          expect(res).to.be.eql({emb: {foo: 'str'}});
        });
      });
    });
  });

  describe('array handling', function () {
    it('should return an empty array if input is an empty array', function () {
      class Target {}
      const result = applyProjection(ProjectionScope.OUTPUT, Target, []);
      expect(result).to.be.an('array').with.lengthOf(0);
    });

    it('should handle null and undefined properties gracefully for the INPUT scope', function () {
      class Target {}
      const res = applyProjection(ProjectionScope.INPUT, Target, [
        null,
        undefined,
      ]);
      expect(res).to.be.eql([null, undefined]);
    });

    it('should handle null and undefined properties gracefully for the OUTPUT scope', function () {
      class Target {}
      const res = applyProjection(ProjectionScope.OUTPUT, Target, [
        null,
        undefined,
      ]);
      expect(res).to.be.eql([null, undefined]);
    });

    describe('class level rules', function () {
      it('should apply OUTPUT scope by default', function () {
        @noOutput()
        class Target {
          foo?: string;
          bar?: number;
        }
        const res = applyProjection(Target, [
          {foo: 'str', bar: 10},
          {foo: 'str', bar: 10},
        ]);
        expect(res).to.be.eql([{}, {}]);
      });

      it('should not hide properties without rules for the OUTPUT scope', function () {
        class Target {
          foo?: string;
          bar?: number;
        }
        const res = applyProjection(ProjectionScope.OUTPUT, Target, [
          {foo: 'str', bar: 10},
          {foo: 'str', bar: 10},
        ]);
        expect(res).to.be.eql([
          {foo: 'str', bar: 10},
          {foo: 'str', bar: 10},
        ]);
      });

      it('should not hide properties without rules for the INPUT scope', function () {
        class Target {
          foo?: string;
          bar?: number;
        }
        const res = applyProjection(ProjectionScope.INPUT, Target, [
          {foo: 'str', bar: 10},
          {foo: 'str', bar: 10},
        ]);
        expect(res).to.be.eql([
          {foo: 'str', bar: 10},
          {foo: 'str', bar: 10},
        ]);
      });

      describe('INPUT scope', function () {
        it('should hide properties with the HIDE rule for the INPUT scope', function () {
          @noInput()
          class Target {
            foo?: string;
            bar?: number;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, [
            {foo: 'str', bar: 10},
            {foo: 'str', bar: 10},
          ]);
          expect(res).to.be.eql([{}, {}]);
        });

        it('should not hide properties with the SHOW rule for the INPUT scope', function () {
          @allowInput()
          class Target {
            foo?: string;
            bar?: number;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, [
            {foo: 'str', bar: 10},
            {foo: 'str', bar: 10},
          ]);
          expect(res).to.be.eql([
            {foo: 'str', bar: 10},
            {foo: 'str', bar: 10},
          ]);
        });

        it('should not hide properties with the HIDE rule for the OUTPUT scope', function () {
          @noOutput()
          class Target {
            foo?: string;
            bar?: number;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, [
            {foo: 'str', bar: 10},
            {foo: 'str', bar: 10},
          ]);
          expect(res).to.be.eql([
            {foo: 'str', bar: 10},
            {foo: 'str', bar: 10},
          ]);
        });

        it('should not hide properties with the SHOW rule for the OUTPUT scope', function () {
          @allowOutput()
          class Target {
            foo?: string;
            bar?: number;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, [
            {foo: 'str', bar: 10},
            {foo: 'str', bar: 10},
          ]);
          expect(res).to.be.eql([
            {foo: 'str', bar: 10},
            {foo: 'str', bar: 10},
          ]);
        });

        it('should not hide properties without rules', function () {
          class Target {
            foo?: string;
            bar?: number;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, [
            {foo: 'str', bar: 10},
            {foo: 'str', bar: 10},
          ]);
          expect(res).to.be.eql([
            {foo: 'str', bar: 10},
            {foo: 'str', bar: 10},
          ]);
        });

        it('should not hide the property with the SHOW rule for the INPUT scope in the properties level', function () {
          @noInput()
          class Target {
            foo?: string;
            @allowInput()
            bar?: number;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, [
            {foo: 'str', bar: 10},
            {foo: 'str', bar: 10},
          ]);
          expect(res).to.be.eql([{bar: 10}, {bar: 10}]);
        });
      });

      describe('OUTPUT scope', function () {
        it('should not hide properties with the HIDE rule for the INPUT scope', function () {
          @noInput()
          class Target {
            foo?: string;
            bar?: number;
          }
          const res = applyProjection(ProjectionScope.OUTPUT, Target, [
            {foo: 'str', bar: 10},
            {foo: 'str', bar: 10},
          ]);
          expect(res).to.be.eql([
            {foo: 'str', bar: 10},
            {foo: 'str', bar: 10},
          ]);
        });

        it('should not hide properties with the SHOW rule for the INPUT scope', function () {
          @allowInput()
          class Target {
            foo?: string;
            bar?: number;
          }
          const res = applyProjection(ProjectionScope.OUTPUT, Target, [
            {foo: 'str', bar: 10},
            {foo: 'str', bar: 10},
          ]);
          expect(res).to.be.eql([
            {foo: 'str', bar: 10},
            {foo: 'str', bar: 10},
          ]);
        });

        it('should hide properties with the HIDE rule for the OUTPUT scope', function () {
          @noOutput()
          class Target {
            foo?: string;
            bar?: number;
          }
          const res = applyProjection(ProjectionScope.OUTPUT, Target, [
            {foo: 'str', bar: 10},
            {foo: 'str', bar: 10},
          ]);
          expect(res).to.be.eql([{}, {}]);
        });

        it('should not hide properties with the SHOW rule for the OUTPUT scope', function () {
          @allowOutput()
          class Target {
            foo?: string;
            bar?: number;
          }
          const res = applyProjection(ProjectionScope.OUTPUT, Target, [
            {foo: 'str', bar: 10},
            {foo: 'str', bar: 10},
          ]);
          expect(res).to.be.eql([
            {foo: 'str', bar: 10},
            {foo: 'str', bar: 10},
          ]);
        });

        it('should not hide the property with the SHOW rule for the OUTPUT scope in the property level', function () {
          @noOutput()
          class Target {
            @allowOutput()
            foo?: string;
          }
          const res = applyProjection(ProjectionScope.OUTPUT, Target, [
            {foo: 'str'},
            {foo: 'str'},
          ]);
          expect(res).to.be.eql([{foo: 'str'}, {foo: 'str'}]);
        });
      });
    });

    describe('property level rules', function () {
      it('should apply OUTPUT scope by default', function () {
        class Target {
          @noInput()
          foo?: string;
          @noOutput()
          bar?: number;
        }
        const res = applyProjection(Target, [
          {foo: 'str', bar: 10},
          {foo: 'str', bar: 10},
        ]);
        expect(res).to.be.eql([{foo: 'str'}, {foo: 'str'}]);
      });

      describe('INPUT scope', function () {
        it('should hide the property with the HIDE rule for the INPUT scope', function () {
          class Target {
            @noInput()
            foo?: string;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, [
            {foo: 'str'},
            {foo: 'str'},
          ]);
          expect(res).to.be.eql([{}, {}]);
        });

        it('should not hide the property with the SHOW rule for the INPUT scope', function () {
          class Target {
            @allowInput()
            foo?: string;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, [
            {foo: 'str'},
            {foo: 'str'},
          ]);
          expect(res).to.be.eql([{foo: 'str'}, {foo: 'str'}]);
        });

        it('should not hide the property with the HIDE rule for the OUTPUT scope', function () {
          class Target {
            @noOutput()
            foo?: string;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, [
            {foo: 'str'},
            {foo: 'str'},
          ]);
          expect(res).to.be.eql([{foo: 'str'}, {foo: 'str'}]);
        });

        it('should not hide the property with the SHOW rule for the OUTPUT scope', function () {
          class Target {
            @allowOutput()
            foo?: string;
          }
          const res = applyProjection(ProjectionScope.INPUT, Target, [
            {foo: 'str'},
            {foo: 'str'},
          ]);
          expect(res).to.be.eql([{foo: 'str'}, {foo: 'str'}]);
        });
      });

      describe('OUTPUT scope', function () {
        it('should not hide the property with the HIDE rule for the INPUT scope', function () {
          class Target {
            @noInput()
            foo?: string;
          }
          const res = applyProjection(ProjectionScope.OUTPUT, Target, [
            {foo: 'str'},
            {foo: 'str'},
          ]);
          expect(res).to.be.eql([{foo: 'str'}, {foo: 'str'}]);
        });

        it('should not hide the property with the SHOW rule for the INPUT scope', function () {
          class Target {
            @allowInput()
            foo?: string;
          }
          const res = applyProjection(ProjectionScope.OUTPUT, Target, [
            {foo: 'str'},
            {foo: 'str'},
          ]);
          expect(res).to.be.eql([{foo: 'str'}, {foo: 'str'}]);
        });

        it('should hide the property with the HIDE rule for the OUTPUT scope', function () {
          class Target {
            @noOutput()
            foo?: string;
          }
          const res = applyProjection(ProjectionScope.OUTPUT, Target, [
            {foo: 'str'},
            {foo: 'str'},
          ]);
          expect(res).to.be.eql([{}, {}]);
        });

        it('should not hide the property with the SHOW rule for the OUTPUT scope', function () {
          class Target {
            @allowOutput()
            foo?: string;
          }
          const res = applyProjection(ProjectionScope.OUTPUT, Target, [
            {foo: 'str'},
            {foo: 'str'},
          ]);
          expect(res).to.be.eql([{foo: 'str'}, {foo: 'str'}]);
        });
      });
    });
  });
});
