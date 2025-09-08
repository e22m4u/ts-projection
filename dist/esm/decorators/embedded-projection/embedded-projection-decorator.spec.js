var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect } from 'chai';
import { embedded } from './embedded-projection-decorator.js';
import { embeddedProjection } from './embedded-projection-decorator.js';
import { EmbeddedProjectionReflector } from './embedded-projection-reflector.js';
class EmbeddedModel {
}
class AnotherEmbeddedModel {
}
const MD1 = { model: () => EmbeddedModel };
const MD2 = { model: () => AnotherEmbeddedModel };
/**
 * Утилита извлекает массив кортежей, содержащий
 * ключи и значения полученного Map.
 *
 * @param map
 */
function entries(map) {
    return Array.from(map.entries());
}
describe('embeddedProjection', function () {
    it('should set the metadata to the target property', function () {
        class Target {
            prop;
        }
        __decorate([
            embeddedProjection(MD1),
            __metadata("design:type", Object)
        ], Target.prototype, "prop", void 0);
        const res = EmbeddedProjectionReflector.getPropertiesMetadata(Target);
        expect(entries(res)).to.be.eql([['prop', MD1]]);
    });
    it('should override the property metadata', function () {
        class Target {
            prop;
        }
        __decorate([
            embeddedProjection(MD2),
            embeddedProjection(MD1),
            __metadata("design:type", Object)
        ], Target.prototype, "prop", void 0);
        const res = EmbeddedProjectionReflector.getPropertiesMetadata(Target);
        expect(entries(res)).to.be.eql([['prop', MD2]]);
    });
    describe('inheritance', function () {
        it('should override the inherited property metadata', function () {
            class BaseTarget {
                prop;
            }
            __decorate([
                embeddedProjection(MD1),
                __metadata("design:type", Object)
            ], BaseTarget.prototype, "prop", void 0);
            class Target extends BaseTarget {
            }
            __decorate([
                embeddedProjection(MD2),
                __metadata("design:type", Object)
            ], Target.prototype, "prop", void 0);
            const res = EmbeddedProjectionReflector.getPropertiesMetadata(Target);
            expect(entries(res)).to.be.eql([['prop', MD2]]);
        });
        it('should not affect the parent property metadata', function () {
            class BaseTarget {
                prop;
            }
            __decorate([
                embeddedProjection(MD1),
                __metadata("design:type", Object)
            ], BaseTarget.prototype, "prop", void 0);
            class Target extends BaseTarget {
            }
            __decorate([
                embeddedProjection(MD2),
                __metadata("design:type", Object)
            ], Target.prototype, "prop", void 0);
            const res = EmbeddedProjectionReflector.getPropertiesMetadata(BaseTarget);
            expect(entries(res)).to.be.eql([['prop', MD1]]);
        });
    });
    describe('invalid decorator target', function () {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const embeddedProjectionAny = embeddedProjection;
        it('should throw the error for the class', function () {
            const throwable = () => {
                let Target = class Target {
                };
                Target = __decorate([
                    embeddedProjectionAny(MD1)
                ], Target);
            };
            expect(throwable).to.throw('Embedded projection decorator is only supported ' +
                'for an instance property.');
        });
        it('should throw the error for the static property', function () {
            const throwable = () => {
                class Target {
                    static prop;
                }
                __decorate([
                    embeddedProjectionAny(MD1),
                    __metadata("design:type", Object)
                ], Target, "prop", void 0);
            };
            expect(throwable).to.throw('Embedded projection decorator is only supported ' +
                'for an instance property.');
        });
        it('should throw the error for the static method', function () {
            const throwable = () => {
                class Target {
                    static method() { }
                }
                __decorate([
                    embeddedProjectionAny(MD1),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], Target, "method", null);
            };
            expect(throwable).to.throw('Embedded projection decorator is only supported ' +
                'for an instance property.');
        });
        it('should throw the error for the static method parameter', function () {
            const throwable = () => {
                class Target {
                    static method(param) { }
                }
                __decorate([
                    __param(0, embeddedProjectionAny(MD1)),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object]),
                    __metadata("design:returntype", void 0)
                ], Target, "method", null);
            };
            expect(throwable).to.throw('Embedded projection decorator is only supported ' +
                'for an instance property.');
        });
        it('should throw the error for the instance method', function () {
            const throwable = () => {
                class Target {
                    method() { }
                }
                __decorate([
                    embeddedProjectionAny(MD1),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], Target.prototype, "method", null);
            };
            expect(throwable).to.throw('Embedded projection decorator is only supported ' +
                'for an instance property.');
        });
        it('should throw the error for the static instance method parameter', function () {
            const throwable = () => {
                class Target {
                    method(param) { }
                }
                __decorate([
                    __param(0, embeddedProjectionAny(MD1)),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object]),
                    __metadata("design:returntype", void 0)
                ], Target.prototype, "method", null);
            };
            expect(throwable).to.throw('Embedded projection decorator is only supported ' +
                'for an instance property.');
        });
    });
    describe('decorator aliases', function () {
        describe('embedded', function () {
            it('should set the given factory to the property metadata', function () {
                const factory = () => EmbeddedModel;
                class Target {
                    param;
                }
                __decorate([
                    embedded(factory),
                    __metadata("design:type", Object)
                ], Target.prototype, "param", void 0);
                const md = { model: factory };
                const res = EmbeddedProjectionReflector.getPropertiesMetadata(Target);
                expect(entries(res)).to.be.eql([['param', md]]);
            });
        });
    });
});
