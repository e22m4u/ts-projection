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
import { ProjectionRule } from '../../projection.js';
import { ProjectionScope } from '../../projection.js';
import { hidden } from './projection-rule-decorator.js';
import { noInput } from './projection-rule-decorator.js';
import { visible } from './projection-rule-decorator.js';
import { noOutput } from './projection-rule-decorator.js';
import { allowInput } from './projection-rule-decorator.js';
import { allowOutput } from './projection-rule-decorator.js';
import { projectionRule } from './projection-rule-decorator.js';
import { ProjectionRuleReflector } from './projection-rule-reflector.js';
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
function entries(map) {
    return Array.from(map.entries());
}
describe('projectionRule', function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projectionRuleAny = projectionRule;
    it('should throw the error for the static property', function () {
        const throwable = () => {
            class Target {
                static prop;
            }
            __decorate([
                projectionRuleAny(MD1),
                __metadata("design:type", Object)
            ], Target, "prop", void 0);
        };
        expect(throwable).to.throw('Projection rule decorator is only supported ' +
            'for a class or an instance property.');
    });
    it('should throw the error for the static method', function () {
        const throwable = () => {
            class Target {
                method() { }
            }
            __decorate([
                projectionRuleAny(MD1),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], Target.prototype, "method", null);
        };
        expect(throwable).to.throw('Projection rule decorator is only supported ' +
            'for a class or an instance property.');
    });
    it('should throw the error for the static method parameter', function () {
        const throwable = () => {
            class Target {
                static method(param) { }
            }
            __decorate([
                __param(0, projectionRuleAny(MD1)),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [Object]),
                __metadata("design:returntype", void 0)
            ], Target, "method", null);
        };
        expect(throwable).to.throw('Projection rule decorator is only supported ' +
            'for a class or an instance property.');
    });
    it('should throw the error for the instance method', function () {
        const throwable = () => {
            class Target {
                method() { }
            }
            __decorate([
                projectionRuleAny(MD1),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], Target.prototype, "method", null);
        };
        expect(throwable).to.throw('Projection rule decorator is only supported ' +
            'for a class or an instance property.');
    });
    it('should throw the error for the instance method parameter', function () {
        const throwable = () => {
            class Target {
                method(param) { }
            }
            __decorate([
                __param(0, projectionRuleAny(MD1)),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [Object]),
                __metadata("design:returntype", void 0)
            ], Target.prototype, "method", null);
        };
        expect(throwable).to.throw('Projection rule decorator is only supported ' +
            'for a class or an instance property.');
    });
    describe('class level rules', function () {
        it('should set the metadata to the target', function () {
            let Target = class Target {
            };
            Target = __decorate([
                projectionRule(MD1)
            ], Target);
            const res = ProjectionRuleReflector.getClassMetadata(Target);
            expect(res).to.be.eql([MD1]);
        });
        it('should set multiple metadata to the target', function () {
            let Target = class Target {
            };
            Target = __decorate([
                projectionRule(MD2),
                projectionRule(MD1)
            ], Target);
            const res = ProjectionRuleReflector.getClassMetadata(Target);
            expect(res).to.be.eql([MD1, MD2]);
        });
        describe('decorator aliases', function () {
            describe('hidden', function () {
                it('should set the HIDE rule for INPUT scope', function () {
                    let Target = class Target {
                    };
                    Target = __decorate([
                        hidden()
                    ], Target);
                    const md = { scope: ProjectionScope.OUTPUT, rule: ProjectionRule.HIDE };
                    const res = ProjectionRuleReflector.getClassMetadata(Target);
                    expect(res).to.be.eql([md]);
                });
            });
            describe('visible', function () {
                it('should set the SHOW rule for INPUT scope', function () {
                    let Target = class Target {
                    };
                    Target = __decorate([
                        visible()
                    ], Target);
                    const res = ProjectionRuleReflector.getClassMetadata(Target);
                    const md = { scope: ProjectionScope.OUTPUT, rule: ProjectionRule.SHOW };
                    expect(res).to.be.eql([md]);
                });
            });
            describe('noInput', function () {
                it('should set the HIDE rule for INPUT scope', function () {
                    let Target = class Target {
                    };
                    Target = __decorate([
                        noInput()
                    ], Target);
                    const md = { scope: ProjectionScope.INPUT, rule: ProjectionRule.HIDE };
                    const res = ProjectionRuleReflector.getClassMetadata(Target);
                    expect(res).to.be.eql([md]);
                });
            });
            describe('allowInput', function () {
                it('should set the SHOW rule for INPUT scope', function () {
                    let Target = class Target {
                    };
                    Target = __decorate([
                        allowInput()
                    ], Target);
                    const md = { scope: ProjectionScope.INPUT, rule: ProjectionRule.SHOW };
                    const res = ProjectionRuleReflector.getClassMetadata(Target);
                    expect(res).to.be.eql([md]);
                });
            });
            describe('noOutput', function () {
                it('should set the HIDE rule for OUTPUT scope', function () {
                    let Target = class Target {
                    };
                    Target = __decorate([
                        noOutput()
                    ], Target);
                    const md = { scope: ProjectionScope.OUTPUT, rule: ProjectionRule.HIDE };
                    const res = ProjectionRuleReflector.getClassMetadata(Target);
                    expect(res).to.be.eql([md]);
                });
            });
            describe('allowOutput', function () {
                it('should set the SHOW rule for OUTPUT scope', function () {
                    let Target = class Target {
                    };
                    Target = __decorate([
                        allowOutput()
                    ], Target);
                    const md = { scope: ProjectionScope.OUTPUT, rule: ProjectionRule.SHOW };
                    const res = ProjectionRuleReflector.getClassMetadata(Target);
                    expect(res).to.be.eql([md]);
                });
            });
        });
    });
    describe('property level rules', function () {
        it('should set the metadata to the target property', function () {
            class Target {
                prop;
            }
            __decorate([
                projectionRule(MD1),
                __metadata("design:type", String)
            ], Target.prototype, "prop", void 0);
            const res = ProjectionRuleReflector.getPropertiesMetadata(Target);
            expect(entries(res)).to.be.eql([['prop', [MD1]]]);
        });
        it('should set multiple metadata to the target property', function () {
            class Target {
                prop;
            }
            __decorate([
                projectionRule(MD2),
                projectionRule(MD1),
                __metadata("design:type", String)
            ], Target.prototype, "prop", void 0);
            const res = ProjectionRuleReflector.getPropertiesMetadata(Target);
            expect(entries(res)).to.be.eql([['prop', [MD1, MD2]]]);
        });
        it('should set metadata to the target properties', function () {
            class Target {
                prop1;
                prop2;
            }
            __decorate([
                projectionRule(MD1),
                __metadata("design:type", String)
            ], Target.prototype, "prop1", void 0);
            __decorate([
                projectionRule(MD2),
                __metadata("design:type", String)
            ], Target.prototype, "prop2", void 0);
            const res = ProjectionRuleReflector.getPropertiesMetadata(Target);
            expect(entries(res)).to.be.eql([
                ['prop1', [MD1]],
                ['prop2', [MD2]],
            ]);
        });
        describe('decorator aliases', function () {
            describe('hidden', function () {
                it('should set the HIDE rule for OUTPUT scope', function () {
                    class Target {
                        prop;
                    }
                    __decorate([
                        hidden(),
                        __metadata("design:type", Object)
                    ], Target.prototype, "prop", void 0);
                    const md = { scope: ProjectionScope.OUTPUT, rule: ProjectionRule.HIDE };
                    const res = ProjectionRuleReflector.getPropertiesMetadata(Target);
                    expect(entries(res)).to.be.eql([['prop', [md]]]);
                });
            });
            describe('visible', function () {
                it('should set the SHOW rule for OUTPUT scope', function () {
                    class Target {
                        prop;
                    }
                    __decorate([
                        visible(),
                        __metadata("design:type", Object)
                    ], Target.prototype, "prop", void 0);
                    const md = { scope: ProjectionScope.OUTPUT, rule: ProjectionRule.SHOW };
                    const res = ProjectionRuleReflector.getPropertiesMetadata(Target);
                    expect(entries(res)).to.be.eql([['prop', [md]]]);
                });
            });
            describe('noInput', function () {
                it('should set the HIDE rule for INPUT scope', function () {
                    class Target {
                        prop;
                    }
                    __decorate([
                        noInput(),
                        __metadata("design:type", Object)
                    ], Target.prototype, "prop", void 0);
                    const md = { scope: ProjectionScope.INPUT, rule: ProjectionRule.HIDE };
                    const res = ProjectionRuleReflector.getPropertiesMetadata(Target);
                    expect(entries(res)).to.be.eql([['prop', [md]]]);
                });
            });
            describe('allowInput', function () {
                it('should set the SHOW rule for INPUT scope', function () {
                    class Target {
                        prop;
                    }
                    __decorate([
                        allowInput(),
                        __metadata("design:type", Object)
                    ], Target.prototype, "prop", void 0);
                    const md = { scope: ProjectionScope.INPUT, rule: ProjectionRule.SHOW };
                    const res = ProjectionRuleReflector.getPropertiesMetadata(Target);
                    expect(entries(res)).to.be.eql([['prop', [md]]]);
                });
            });
            describe('noOutput', function () {
                it('should set the HIDE rule for OUTPUT scope', function () {
                    class Target {
                        prop;
                    }
                    __decorate([
                        noOutput(),
                        __metadata("design:type", Object)
                    ], Target.prototype, "prop", void 0);
                    const md = { scope: ProjectionScope.OUTPUT, rule: ProjectionRule.HIDE };
                    const res = ProjectionRuleReflector.getPropertiesMetadata(Target);
                    expect(entries(res)).to.be.eql([['prop', [md]]]);
                });
            });
            describe('allowOutput', function () {
                it('should set the SHOW rule for OUTPUT scope', function () {
                    class Target {
                        prop;
                    }
                    __decorate([
                        allowOutput(),
                        __metadata("design:type", Object)
                    ], Target.prototype, "prop", void 0);
                    const md = { scope: ProjectionScope.OUTPUT, rule: ProjectionRule.SHOW };
                    const res = ProjectionRuleReflector.getPropertiesMetadata(Target);
                    expect(entries(res)).to.be.eql([['prop', [md]]]);
                });
            });
        });
    });
});
