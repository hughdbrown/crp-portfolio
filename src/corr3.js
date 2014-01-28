function avg (X) {
  var N = X.length;
  var sum = 0;
  for (var i = 0; i < N; i++) {
    sum += X[i];
  }
  return sum / N;
}

function stdev (X) {
  var N = X.length;
  var sum = 0;
  var avgX = avg(X);
  for (var i = 0; i < N; i++) {
    sum += Math.pow(X[i] - avgX, 2);
  }
  return Math.sqrt(sum/(N-1));
}

function COVAR3 (X, Y, Z) {
  if (X.length !== Y.length ||
      Y.length !== Z.length) {
    throw new Error('they need to have the same number of observations');
  }

  var N = X.length;

  var XYZ = [];
  var XY = [];
  var XZ = [];
  var YZ = [];
  for (var i = 0; i < N; i++) {
    XYZ.push(X[i]*Y[i]*Z[i]);
    XY.push(X[i]*Y[i]);
    XZ.push(X[i]*Z[i]);
    YZ.push(Y[i]*Z[i]);
  }

  var EXYZ = avg(XYZ);
  var EXY = avg(XY);
  var EXZ = avg(XZ);
  var EYZ = avg(YZ);
  var EX = avg(X);
  var EY = avg(Y);
  var EZ = avg(Z);

  var COVAR = EXYZ -
              EX*EYZ -
              EY*EXZ -
              EZ*EXY +
              2*EX*EY*EZ;

  return COVAR;
}

function CORR3 (X, Y, Z) {
  var stdevX = stdev(X);
  var stdevY = stdev(Y);
  var stdevZ = stdev(Z);
  var COVARXYZ = COVAR3(X, Y, Z);
  return COVARXYZ / (stdevX*stdevY*stdevZ);
}

module.exports = CORR3;