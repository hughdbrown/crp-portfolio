var fs = require('fs');
var groupMaker = require('./combo-maker');
var lzString = require('lz-string');
var CrowdProcess = require('crowdprocess')({
  email: 'jj@crowdprocess.com',
  password: 'blablabla1'
});

var program = fs.readFileSync('./build/program.min.js');
//var program = require('./src/program');

var n = 40000;
var job = CrowdProcess({
  program: program,
  //mock: true,
  //id: 'd0d46c5d-6651-4acb-adec-6f53508fcadd'
});

//var results = fs.createWriteStream('./results.txt');
//job.pipe(results);

job.on('created', function (id) {
  console.log('created job with id: ', id);
});

var firstResult = true;
job.on('data', function (d) {
  console.log(((i++)*n)/20708500);
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


var firstTime = true;
var i = 0;

var groupStream = groupMaker(n);

groupStream.pipe(job);