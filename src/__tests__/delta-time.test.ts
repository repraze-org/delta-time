import {calc} from "../";

describe("delta-time", function () {
    describe("simple parse", function () {
        test("should return 0 when nothing is passed", function () {
            expect(calc(undefined)).toEqual(0);
            expect(calc(null)).toEqual(0);
            expect(calc(0)).toEqual(0);
            expect(calc("0")).toEqual(0);
            expect(calc({})).toEqual(0);
        });

        test("should return the same number as given", function () {
            expect(calc("1")).toEqual(1);
            expect(calc(1)).toEqual(1);
            expect(calc(100)).toEqual(100);
            expect(calc("1234")).toEqual(1234);
            expect(calc("-9876")).toEqual(-9876);
        });
    });

    describe("variety parse", function () {
        test("should return millis", function () {
            expect(calc("100ms")).toEqual(100);
            expect(calc("500 millis")).toEqual(500);
            expect(calc("   -10000     milliseconds ")).toEqual(-10000);
            expect(calc({milliseconds: 1})).toEqual(1);
        });

        test("should return secs", function () {
            expect(calc("100s")).toEqual(100 * 1000);
            expect(calc("500 secs")).toEqual(500 * 1000);
            expect(calc("   -10000     seconds  ")).toEqual(-10000 * 1000);
            expect(calc({seconds: 1})).toEqual(1000);
        });

        test("should return mins", function () {
            expect(calc("100m")).toEqual(100 * 1000 * 60);
            expect(calc("500 mins")).toEqual(500 * 1000 * 60);
            expect(calc("   -10000     minutes  ")).toEqual(-10000 * 1000 * 60);
            expect(calc({minutes: 1})).toEqual(1000 * 60);
        });

        test("should return hrs", function () {
            expect(calc("100h")).toEqual(100 * 1000 * 60 * 60);
            expect(calc("500 hrs")).toEqual(500 * 1000 * 60 * 60);
            expect(calc("   -10000     hours  ")).toEqual(-10000 * 1000 * 60 * 60);
            expect(calc({hours: 1})).toEqual(1000 * 60 * 60);
        });

        test("should return days", function () {
            expect(calc("100d")).toEqual(100 * 1000 * 60 * 60 * 24);
            expect(calc("500 day")).toEqual(500 * 1000 * 60 * 60 * 24);
            expect(calc("   -10000     days  ")).toEqual(-10000 * 1000 * 60 * 60 * 24);
            expect(calc({days: 1})).toEqual(1000 * 60 * 60 * 24);
        });

        test("should return weeks", function () {
            expect(calc("100w")).toEqual(100 * 1000 * 60 * 60 * 24 * 7);
            expect(calc("500 wks")).toEqual(500 * 1000 * 60 * 60 * 24 * 7);
            expect(calc("   -10000     week  ")).toEqual(-10000 * 1000 * 60 * 60 * 24 * 7);
            expect(calc({weeks: 1})).toEqual(1000 * 60 * 60 * 24 * 7);
        });

        test("should return months", function () {
            expect(calc("100mos")).toEqual(100 * 1000 * 60 * 60 * 24 * 30.44);
            expect(calc("500 month")).toEqual(500 * 1000 * 60 * 60 * 24 * 30.44);
            expect(calc("   -10000     months  ")).toEqual(-10000 * 1000 * 60 * 60 * 24 * 30.44);
            expect(calc({months: 1})).toEqual(1000 * 60 * 60 * 24 * 30.44);
        });

        test("should return years", function () {
            expect(calc("100y")).toEqual(100 * 1000 * 60 * 60 * 24 * 365.25);
            expect(calc("500 yr")).toEqual(500 * 1000 * 60 * 60 * 24 * 365.25);
            expect(calc("   -10000     years  ")).toEqual(-10000 * 1000 * 60 * 60 * 24 * 365.25);
            expect(calc({years: 1})).toEqual(1000 * 60 * 60 * 24 * 365.25);
        });

        test("should return micros", function () {
            expect(calc("100μs")).toEqual(100 * (1000 * 1e-6));
            expect(calc("500 micros")).toEqual(500 * (1000 * 1e-6));
            expect(calc("   -10000     microseconds ")).toEqual(-10000 * (1000 * 1e-6));
            expect(calc({microseconds: 1})).toEqual(1000 * 1e-6);
        });
    });

    describe("syntax check", function () {
        test("should handle capital letters", function () {
            expect(calc("10 Seconds")).toEqual(10 * 1000);
            expect(calc("10 mS")).toEqual(10);
            expect(calc("10 sEcOnDs")).toEqual(10 * 1000);
        });

        test("should handle simple decimal points", function () {
            expect(calc("10.5s")).toEqual(10.5 * 1000);
            expect(calc("0.5s")).toEqual(0.5 * 1000);
            expect(calc("-0.5s")).toEqual(-0.5 * 1000);
        });

        test("should handle dot decimal points", function () {
            expect(calc(".5s")).toEqual(0.5 * 1000);
            expect(calc("-.5s")).toEqual(-0.5 * 1000);
            expect(calc("-.01m")).toEqual(-0.01 * 1000 * 60);
        });

        test("should handle space before operators", function () {
            expect(calc("- 5s")).toEqual(-5 * 1000);
            expect(calc("3s + 5s")).toEqual((3 + 5) * 1000);
            expect(calc("3s - 5s")).toEqual((3 - 5) * 1000);
        });
    });

    describe("check scales", function () {
        test("should have correct conversion scales", function () {
            expect(calc("1s")).toEqual(calc("1000"));
            expect(calc("1s")).toEqual(calc("1000ms"));
            expect(calc("1m")).toEqual(calc("60s"));
            expect(calc("1h")).toEqual(calc("60m"));
            expect(calc("1d")).toEqual(calc("24h"));
            expect(calc("1w")).toEqual(calc("7d"));
            expect(calc("1ms")).toEqual(calc("1000μs"));
            expect(calc("1μs")).toEqual(calc("1000ns"));
        });
    });

    describe("complex parse", function () {
        test("should handle multiple units", function () {
            expect(calc("10 mins 10 sec")).toEqual(10 * 60 * 1000 + 10 * 1000);
            expect(calc("1h3m2s")).toEqual(1 * 60 * 60 * 1000 + 3 * 60 * 1000 + 2 * 1000);
            expect(calc("5 hours 3 minutes")).toEqual(5 * 60 * 60 * 1000 + 3 * 60 * 1000);
            expect(
                calc({
                    hours: 5,
                    minutes: 3,
                }),
            ).toEqual(5 * 60 * 60 * 1000 + 3 * 60 * 1000);
        });

        test("should handle same unit multiple times", function () {
            expect(calc("10 mins 10 sec 10 mins")).toEqual(10 * 60 * 1000 + 10 * 1000 + 10 * 60 * 1000);
            expect(calc("10 mins 10 minutes")).toEqual(10 * 60 * 1000 + 10 * 60 * 1000);
            expect(calc("10m10min10mins10minute10minutes")).toEqual(
                10 * 60 * 1000 + 10 * 60 * 1000 + 10 * 60 * 1000 + 10 * 60 * 1000 + 10 * 60 * 1000,
            );
        });

        test("should handle random words", function () {
            expect(calc("foo")).toEqual(0);
            expect(calc("hello world")).toEqual(0);
            expect(calc("10 mins 1000")).toEqual(10 * 60 * 1000);
            expect(calc("200 dogs")).toEqual(0);
        });

        test("should handle math like inputs", function () {
            expect(calc("2 mins - 60 secs - 60000 ms")).toEqual(0);
        });
    });

    describe("unit conversion", function () {
        test("should handle unit conversion for numbers", function () {
            expect(calc(1000, "ms")).toEqual(1000);
            expect(calc(1000, "s")).toEqual(1);
            expect(calc(1000 * 60, "m")).toEqual(1);
            expect(calc(1000 * 60, "h")).toEqual(1 / 60);
            expect(calc(1000 * 60 * 60, "h")).toEqual(1);
        });

        test("should handle unit conversion for string", function () {
            expect(calc("1sec", "ms")).toEqual(1000);
            expect(calc("1sec", "s")).toEqual(1);
            expect(calc("1min", "s")).toEqual(60);
            expect(calc("1h", "m")).toEqual(60);
            expect(calc("1d", "h")).toEqual(24);
            expect(calc("1h", "d")).toEqual(1 / 24);
        });

        test("should throw on invalid unit", function () {
            expect(function () {
                calc("1sec", "dogs");
            }).toThrow(Error);
            expect(function () {
                calc("1sec", 123);
            }).toThrow(Error);
            expect(function () {
                calc("1sec", {});
            }).toThrow(Error);
            expect(function () {
                calc("1sec", []);
            }).toThrow(Error);
        });
    });
});
