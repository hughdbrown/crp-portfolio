## How to get stocks.json working ?

Go to the index components pages in Yahoo Finance, like the [Nasdaq-100](http://finance.yahoo.com/q/cp?s=%5ENDX+Components) and put this on the Javascript console:

```javascript
var els = document.querySelectorAll('.yfnc_tabledata1 b a');
var arr = [];
for (i in els) { var h = els[i].innerHTML; if (h) arr.push(h); }
```

What's in it right now ?

* [Nasdaq-100](http://finance.yahoo.com/q/cp?s=%5ENDX+Components)
* [PSI20](http://finance.yahoo.com/q/cp?s=PSI20.LS+Components)
* [CAC40](http://finance.yahoo.com/q/cp?s=%5EFCHI+Components)
* [IBOVESPA](http://finance.yahoo.com/q/cp?s=%5EBVSP+Components)
