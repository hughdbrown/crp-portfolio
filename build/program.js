(function(e){if("function"==typeof bootstrap)bootstrap("run",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeRun=e}else"undefined"!=typeof window?window.Run=e():global.Run=e()})(function(){var define,ses,bootstrap,module,exports;
return (function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],2:[function(require,module,exports){
(function(process){var returns = require('./returns.json');
var portFolioVariance = require('./portfolio-variance');

var stocks = Object.keys(returns);
var nStocks = stocks.length;

var DEBUG = process.env.DEBUG !== undefined;

function random (max) {
  return Math.floor(Math.random() * max);
}

function lowestScore (c1, c2) {
  return c1.r - c2.r;
}

function Run(data) {
  var start;
  if (DEBUG) {
    start = Date.now();
  }
  var uniqueCorrs = {};
  var corrs = [];
  var I;
  var N;

  if (Number.isFinite(data)) {
    I = data;
  }

  if (data.I) {
    I = data.I;
  }

  if (data.N) {
    N = data.N;
  }

  if (!I || I < 3) {
    I = 5;
  }

  if (!N || N < 100) {
    N = 40000;
  }

  var n = N;
  while (n--) {
    var i = I;
    var key = [];
    var portfolio = [];
    while (i--) {
      var stock = random(nStocks);
      while (key.indexOf(stock) > -1) {
        stock = random(nStocks);
      }
      key.push(stock);
      portfolio.push(returns[stocks[stock]]);
    }

    var pv = portFolioVariance(portfolio);
    uniqueCorrs[key.join(',')] = pv;
  }

  for (var k in uniqueCorrs) {
    corrs.push({
      c: k,
      r: uniqueCorrs[k]
    });
  }

  corrs.sort(lowestScore);

  if (DEBUG) {
    console.log('time: ', Date.now() - start);
  }
  return corrs.slice(0, 11);
}

module.exports = Run;

})(require("__browserify_process"))
},{"./returns.json":3,"./portfolio-variance":4,"__browserify_process":1}],3:[function(require,module,exports){
},{}],4:[function(require,module,exports){
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
},{}]},{},[2])(2)
});
;