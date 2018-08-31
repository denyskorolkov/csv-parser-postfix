"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const parser_1 = __importDefault(require("../src/parser"));
describe('CSV parser with postfix', function () {
    describe('postfix', function () {
        it('1+2', function () {
            assert_1.default.equal(parser_1.default('1 2+'), '3');
        });
        it('12+', function () {
            assert_1.default.equal(parser_1.default('12+'), '#ERR');
        });
        it('1 2', function () {
            assert_1.default.equal(parser_1.default('1 2'), '#ERR');
        });
        it('2', function () {
            assert_1.default.equal(parser_1.default('2'), '2');
        });
        it('+', function () {
            assert_1.default.equal(parser_1.default('+'), '#ERR');
        });
        it('1 2 -', function () {
            assert_1.default.equal(parser_1.default('1 2 -'), '-1');
        });
        it('2 2*', function () {
            assert_1.default.equal(parser_1.default('2 2*'), '4');
        });
        it('4 2 /', function () {
            assert_1.default.equal(parser_1.default('4 2 /'), '2');
        });
        it('5 1 2+4*+3-', function () {
            assert_1.default.equal(parser_1.default('5 1 2+4*+3-'), '14');
        });
    });
    describe('parser', function () {
        it('linked', function () {
            assert_1.default.deepEqual(parser_1.default(`b2,,1
1,c3,1
1,1,5`), `5,0,1
1,5,1
1,1,5`);
        });
    });
});
//# sourceMappingURL=test.js.map