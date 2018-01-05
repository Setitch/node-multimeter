var multimeter = require('multimeter');
var multi = multimeter(process);

multi.drop(function (bar) {
    var iv = setInterval(function () {
        var p = bar.percent();
        bar.percent(p + 1/100);
        
        if (p >= 1) clearInterval(iv);
    }, 25);
});
