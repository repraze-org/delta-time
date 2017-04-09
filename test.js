'use strict';

var chai            = require('chai'),
    expect          = chai.expect,
    timeInterval    = require('./index');

describe('time-interval-parser', function(){
    describe('simple parse', function(){
        it('should return 0 when nothing is passed', function(){
            expect(timeInterval(undefined)).to.equal(0);
            expect(timeInterval(null)).to.equal(0);
            expect(timeInterval(0)).to.equal(0);
            expect(timeInterval("0")).to.equal(0);
        });

        it('should return the same number as given', function(){
            expect(timeInterval("1")).to.equal(1);
            expect(timeInterval(1)).to.equal(1);
            expect(timeInterval(100)).to.equal(100);
            expect(timeInterval("1234")).to.equal(1234);
            expect(timeInterval("-9876")).to.equal(-9876);
        });
    });

    describe('variety parse', function(){
        it('should return millis', function(){
            expect(timeInterval("100ms")).to.equal(100);
            expect(timeInterval("500 millis")).to.equal(500);
            expect(timeInterval("   -10000     milliseconds ")).to.equal(-10000);
        });

        it('should return secs', function(){
            expect(timeInterval("100s")).to.equal(100*1000);
            expect(timeInterval("500 secs")).to.equal(500*1000);
            expect(timeInterval("   -10000     seconds  ")).to.equal(-10000*1000);
        });

        it('should return mins', function(){
            expect(timeInterval("100m")).to.equal(100*1000*60);
            expect(timeInterval("500 mins")).to.equal(500*1000*60);
            expect(timeInterval("   -10000     minutes  ")).to.equal(-10000*1000*60);
        });

        it('should return hrs', function(){
            expect(timeInterval("100h")).to.equal(100*1000*60*60);
            expect(timeInterval("500 hrs")).to.equal(500*1000*60*60);
            expect(timeInterval("   -10000     hours  ")).to.equal(-10000*1000*60*60);
        });

        it('should return days', function(){
            expect(timeInterval("100d")).to.equal(100*1000*60*60*24);
            expect(timeInterval("500 day")).to.equal(500*1000*60*60*24);
            expect(timeInterval("   -10000     days  ")).to.equal(-10000*1000*60*60*24);
        });

        it('should return weeks', function(){
            expect(timeInterval("100w")).to.equal(100*1000*60*60*24*7);
            expect(timeInterval("500 wks")).to.equal(500*1000*60*60*24*7);
            expect(timeInterval("   -10000     week  ")).to.equal(-10000*1000*60*60*24*7);
        });

        it('should return months', function(){
            expect(timeInterval("100mos")).to.equal(100*1000*60*60*24*30.44);
            expect(timeInterval("500 month")).to.equal(500*1000*60*60*24*30.44);
            expect(timeInterval("   -10000     months  ")).to.equal(-10000*1000*60*60*24*30.44);
        });

        it('should return years', function(){
            expect(timeInterval("100y")).to.equal(100*1000*60*60*24*365.25);
            expect(timeInterval("500 yr")).to.equal(500*1000*60*60*24*365.25);
            expect(timeInterval("   -10000     years  ")).to.equal(-10000*1000*60*60*24*365.25);
        });
    });

    describe('complex parse', function(){
        it('should handle multiple units', function(){
            expect(timeInterval("10 mins 10 sec")).to.equal(10*60*1000 + 10*1000);
            expect(timeInterval("1h3m2s")).to.equal(1*60*60*1000 + 3*60*1000 + 2*1000);
            expect(timeInterval("5 hours 3 minutes")).to.equal(5*60*60*1000 + 3*60*1000);
        });

        it('should handle same unit multiple times', function(){
            expect(timeInterval("10 mins 10 sec 10 mins")).to.equal(10*60*1000 + 10*1000 + 10*60*1000);
            expect(timeInterval("10 mins 10 minutes")).to.equal(10*60*1000 + 10*60*1000);
            expect(timeInterval("10m10min10mins10minute10minutes")).to.equal(10*60*1000 + 10*60*1000 + 10*60*1000 + 10*60*1000 + 10*60*1000);
        });

        it('should handle random words', function(){
            expect(timeInterval("10 mins 1000")).to.equal(10*60*1000);
            expect(timeInterval("200 dogs")).to.equal(0);
        });
    });
});
