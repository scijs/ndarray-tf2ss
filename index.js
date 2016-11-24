'use strict';

const ndarray = require('ndarray');

const singleTF2SS = function tf2ss (y, x) {
  let tol = 1e-14;
  let n = x.shape[1] - 1;
  let m = y.shape[1] - 1;

  if (Math.abs(x.get(0, 0) - 1) > tol) {
    throw new Error('Leading 1 must be included in x argument.');
  }
  if (m > n) {
    throw new Error('Causality violated. Cannot compute state-space control matrices.');
  }
  let A = ndarray(new Float64Array(n * n), [n, n]);
  let B = ndarray(new Float64Array(n), [n, 1]);
  let C = ndarray(new Float64Array(n), [1, n]);
  let D = ndarray(new Float64Array(1), [1, 1]);

  let i = 0;
  let j = 0;
  let k = 0;
  let r = 0;

  // Initialize matrices
  B.set(0, 0, 1);
  for (i = 1; i < n; ++i) {
    for (j = 0; j < n; ++j) {
      // Initialize A
      if (i === j + 1) {
        A.set(i, j, 1);
      } else {
        A.set(i, j, 0);
      }
    }
    // Initialize B
    B.set(i, 0, 0);
    // Initialize C
    C.set(0, i, 0);
  }

  // Compute A values
  for (i = 1; i <= n; ++i) {
    A.set(0, i - 1, x.get(0, i));
  }
  // Compute C values
  k = m;
  r = n;
  let bn = 0;
  if (m === n) {
    bn = y.get(0, 0);
  }
  // Compute D values
  D.set(0, 0, bn);
  for (i = n - 1; i >= 0; --i) {
    let bi = 0;
    let ai = 0;
    if (k >= 0) {
      bi = y.get(0, k);
    }
    if (r >= 0) {
      ai = x.get(0, r);
    }
    C.set(0, i, bi - ai * bn);
    k--;
    r--;
  }

  return {
    A: A,
    B: B,
    C: C,
    D: D
  };
};

module.exports = function tf2ss (y, x) {
  if (y.shape[0] === 1 && x.shape[0] === 1) {
    return singleTF2SS(y, x);
  } else if (y.shape[0] > 1 && x.shape[0] === 1) {
    throw new Error('SIMO functions are not yet supported.');
  } else if (y.shape[0] > 1 && x.shape[0] > 1) {
    throw new Error('MIMO functions are not yet supported.');
  } else {
    throw new Error('Invalid arguments.');
  }
};
