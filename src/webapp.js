var fs = require('fs');
var lzString = require('lz-string');
var CrowdProcess = require('crowdprocess')({
  email: 'hello@crowdprocess.com',
  password: 'blablabla'
});
var Readable = require('stream').Readable;
if (!Readable) {
  Readable = require('readable-stream').Readable;
}

var program = fs.readFileSync('./build/program.min.js');
//var program = require('./src/program');

var n = 40000;
var job = CrowdProcess({
  program: program,
  //mock: true,
  //id: '847615a2-f100-4d63-b11d-e92b7ada48db'
});

//var results = fs.createWriteStream('./results.txt');
//job.pipe(results);

job.on('created', function (id) {
  console.log('created job with id: ', id);
});

var rank = [];
job.on('data', function (result) {
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
});

job.on('error', function (err) {
  console.error(err);
});



var tasks = new Readable({objectMode: true});
var N = 1000;
var left = 0;
var n = N;
tasks._read = function _read () {
  if (n--) {
    tasks.push(1);
  } else {
    tasks.push(null);
  }
};

var logInterval = setInterval(function () {
  var progress = left/N;
  console.log(progress, 'best:', rank[0], 'worst:', rank[rank.length-1]);
}, 500);

job.on('end', function () {
  clearInterval(logInterval);
});

tasks.pipe(job);