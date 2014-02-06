#!/usr/bin/env node
var finance = require('finance');
var async = require('async');
var moment = require('moment');
var fs = require('fs');
var debug = !!process.env.DEBUG;

var expectedReturnsLength;
var returns = {};

module.exports = loadData;
function loadData(stockList, refDate, callback) {
  if (!(stockList instanceof Array) || stockList.length === 0) {
    throw new Error('sockList must be an Array with more than 0 elements');
  }

  if (!(refDate instanceof Date)) {
    if (typeof refDate === 'string') {
      refDate = new Date(refDate);
    } else if (typeof refDate === 'number') {
      refDate = moment().subtract('days', refDate);
    }
  }

  function saveReturn (name, callback) {
    finance.returns.getReturns([name], refDate, onReturns);

    function onReturns (err, stockReturns) {
      if (err) {
        throw new Error(err);
      }

      var allReturns = stockReturns.beforeRefDate[0]
                         .concat(stockReturns.afterRefDate[0]);

      if (!expectedReturnsLength) {
        expectedReturnsLength = allReturns.length;
      }

      if (isValid(allReturns)) {
        if (debug) {
          console.log('got returns for', name);
        }
        returns[name] = allReturns;
        callback();
      } else {
        if (debug) {
          console.error('    '+name+
                      ' had invalid format, rl='+
                      returns.length+
                      ', el='+expectedReturnsLength);
        }
        callback();
      }
    }
  }

  var q = async.queue(saveReturn, 10);

  q.drain = callback;

  stockList.forEach(function (name) {
    q.push(name);
  });
}

function isValid (returns) {
  var n = returns.length;

  if (n !== expectedReturnsLength) {
    return false;
  }

  while (n--) {
    if (isNaN(returns[n])) {
      return false;
    }
  }

   return true;
}

var stocks = require('./stocks');
loadData(stocks, 180, onDataLoaded);

function onDataLoaded () {
  fs.writeFileSync('./src/returns.json', JSON.stringify(returns));
  fs.writeFileSync('./src/stocks.json', JSON.stringify(Object.keys(returns)));
}