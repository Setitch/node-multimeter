    /**
     * @param barNames Array of bar names
     * @param makeEven boolean (false) should bar start evenly (from longest bar label/name
     * @returns API: {writeText, updateProgress, close}
     * @constructor
     */
    function ProgressBar(barNames = [], makeEven = true) {
        let multimeter = require('multimeter');
        let multi = multimeter(process);

        let bars = [];
        let progress = [];


        for (let i = 0; i < barNames.length; i++) {
            let s = barNames[i] + ': \n';
            multi.write(s);

            let offset = makeEven ? barNames.reduce( (a, b) => { return a.length > b.length ? a : b; }, '').length + 3 : barNames[barNames.length-1-i].length+3;

            let bar = multi.rel(offset, i, {
                width : 80,
                solid : {
                    text : '#',
                    foreground : 'white',
                    // background : 'blue'
                },
                empty : { text : '|' },
            });
            bars.push(bar);
            progress.push(0);
        }

        multi.offset = 1;
        let lastString = '';
        let lastUsedString = '';

        function update() {
            if (working === false) { return ; }
            let k = new Array(lastUsedString.length).join(' ');
            multi.write(k);
            multi.write(lastString);
            lastUsedString = lastString;

            bars.forEach((bar, i) => {
                bar.percent(progress[i]);
            });

            timeout = setTimeout(update, 100);
        }

        let timeout = setTimeout(update, 100);

        let working = true;

        return {
            writeText(text) {
                if (working === false) return null;

                lastString = text;

                return this;
            },
            updateProgress(name, percentage) {
                if (working === false) return null;

                let index = barNames.indexOf(name);
                if (index === -1) return -1;

                percentage = Math.round(percentage * 10000)/10000;

                progress[progress.length -1 -index] = percentage;
                if (percentage === 1) setTimeout(update);
                return this;
            },
            close() {
                if (working === false) return null;

                clearTimeout(timeout);
                multi.destroy();
                working = false;
                progress.forEach((p, i) => {
                    delete progress[i];
                    delete barNames[i];
                });
                delete this;
            }
        };
    }
