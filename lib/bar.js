var Bar = module.exports = function (charm, x, y, params) {
    this.charm = charm;
    this.x = x;
    this.y = y;
    this.width = params.width || 10;
    this.offset = params.offset || 0;
    
    this.before = params.before || '[';
    this.after = params.after || '] ';
    
    this.solid = params.solid || {
        background : 'blue',
        foreground : 'white',
        text : '|'
    };
    
    this.empty = params.empty || {
        background : null,
        foreground : null,
        text : ' '
    };

    this.text = params.text || {
        background : null,
        foreground : null,
        text : ''
    }
    
    this.progress = {
        percent : 0,
        ratio : 0
    };
}

Bar.prototype.draw = function (bars, msg) {
    bars = Math.floor(bars);
    this.charm.push(true);
    
    if (this.y.toString().match(/^[+-]/)) {
        if (this.y.toString().match(/^-/)) {
            this.charm.up(-this.y + this.offset);
        }
        else if (this.y.toString().match(/^\+/)) {
            this.charm.down(+this.y - this.offset);
        }
        this.charm.column(+this.x);
    }
    else {
        this.charm.position(this.x, this.y);
    }
    
    this.charm.write(this.before);
    
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
    ;

    if (this.text.background) {
        this.charm.background(this.text.background);
    }
    if (this.text.foreground) {
        this.charm.foreground(this.text.foreground);
    }

    this.charm.write(this.after + msg)
    
    this.charm.pop(true);
    
    return this;
};

Bar.prototype.percent = function (p, msg) {
    if (p === undefined) {
        return this.progress.percent;
    }

    p = Math.max(Math.min(1, p), 0);
    this.progress.percent = p;
    this.progress.ratio = [ p, 100 ];

    let pp = Math.round(p*10000, 2)/100;
    if (p >= 1) pp = ' 100.00';
    if (p < 1) pp = '  ' + pp;

    this.draw(
        this.width * p,
        msg || (pp + ' %   ')
    );
    
    return this;
};

Bar.prototype.ratio = function (n, d, msg) {
    if (n === undefined && d === undefined) {
        return this.progress.ratio;
    }
    
    var f = n / d;
    this.progress.ratio = [n, d];
    this.progress.percent = f * 100;

    this.draw(
        this.width * f,
        msg || (n + ' / ' + d)
    );

    return this;
};
