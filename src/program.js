var returns = require('./returns.json');
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
