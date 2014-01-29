//var stocks = require('./stocks.json');
var returns = require('./src/returns.json');
var stocks = Object.keys(returns);

var lzString = require('lz-string');
var Readable = require('stream').Readable;
var Duplex = require('stream').Duplex;

var os = require('os');
var cp = require('child_process');

function CompressionForkRoundRobin () {
  var compressionForks = [];
  for (var i = 0; i < os.cpus().length; i++) {
    compressionForks.push(cp.fork(__dirname + '/compressor.js'));
  }

  var c;
  return function pick () {
    if (!c || !(c--)) {
      c = compressionForks.length - 1;
    }
    return compressionForks[c];
  };
}

function combinations3 (arr) {
  var comboStream = new Readable({objectMode: true});

  var N = arr.length;
  var r1 = 0;
  var r2 = 0;
  var r3 = 0;

  comboStream._read = function _read () {
    var combo = [arr[r1], arr[r2], arr[r3]];
    comboStream.push(combo);
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

function groupMaker (comboSize) {
  var comboStream = combinations3(stocks);
  var groupStream = new Readable({
    objectMode: true
  });

  var compressionForkRR = CompressionForkRoundRobin();

  groupStream._read = function _read () {
    var n = comboSize;
    var group = [];
    while (n--) {
      var combo = comboStream.read();
      if (combo === null) {
        break;
      } else {
        group.push(combo);
      }
    }


    var fork = compressionForkRR();
    fork.send(group);
    fork.once('message', function (m) {
      groupStream.push(m);
    });
  };
  return groupStream;
}



module.exports = groupMaker;