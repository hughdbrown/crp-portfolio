var fs = require('fs');
var comboMaker = require('./combo-maker');
var lzString = require('lz-string');
var CrowdProcess = require('crowdprocess')({
  email: 'jj@crowdprocess.com',
  password: 'blablabla1'
});

//var program = fs.readFileSync('./build/program.min.js');
var program = require('./src/program');

var job = CrowdProcess({
  program: program,
  mock: true
});

comboMaker(20000, onCombos);
function onCombos (combos) {
  var d = {
    combos: lzString.compressToBase64(JSON.stringify(combos))
  };
  job.write(d);
}

var results = fs.createWriteStream('./results');
job.pipe(results);

job.on('data', function () {
  console.log('something came back');
});