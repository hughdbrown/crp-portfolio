var fs = require('fs');
var lzString = require('lz-string');
var CrowdProcess = require('crowdprocess')({
  email: 'jj@crowdprocess.com',
  password: 'blablabla'
});
var Readable = require('stream').Readable;

var program = fs.readFileSync('./build/program.min.js');
//var program = require('./src/program');

var n = 40000;
var job = CrowdProcess({
  //program: program,
  //mock: true,
  id: 'd457be96-11c9-4eef-bb76-3c7a150b6472'
});

//var results = fs.createWriteStream('./results.txt');
//job.pipe(results);

job.on('created', function (id) {
  console.log('created job with id: ', id);
});

var firstResult = true;
job.on('data', function (d) {
  if (firstResult) {
    fs.writeFileSync('./samples/result.json.lz', d);
    var start = Date.now();
    var decompressed = lzString.decompressFromBase64(d);
    console.log('---local       decompressing result: ', Date.now() - start);
    fs.writeFileSync('./samples/result.json', decompressed);
    firstResult = false;
  }
});

job.on('error', function (err) {
  console.error(err);
});



var tasks = new Readable({objectMode: true});
var N = 7000;
var n = N;
tasks._read = function _read () {
  if (n--) {
    tasks.push(1);
  } else {
    tasks.push(null);
  }
};

var logInterval = setInterval(function () {
  var progress = n/N;
  console.log(progress);
  if (progress === 1) {
    clearInterval(logInterval);
  }
}, 500);


tasks.pipe(job);