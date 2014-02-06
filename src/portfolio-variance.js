function avg (X) {
  var N = X.length;
  var sum = 0;
  for (var i = 0; i < N; i++) {
    sum += X[i];
  }
  return sum / N;
}

function variance (X) {
  var N = X.length;
  var sum = 0;
  var avgX = avg(X);
  for (var i = 0; i < N; i++) {
    sum += Math.pow(X[i] - avgX, 2);
  }
  return sum/(N-1);
}

function stdev (X) {
  return Math.sqrt(variance(X));
}

function covar (X, Y) {
  var N = X.length;
  if (N !== Y.length) {
    throw new Error('must be the same length');
  }
  var result = 0;
  var avgX = avg(X);
  var avgY = avg(Y);
  var n = N;
  while (n--) {
    result += (X[n]-avgX) * (Y[n]-avgY);
  }
  return result/(N-1);
}

function portfolioVariance (securities) { // vars is a bi-dimensional array
  var nsecs = securities.length;
  var weights = 1 / nsecs;
  var weightSquare = weights*weights;
  var n = nsecs;
  var pv = 0;
  while (n--) {
    var sec = securities[n];
    var varSec = variance(sec);
    pv += weightSquare*varSec;
    var i = nsecs;
    while (i--) {
      var sec2 = securities[i];
      pv += 2*
            weightSquare*
            Math.sqrt(varSec)*
            stdev(sec2)*
            covar(sec, sec2);
    }
  }
  return pv;
}

module.exports = portfolioVariance;