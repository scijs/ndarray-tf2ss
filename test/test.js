'use strict';

const ndarray = require('ndarray');
const tf2ss = require('../index.js');
const assert = require('chai').assert;

describe('Input Validation', function () {
  it('should error when y.length is longer than x.length', function () {
    let fn = function () {
      let y = ndarray(new Float64Array([0, 3, 2, 3]), [1, 4]);
      let x = ndarray(new Float64Array([1, 0.4, 1]), [1, 3]);
      return tf2ss(y, x);
    };
    assert.throws(fn,
      Error,
      'Causality violated. Cannot compute state-space control matrices.',
      'not throwing properly');
  });
});
describe('Logic Tests', function () {
  it('Single Input, Single Output Function, m < n', function () {
    let y = ndarray(new Float64Array([2, 3]), [1, 2]);
    let x = ndarray(new Float64Array([1, 0.4, 1]), [1, 3]);
    let ssInfo = tf2ss(y, x);
    let A = ssInfo.A;
    let B = ssInfo.B;
    let C = ssInfo.C;
    let D = ssInfo.D;
    assert.deepEqual(A, ndarray(new Float64Array([0.4, 1, 1, 0]), [2, 2]), 'A matrix is wrong');
    assert.deepEqual(B, ndarray(new Float64Array([1, 0]), [2, 1]), 'B matrix is wrong');
    assert.deepEqual(C, ndarray(new Float64Array([2, 3]), [1, 2]), 'C matrix is wrong');
    assert.deepEqual(D, ndarray(new Float64Array([0]), [1, 1]), 'D matrix is wrong');
  });
  it('Single Input, Single Output Function, m = n', function () {
    let y = ndarray(new Float64Array([1, 2, 1]), [1, 3]);
    let x = ndarray(new Float64Array([1, 0.4, 1]), [1, 3]);
    let ssInfo = tf2ss(y, x);
    let A = ssInfo.A;
    let B = ssInfo.B;
    let C = ssInfo.C;
    let D = ssInfo.D;
    assert.deepEqual(A, ndarray(new Float64Array([0.4, 1, 1, 0]), [2, 2]), 'A matrix is wrong');
    assert.deepEqual(B, ndarray(new Float64Array([1, 0]), [2, 1]), 'B matrix is wrong');
    assert.deepEqual(C, ndarray(new Float64Array([1.6, 0]), [1, 2]), 'C matrix is wrong');
    assert.deepEqual(D, ndarray(new Float64Array([1]), [1, 1]), 'D matrix is wrong');
  });
});
