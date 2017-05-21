'use strict';

var chai            = require('chai'),
    expect          = chai.expect,
    dt              = require('./index');

describe('delta-time', function(){
    describe('simple parse', function(){
        it('should return 0 when nothing is passed', function(){
            expect(dt(undefined)).to.equal(0);
            expect(dt(null)).to.equal(0);
            expect(dt(0)).to.equal(0);
            expect(dt("0")).to.equal(0);
        });

        it('should return the same number as given', function(){
            expect(dt("1")).to.equal(1);
            expect(dt(1)).to.equal(1);
            expect(dt(100)).to.equal(100);
            expect(dt("1234")).to.equal(1234);
            expect(dt("-9876")).to.equal(-9876);
        });
    });

    describe('variety parse', function(){
        it('should return millis', function(){
            expect(dt("100ms")).to.equal(100);
            expect(dt("500 millis")).to.equal(500);
            expect(dt("   -10000     milliseconds ")).to.equal(-10000);
        });

        it('should return secs', function(){
            expect(dt("100s")).to.equal(100*1000);
            expect(dt("500 secs")).to.equal(500*1000);
            expect(dt("   -10000     seconds  ")).to.equal(-10000*1000);
        });

        it('should return mins', function(){
            expect(dt("100m")).to.equal(100*1000*60);
            expect(dt("500 mins")).to.equal(500*1000*60);
            expect(dt("   -10000     minutes  ")).to.equal(-10000*1000*60);
        });

        it('should return hrs', function(){
            expect(dt("100h")).to.equal(100*1000*60*60);
            expect(dt("500 hrs")).to.equal(500*1000*60*60);
            expect(dt("   -10000     hours  ")).to.equal(-10000*1000*60*60);
        });

        it('should return days', function(){
            expect(dt("100d")).to.equal(100*1000*60*60*24);
            expect(dt("500 day")).to.equal(500*1000*60*60*24);
            expect(dt("   -10000     days  ")).to.equal(-10000*1000*60*60*24);
        });

        it('should return weeks', function(){
            expect(dt("100w")).to.equal(100*1000*60*60*24*7);
            expect(dt("500 wks")).to.equal(500*1000*60*60*24*7);
            expect(dt("   -10000     week  ")).to.equal(-10000*1000*60*60*24*7);
        });

        it('should return months', function(){
            expect(dt("100mos")).to.equal(100*1000*60*60*24*30.44);
            expect(dt("500 month")).to.equal(500*1000*60*60*24*30.44);
            expect(dt("   -10000     months  ")).to.equal(-10000*1000*60*60*24*30.44);
        });

        it('should return years', function(){
            expect(dt("100y")).to.equal(100*1000*60*60*24*365.25);
            expect(dt("500 yr")).to.equal(500*1000*60*60*24*365.25);
            expect(dt("   -10000     years  ")).to.equal(-10000*1000*60*60*24*365.25);
        });

        it('should return micros', function(){
            expect(dt("100μs")).to.equal(100*(1000*1e-6));
            expect(dt("500 micros")).to.equal(500*(1000*1e-6));
            expect(dt("   -10000     microseconds ")).to.equal(-10000*(1000*1e-6));
        });
    });

    describe('syntax check', function(){
        it('should handle capital letters', function(){
            expect(dt("10 Seconds")).to.equal(10*1000);
            expect(dt("10 mS")).to.equal(10);
            expect(dt("10 sEcOnDs")).to.equal(10*1000);
        });

        it('should handle simple decimal points', function(){
            expect(dt("10.5s")).to.equal(10.5*1000);
            expect(dt("0.5s")).to.equal(0.5*1000);
            expect(dt("-0.5s")).to.equal(-0.5*1000);
        });

        it('should handle dot decimal points', function(){
            expect(dt(".5s")).to.equal(0.5*1000);
            expect(dt("-.5s")).to.equal(-0.5*1000);
            expect(dt("-.01m")).to.equal(-.01*1000*60);
        });

        it('should handle space before operators', function(){
            expect(dt("- 5s")).to.equal(-5*1000);
            expect(dt("3s + 5s")).to.equal((3+5)*1000);
            expect(dt("3s - 5s")).to.equal((3-5)*1000);
        });
    });

    describe('check scales', function(){
        it('should have correct conversion scales', function(){
            expect(dt("1s")).to.equal(dt("1000"));
            expect(dt("1s")).to.equal(dt("1000ms"));
            expect(dt("1m")).to.equal(dt("60s"));
            expect(dt("1h")).to.equal(dt("60m"));
            expect(dt("1d")).to.equal(dt("24h"));
            expect(dt("1w")).to.equal(dt("7d"));
            expect(dt("1ms")).to.equal(dt("1000μs"));
            expect(dt("1μs")).to.equal(dt("1000ns"));
        });
    })

    describe('complex parse', function(){
        it('should handle multiple units', function(){
            expect(dt("10 mins 10 sec")).to.equal(10*60*1000 + 10*1000);
            expect(dt("1h3m2s")).to.equal(1*60*60*1000 + 3*60*1000 + 2*1000);
            expect(dt("5 hours 3 minutes")).to.equal(5*60*60*1000 + 3*60*1000);
        });

        it('should handle same unit multiple times', function(){
            expect(dt("10 mins 10 sec 10 mins")).to.equal(10*60*1000 + 10*1000 + 10*60*1000);
            expect(dt("10 mins 10 minutes")).to.equal(10*60*1000 + 10*60*1000);
            expect(dt("10m10min10mins10minute10minutes")).to.equal(10*60*1000 + 10*60*1000 + 10*60*1000 + 10*60*1000 + 10*60*1000);
        });

        it('should handle random words', function(){
            expect(dt("foo")).to.equal(0);
            expect(dt("hello world")).to.equal(0);
            expect(dt("10 mins 1000")).to.equal(10*60*1000);
            expect(dt("200 dogs")).to.equal(0);
        });

        it('should handle math like inputs', function(){
            expect(dt("2 mins - 60 secs - 60000 ms")).to.equal(0);
        });
    });

    describe('unit conversion', function(){
        it('should handle unit conversion for numbers', function(){
            expect(dt(1000, "ms")).to.equal(1000);
            expect(dt(1000, "s")).to.equal(1);
            expect(dt(1000 * 60, "m")).to.equal(1);
            expect(dt(1000 * 60, "h")).to.equal(1/60);
            expect(dt(1000 * 60 * 60, "h")).to.equal(1);
        });

        it('should handle unit conversion for string', function(){
            expect(dt("1sec", "ms")).to.equal(1000);
            expect(dt("1sec", "s")).to.equal(1);
            expect(dt("1min", "s")).to.equal(60);
            expect(dt("1h", "m")).to.equal(60);
            expect(dt("1d", "h")).to.equal(24);
            expect(dt("1h", "d")).to.equal(1/24);
        });

        it('should throw on invalid unit', function(){
            expect(function(){dt("1sec", "dogs")}).to.throw(Error);
            expect(function(){dt("1sec", 123)}).to.throw(Error);
            expect(function(){dt("1sec", {})}).to.throw(Error);
            expect(function(){dt("1sec", [])}).to.throw(Error);
        });
    });
});
