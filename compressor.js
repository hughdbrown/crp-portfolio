var lzString = require('lz-string');

var firstTime = true;
process.on('message', function (group) {
  if (firstTime) {
    console.log('task size: ', JSON.stringify(group).length);
    console.log('compressed task size: ', lzString.compressToBase64(JSON.stringify(group)).length);
    firstTime = false;
  }

  //process.send(group);

  process.send({
    combos: lzString.compressToBase64(JSON.stringify(group))
  });
});