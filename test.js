'use strict';

var chai            = require('chai'),
    expect          = chai.expect,
    deltaTime    = require('./index');

describe('delta-time', function(){
    describe('simple parse', function(){
        it('should return 0 when nothing is passed', function(){
            expect(deltaTime(undefined)).to.equal(0);
            expect(deltaTime(null)).to.equal(0);
            expect(deltaTime(0)).to.equal(0);
            expect(deltaTime("0")).to.equal(0);
        });

        it('should return the same number as given', function(){
            expect(deltaTime("1")).to.equal(1);
            expect(deltaTime(1)).to.equal(1);
            expect(deltaTime(100)).to.equal(100);
            expect(deltaTime("1234")).to.equal(1234);
            expect(deltaTime("-9876")).to.equal(-9876);
        });
    });

    describe('variety parse', function(){
        it('should return millis', function(){
            expect(deltaTime("100ms")).to.equal(100);
            expect(deltaTime("500 millis")).to.equal(500);
            expect(deltaTime("   -10000     milliseconds ")).to.equal(-10000);
        });

        it('should return secs', function(){
            expect(deltaTime("100s")).to.equal(100*1000);
            expect(deltaTime("500 secs")).to.equal(500*1000);
            expect(deltaTime("   -10000     seconds  ")).to.equal(-10000*1000);
        });

        it('should return mins', function(){
            expect(deltaTime("100m")).to.equal(100*1000*60);
            expect(deltaTime("500 mins")).to.equal(500*1000*60);
            expect(deltaTime("   -10000     minutes  ")).to.equal(-10000*1000*60);
        });

        it('should return hrs', function(){
            expect(deltaTime("100h")).to.equal(100*1000*60*60);
            expect(deltaTime("500 hrs")).to.equal(500*1000*60*60);
            expect(deltaTime("   -10000     hours  ")).to.equal(-10000*1000*60*60);
        });

        it('should return days', function(){
            expect(deltaTime("100d")).to.equal(100*1000*60*60*24);
            expect(deltaTime("500 day")).to.equal(500*1000*60*60*24);
            expect(deltaTime("   -10000     days  ")).to.equal(-10000*1000*60*60*24);
        });

        it('should return weeks', function(){
            expect(deltaTime("100w")).to.equal(100*1000*60*60*24*7);
            expect(deltaTime("500 wks")).to.equal(500*1000*60*60*24*7);
            expect(deltaTime("   -10000     week  ")).to.equal(-10000*1000*60*60*24*7);
        });

        it('should return months', function(){
            expect(deltaTime("100mos")).to.equal(100*1000*60*60*24*30.44);
            expect(deltaTime("500 month")).to.equal(500*1000*60*60*24*30.44);
            expect(deltaTime("   -10000     months  ")).to.equal(-10000*1000*60*60*24*30.44);
        });

        it('should return years', function(){
            expect(deltaTime("100y")).to.equal(100*1000*60*60*24*365.25);
            expect(deltaTime("500 yr")).to.equal(500*1000*60*60*24*365.25);
            expect(deltaTime("   -10000     years  ")).to.equal(-10000*1000*60*60*24*365.25);
        });

        it('should return micros', function(){
            expect(deltaTime("100μs")).to.equal(100*(1000*1e-6));
            expect(deltaTime("500 micros")).to.equal(500*(1000*1e-6));
            expect(deltaTime("   -10000     microseconds ")).to.equal(-10000*(1000*1e-6));
        });
    });

    describe('syntax check', function(){
        it('should handle simple decimal points', function(){
            expect(deltaTime("10.5s")).to.equal(10.5*1000);
            expect(deltaTime("0.5s")).to.equal(0.5*1000);
            expect(deltaTime("-0.5s")).to.equal(-0.5*1000);
        });

        it('should handle dot decimal points', function(){
            expect(deltaTime(".5s")).to.equal(0.5*1000);
            expect(deltaTime("-.5s")).to.equal(-0.5*1000);
            expect(deltaTime("-.01m")).to.equal(-.01*1000*60);
        });

        it('should handle space before operators', function(){
            expect(deltaTime("- 5s")).to.equal(-5*1000);
            expect(deltaTime("3s + 5s")).to.equal((3+5)*1000);
            expect(deltaTime("3s - 5s")).to.equal((3-5)*1000);
        });
    });

    describe('check scales', function(){
        it('should have correct conversion scales', function(){
            expect(deltaTime("1s")).to.equal(deltaTime("1000"));
            expect(deltaTime("1s")).to.equal(deltaTime("1000ms"));
            expect(deltaTime("1m")).to.equal(deltaTime("60s"));
            expect(deltaTime("1h")).to.equal(deltaTime("60m"));
            expect(deltaTime("1d")).to.equal(deltaTime("24h"));
            expect(deltaTime("1w")).to.equal(deltaTime("7d"));
            expect(deltaTime("1ms")).to.equal(deltaTime("1000μs"));
            expect(deltaTime("1μs")).to.equal(deltaTime("1000ns"));
        });
    })

    describe('complex parse', function(){
        it('should handle multiple units', function(){
            expect(deltaTime("10 mins 10 sec")).to.equal(10*60*1000 + 10*1000);
            expect(deltaTime("1h3m2s")).to.equal(1*60*60*1000 + 3*60*1000 + 2*1000);
            expect(deltaTime("5 hours 3 minutes")).to.equal(5*60*60*1000 + 3*60*1000);
        });

        it('should handle same unit multiple times', function(){
            expect(deltaTime("10 mins 10 sec 10 mins")).to.equal(10*60*1000 + 10*1000 + 10*60*1000);
            expect(deltaTime("10 mins 10 minutes")).to.equal(10*60*1000 + 10*60*1000);
            expect(deltaTime("10m10min10mins10minute10minutes")).to.equal(10*60*1000 + 10*60*1000 + 10*60*1000 + 10*60*1000 + 10*60*1000);
        });

        it('should handle random words', function(){
            expect(deltaTime("foo")).to.equal(0);
            expect(deltaTime("hello world")).to.equal(0);
            expect(deltaTime("10 mins 1000")).to.equal(10*60*1000);
            expect(deltaTime("200 dogs")).to.equal(0);
        });

        it('should handle math like inputs', function(){
            expect(deltaTime("2 mins - 60 secs - 60000 ms")).to.equal(0);
        });
    });
});
