var fs = require('fs');
var CrowdProcess = require('crowdprocess')({
  email: 'jj@crowdprocess.com',
  password: 'blablabla'
});
var Readable = require('stream').Readable;
if (!Readable) {
  Readable = require('readable-stream').Readable;
}

var extend = require('./lib/extend');

var DEBUG = process.env.DEBUG !== undefined;

var N = 100000;

var opts = {};

if (DEBUG) {
  opts.program = require('./src/program');
  opts.mock = true;
} else {
  opts.program = fs.readFileSync('./build/program.min.js');
}

function onJobCreated (id) {
  console.log('created job with id: ', id);
}

var rank = [];
function onResult (result) {
  left++;
  if (!rank || !rank.length) {
    rank = result;
    return;
  }

  if (result[0].r < rank[rank.length-1].r) {

    var all = result.concat(rank);
    var unique = [];

    var al = all.length;
    var i = al;
    while (i--) {
      var c = all[i];
      var onlyOne = true;
      var j = al;
      while (j--) {
        if (c === all[j].c) {
          onlyOne = false;
        }
      }
      if (onlyOne) {
        unique.push(c);
      }
    }

    unique.sort(function lowestScore (c1, c2) {
      return c1.r - c2.r;
    });
    rank = unique.slice(0, 21);
  }
}

function onError (err) {
  console.error('task error: ', err);
}

function logProgress () {
  var progress = left/N;
  console.log(progress, 'best:', rank[0], 'worst:', rank[rank.length-1]);
}
var logInterval = setInterval(logProgress, 500);

function onEnd () {
  logProgress();
  clearInterval(logInterval);
}

var tasks = new Readable({objectMode: true});
var left = 0;
var n = N;
tasks._read = function _read () {
  if (n--) {
    tasks.push(1);
  } else {
    tasks.push(null);
  }
};

function Run () {
  var job = CrowdProcess(opts);
  job.on('created', onJobCreated);
  job.on('data', onResult);
  job.on('error', onError);
  job.on('end', onEnd);
  tasks.pipe(job);

  console.log('done ?')
}

module.exports = Run;