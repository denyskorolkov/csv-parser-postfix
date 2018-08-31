import assert from 'assert';
import parser from '../src/parser';

describe('CSV parser with postfix', function() {
  describe('postfix', function() {
    it('1+2', function() {
      assert.equal(parser('1 2+'), '3');
    });

    it('12+', function() {
      assert.equal(parser('12+'), '#ERR');
    });

    it('1 2', function() {
      assert.equal(parser('1 2'), '#ERR');
    });

    it('2', function() {
      assert.equal(parser('2'), '2');
    });

    it('+', function() {
      assert.equal(parser('+'), '#ERR');
    });

    it('1 2 -', function() {
      assert.equal(parser('1 2 -'), '-1');
    });

    it('2 2*', function() {
      assert.equal(parser('2 2*'), '4');
    });

    it('4 2 /', function() {
      assert.equal(parser('4 2 /'), '2');
    });

    it('5 1 2+4*+3-', function() {
      assert.equal(parser('5 1 2+4*+3-'), '14');
    });
  });
  describe('parser', function() {
    it('linked', function() {
      assert.deepEqual(
        parser(
          `b2,,1
1,c3,1
1,1,5`
        ),
        `5,0,1
1,5,1
1,1,5`
      );
    });
  });
});
