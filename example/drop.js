var multimeter = require('setitch-multimeter');
var multi = multimeter(process);

multi.on('^C', function () {
    multi.charm.cursor(true);
    multi.write('\n').destroy();
    
    process.exit();
});
multi.charm.cursor(false);

multi.drop(function (bar) {
    var iv = setInterval(function () {
        var p = bar.percent();
        bar.percent(p + 1/100);
        if (p >= 1) {
            clearInterval(iv);
            
            multi.charm.cursor(true);
            multi.write('\n').destroy();
        }
    }, 25);
});
