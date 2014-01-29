var lzString = require('lz-string');

process.on('message', function (group) {
  process.send({
    combos: lzString.compressToBase64(JSON.stringify(group))
  });
});