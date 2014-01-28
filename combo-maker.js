//var stocks = require('./stocks.json');
var returns = require('./src/returns.json');
var stocks = Object.keys(returns);


var Readable = require('stream').Readable;
var Duplex = require('stream').Duplex;

function combinations3 (arr) {
  var comboStream = new Readable({objectMode: true});

  var N = arr.length;
  var r1 = 0;
  var r2 = 0;
  var r3 = 0;

  comboStream._read = function _read () {
    comboStream.push([arr[r1], arr[r2], arr[r3]]);
    r3++;
    if (r3 === N) {
      r3 = 0;
      r2++;
    }
    if (r2 === N) {
      r2 = 0;
      r1++;
    }
    if (r1 === N) {
      comboStream.push(null);
    }
  };

  return comboStream;
}

/*


function _combinations3 (arr, _yield) {
  var N = arr.length;
  var comb;
  for (var r1 = 0; r1 < N; r1++) {
    for (var r2 = 0; r2 < N; r2++) {
      for (var r3 = 0; r3 < N; r3++) {
        _yield([arr[r1], arr[r2], arr[r3]]);
      }
    }
  }
}*/

/*
function groupMaker (comboSize) {
  var groupStream = new Duplex({objectMode: true});

  var group = [];
  groupStream._write = function _write (chunk, enc, cb) {
    group.push(chunk);
    if (group.length >= comboSize) {
      groupStream.push([].concat(group));
      group.length = 0;
    }
    cb();
  };

  groupStream._read = function _read () {

  };

}*/

function comboMaker (comboSize, onCombos) {
  var combos = [];
  var comboStream = combinations3(stocks);
  comboStream.on('data', onCombo);
  function onCombo (combo) {
    combos.push(combo);
    if (combos.length === comboSize) {
      onCombos(combos.slice());
      combos.length = 0;
    }
  }
}

module.exports = comboMaker;