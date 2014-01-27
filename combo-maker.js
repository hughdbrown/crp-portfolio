var stocks = require('./stocks.json');

function combinations3 (arr, _yield) {
  var N = arr.length;
  var comb;
  for (var r1 = 0; r1 < N; r1++) {
    for (var r2 = 0; r2 < N; r2++) {
      for (var r3 = 0; r3 < N; r3++) {
        _yield([arr[r1], arr[r2], arr[r3]]);
      }
    }
  }
}

function comboMaker (comboSize, onCombos) {
  var combos = [];
  combinations3(stocks, onCombo);
  function onCombo (combo) {
    combos.push(combo);
    if (combos.length === comboSize) {
      onCombos(combos);
      combos.length = 0;
    }
  }
}

module.exports = comboMaker;