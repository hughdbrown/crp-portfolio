var fs = require('fs');
var comboMaker = require('./combo-maker');
var lzString = require('lz-string');
var CrowdProcess = require('crowdprocess')({
  email: 'jj@crowdprocess.com',
  password: 'blablabla1'
});

var program = fs.readFileSync('./build/program.min.js');
//var program = require('./src/program');

var n = 4000;
var job = CrowdProcess({id: '42e04c6b-5ac0-4bb4-9689-f68e55047eaf'});

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
//var times = 2000;
comboMaker(n, onCombos);
function onCombos (combos) {
/*
  if (i > times) {
    return;
  }
*/
  if (firstTime) {
    var start = Date.now();
    var dataunit = {
      combos: lzString.compressToBase64(JSON.stringify(combos))
    };
    console.log('---local       Compressing dataunit: ', Date.now() - start);

    fs.writeFileSync('./samples/input.json.lz', JSON.stringify(dataunit));
    fs.writeFileSync('./samples/input.json', JSON.stringify(combos));
    firstTime = false;
  }

  job.write({
    combos: lzString.compressToBase64(JSON.stringify(combos))
  });
}