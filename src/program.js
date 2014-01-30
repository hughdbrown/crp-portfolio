var returns = require('./returns.json');
var corr3 = require('./corr3');
var lzString = require('lz-string');

var stocks = Object.keys(returns);
var nStocks = stocks.length;

function random (max) {
  return Math.floor(Math.random() * max);
}

function Run(data) {

  var corrs = {};
  var n;

  if (data === 1) {
    n = 40000;
    var stock1;
    var stock2;
    var stock3;
    while (n--) {
      stock1 = random(nStocks);
      stock2 = random(nStocks);
      stock3 = random(nStocks);
      corrs[[stock1, stock2, stock3].join(',')] =
        corr3(returns[stocks[stock1]],
              returns[stocks[stock2]],
              returns[stocks[stock3]]);
    }
  } else {
    var combos = JSON.parse(lzString.decompressFromBase64(data.combos));
    n = combos.length;
    var combo;

    while (n--) {
      combo = combos[n];
      corrs[combo.join(',')] = corr3(returns[stocks[combo[0]]],
                                         returns[stocks[combo[1]]],
                                         returns[stocks[combo[2]]]);
    }
  }


  var compressedCorrs = lzString.compressToBase64(JSON.stringify(corrs));
  return compressedCorrs;
}

module.exports = Run;
