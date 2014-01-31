var returns = require('./returns.json');
var corr3 = require('./corr3');
var lzString = require('lz-string');

var stocks = Object.keys(returns);
var nStocks = stocks.length;

function Run(data) {

  var corrs = [];
  var n;

  var combos = JSON.parse(lzString.decompressFromBase64(data.combos));
  n = combos.length;
  var combo;

  while (n--) {
    combo = combos[n];
    corrs.push({
      c: combo,
      r: corr3(returns[stocks[combo[0]]],
           returns[stocks[combo[1]]],
           returns[stocks[combo[2]]])
    });
  }

  corrs.sort(lowestScore);
  function lowestScore (c1, c2) {
    return c1.r - c2.r;
  }

  return corrs.slice(0, 21);

  //var compressedCorrs = lzString.compressToBase64(JSON.stringify(corrs));
  //return compressedCorrs;
}

module.exports = Run;
