var returns = require('./returns.json');
var corr3 = require('./corr3');
var lzString = require('lz-string');

function Run(data) {
  console.log('got data');
  var combos = JSON.parse(lzString.decompressFromBase64(data.combos));
  var n = combos.length;
  var corrs = {};
  var combo;
  while (n--) {
    combo = combos[n];
    corrs[combo.join(',')] = corr3(returns[combo[0]],
                                       returns[combo[1]],
                                       returns[combo[2]]);
  }

  compressedCorrs = lzString.compressToBase64(JSON.stringify(corrs));
  return compressedCorrs;
}

module.exports = Run;
