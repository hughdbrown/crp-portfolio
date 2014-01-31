var returns = require('./returns.json');
var corr3 = require('./corr3');
var lzString = require('lz-string');

var stocks = Object.keys(returns);
var nStocks = stocks.length;

function random (max) {
  return Math.floor(Math.random() * max);
}

function Run(data) {

  var uniqueCorrs = {};
  var corrs = [];
  var n;

  n = 80000;
  var stock1;
  var stock2;
  var stock3;
  while (n--) {
    stock1 = random(nStocks);
    stock2 = random(nStocks);
    stock3 = random(nStocks);
    var key = [stock1, stock2, stock3].join(',');
    uniqueCorrs[key] = corr3(returns[stocks[stock1]],
                         returns[stocks[stock2]],
                         returns[stocks[stock3]]);
  }

  for (var k in uniqueCorrs) {
    corrs.push({
      c: k,
      r: uniqueCorrs[k]
    });
  }

  corrs.sort(lowestScore);
  function lowestScore (c1, c2) {
    return c1.r - c2.r;
  }

  return corrs.slice(0, 21);
}

module.exports = Run;
