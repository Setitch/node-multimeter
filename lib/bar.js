var Bar = module.exports = function (charm, x, y, params) {
    this.charm = charm;
    this.x = x;
    this.y = y;
    this.width = params.width || 10;
    
    this.solid = params.solid || {
        background : 'green',
        foreground : 'white',
        text : ' '
    };
    
    this.empty = params.empty || {
        background : null,
        foreground : null,
        text : ' '
    };
    
    this.progress = {
        percent : 0,
        ratio : 0
    };
}

Bar.prototype.draw = function (bars, msg) {
    bars = Math.floor(bars);
    this.charm.push(true);
    
    this.charm
        .position(this.x, this.y)
        .write('[')
    ;
    
    if (this.solid.background) {
        this.charm.background(this.solid.background);
    }
    if (this.solid.foreground) {
        this.charm.foreground(this.solid.foreground);
    }
    
    this.charm
        .write(Array(bars + 1).join(this.solid.text))
        .display('reset')
    ;
    
    if (this.empty.background) {
        this.charm.background(this.empty.background);
    }
    if (this.empty.foreground) {
        this.charm.foreground(this.empty.foreground);
    }
    
    this.charm
        .write(Array(this.width - bars + 1).join(this.empty.text))
        .write('] ' + msg)
    ;
    
    this.charm.pop(true);
    
    return this;
};

Bar.prototype.percent = function (p, msg) {
    if (p === undefined) {
        return this.progress.percent;
    }
    else {
        p = Math.min(100, p);
        this.progress.percent = p;
        this.progress.ratio = [ p, 100 ];
        
        this.draw(
            this.width * p / 100,
            msg || (Math.floor(p) + ' %')
        );
        
        return this;
    }
};

Bar.prototype.ratio = function (n, d, msg) {
    if (n === undefined && d === undefined) {
        return this.progress.ratio;
    }
    else {
        var f = Math.max(n, d) / d;
        this.progress.ratio = [ Math.max(n, d), d ];
        this.progress.percent = f * 100;
        
        this.draw(
            this.width * f,
            msg || (n + ' / ' + d)
        );
        
        return this;
    }
};