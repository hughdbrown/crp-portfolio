var fs = require('fs');
var lzString = require('lz-string');
var CrowdProcess = require('crowdprocess')({
  email: 'hello@crowdprocess.com',
  password: 'blablabla'
});
var Readable = require('readable-stream').Readable;

var program = fs.readFileSync('./build/program.min.js');

var job = CrowdProcess(program);

job.on('created', function (id) {
  console.log('created job with id: ', id);
});

var rank = Lowest(10);
job.on('data', function (d) {
  var decompressed = lzString.decompressFromBase64(d);
  var result = JSON.parse(decompressed);
  rank.put(result);
});

job.on('error', function (err) {
  console.error(err);
});

var tasks = new Readable({objectMode: true});
var nTasks = 100;
tasks._read = function _read () {
  if (nTasks--) {
    tasks.push(1);
  } else {
    tasks.push(null);
  }
};

tasks.pipe(job);








setInterval(function () {
  document.body.innerHTML = JSON.stringify(rank);
}, 5000);

function Lowest (N) {
  var list = [];
  var first;
  return {
    put: function put (els) {
      var elKeys = Object.keys(els);
      var N = elKeys.length;
      while (N--) {
        var el = els[N];
        if (el) {
          if (el[elKeys[0]] < first) {
            list.push(el);
            var n = list.length;
            var newFirst;
            while (n--) {
              var lel = list[n];
              if (lel[Object.keys(lel)[0]] === first) {
                list.splice(n, 1);
              }
              if (!newFirst || lel[Object.keys(lel)[0]] >= newFirst) {
                newFirst = lel[Object.keys(lel)[0]];
              }
            }
            first = newFirst;
          } else {
            if (list.length < N) {
              list.push(el);
              if (!first || el[elKeys[0]] < first) {
                first = el[elKeys[0]];
              }
            }
          }
        }
      }
    },
    get: function get () {
      return list;
    }
  };
}