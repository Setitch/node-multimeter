var http = require('http');
var multimeter = require('setitch-multimeter');

http.createServer(function (req, res) {
    var multi = multimeter(res);
    var charm = multi.charm;
    
    var xs = [];
    for (var i = 0; i < 100; i++) xs.push(i);
    
    charm.reset()
        .write('Calculating the sum of [0..100]:\n\n')
    ;
    
    var bar = multi(4, 3, { width : 20 });
    bar.percent(0);
    
    var sum = 0;
    charm.write('\n\nResult: ' + sum);
    
    var iv = setInterval(function () {
        var x = xs.shift();
        bar.percent(1 - xs.length/100);
        
        charm
            .left(sum.toString().length)
            .erase('end')
        ;
        sum += x;
        
        charm.write(sum.toString());
        
        if (xs.length === 0) {
            charm.write('\n');
            res.end();
        }
    }, 50);
    
    res.connection.on('end', function () {
        multi.destroy();
        clearInterval(iv);
    });
}).listen(8081);

console.log('curl -N localhost:8081');
