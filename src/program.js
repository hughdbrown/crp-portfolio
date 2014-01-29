var returns = require('./returns.json');
var corr3 = require('./corr3');
var lzString = require('lz-string');

function Run(combos) {
  //var start = Date.now();
  //var combos = JSON.parse(lzString.decompressFromBase64(data.combos));
  //var one = Date.now() - start;
  //console.log('---worker      decompress and parse: ', one);
  //start = Date.now();
  var n = combos.length;
  var corrs = {};
  var combo;

  while (n--) {
    combo = combos[n];
    corrs[combo.join(',')] = corr3(returns[combo[0]],
                                       returns[combo[1]],
                                       returns[combo[2]]);
  }
  //var two = Date.now() - start;
  //console.log('---worker      compute: ', two);
  //start = Date.now();
  var compressedCorrs = lzString.compressToBase64(JSON.stringify(corrs));
  //var three = Date.now() - start;
  //console.log('---worker      stringify and compress: ', three);
  return compressedCorrs;
}

module.exports = Run;
