import assert from 'assert';
import parser from '../src/parser';

//   console.log(postFixExec([]));
//   console.log(postFixExec([3]));
//   console.log(postFixExec([2, 3]));
//   console.log(postFixExec(['+']));
//   console.log(postFixExec(['+', 3]));
//   console.log(postFixExec([3, 4, '+']));
//   console.log(postFixExec([5, '+', 2, '+', 4, '*', '+', 3, '-']));
//   console.log(postFixExec([5, 1, 2, '+', 4, '*', '+', 3, '-']));
//   console.log(postFixExec([5, 1, 2, '+', 4, '*', '+', 3]));

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
    it('linked forward', function() {
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

    it('linked back', function() {
      assert.deepEqual(
        parser(
          `5,,1
1,a1,1
1,1,b2`
        ),
        `5,0,1
1,5,1
1,1,5`
      );
    });

    it('sample', function() {
      assert.deepEqual(
        parser(`b1 b2 +,2 b2 3 * -,3 ,+
a1,5 ,,7 2/
c2 3*,1 2 , ,5 1 2+4*+3-`),
        `-8,-13,3,#ERR
-8,5,0,5
0,#ERR,0,14`
      );
    });
  });
});
