import {default as dt, calculate, delay} from "../";
import {TimeUnit} from "../delta-time";

describe("delta-time", () => {
    test("should return calculate as default", () => {
        expect(dt).toEqual(calculate);
    });

    describe("simple parse", () => {
        test("should return 0 when nothing is passed", () => {
            expect(calculate(undefined)).toEqual(0);
            expect(calculate(null)).toEqual(0);
            expect(calculate(0)).toEqual(0);
            expect(calculate("0")).toEqual(0);
            expect(calculate({})).toEqual(0);
        });

        test("should return the same number as given", () => {
            expect(calculate("1")).toEqual(1);
            expect(calculate(1)).toEqual(1);
            expect(calculate(100)).toEqual(100);
            expect(calculate("1234")).toEqual(1234);
            expect(calculate("-9876")).toEqual(-9876);
        });
    });

    describe("variety parse", () => {
        test("should return nanos", () => {
            const nanoFactor = 1000 * 1e-9; // factor converted to ms
            const digits = 15;
            expect(calculate("100ns")).toBeCloseTo(100 * nanoFactor, digits);
            expect(calculate("500 nanos")).toBeCloseTo(500 * nanoFactor, digits);
            expect(calculate("   -10000     nanoseconds ")).toBeCloseTo(-10000 * nanoFactor, digits);
            expect(calculate({nanoseconds: 1})).toBeCloseTo(nanoFactor, digits);
        });

        test("should return micros", () => {
            const microFactor = 1000 * 1e-6; // factor converted to ms
            expect(calculate("100μs")).toEqual(100 * microFactor);
            expect(calculate("500 micros")).toEqual(500 * (1000 * 1e-6));
            expect(calculate("   -10000     microseconds ")).toEqual(-10000 * microFactor);
            expect(calculate({microseconds: 1})).toEqual(microFactor);
        });

        test("should return millis", () => {
            expect(calculate("100ms")).toEqual(100);
            expect(calculate("500 millis")).toEqual(500);
            expect(calculate("   -10000     milliseconds ")).toEqual(-10000);
            expect(calculate({milliseconds: 1})).toEqual(1);
        });

        test("should return secs", () => {
            expect(calculate("100s")).toEqual(100 * 1000);
            expect(calculate("500 secs")).toEqual(500 * 1000);
            expect(calculate("   -10000     seconds  ")).toEqual(-10000 * 1000);
            expect(calculate({seconds: 1})).toEqual(1000);
        });

        test("should return mins", () => {
            expect(calculate("100m")).toEqual(100 * 1000 * 60);
            expect(calculate("500 mins")).toEqual(500 * 1000 * 60);
            expect(calculate("   -10000     minutes  ")).toEqual(-10000 * 1000 * 60);
            expect(calculate({minutes: 1})).toEqual(1000 * 60);
        });

        test("should return hrs", () => {
            expect(calculate("100h")).toEqual(100 * 1000 * 60 * 60);
            expect(calculate("500 hrs")).toEqual(500 * 1000 * 60 * 60);
            expect(calculate("   -10000     hours  ")).toEqual(-10000 * 1000 * 60 * 60);
            expect(calculate({hours: 1})).toEqual(1000 * 60 * 60);
        });

        test("should return days", () => {
            expect(calculate("100d")).toEqual(100 * 1000 * 60 * 60 * 24);
            expect(calculate("500 day")).toEqual(500 * 1000 * 60 * 60 * 24);
            expect(calculate("   -10000     days  ")).toEqual(-10000 * 1000 * 60 * 60 * 24);
            expect(calculate({days: 1})).toEqual(1000 * 60 * 60 * 24);
        });

        test("should return weeks", () => {
            expect(calculate("100w")).toEqual(100 * 1000 * 60 * 60 * 24 * 7);
            expect(calculate("500 wks")).toEqual(500 * 1000 * 60 * 60 * 24 * 7);
            expect(calculate("   -10000     week  ")).toEqual(-10000 * 1000 * 60 * 60 * 24 * 7);
            expect(calculate({weeks: 1})).toEqual(1000 * 60 * 60 * 24 * 7);
        });

        test("should return months", () => {
            expect(calculate("100mos")).toEqual(100 * 1000 * 60 * 60 * 24 * 30.44);
            expect(calculate("500 month")).toEqual(500 * 1000 * 60 * 60 * 24 * 30.44);
            expect(calculate("   -10000     months  ")).toEqual(-10000 * 1000 * 60 * 60 * 24 * 30.44);
            expect(calculate({months: 1})).toEqual(1000 * 60 * 60 * 24 * 30.44);
        });

        test("should return years", () => {
            expect(calculate("100y")).toEqual(100 * 1000 * 60 * 60 * 24 * 365.25);
            expect(calculate("500 yr")).toEqual(500 * 1000 * 60 * 60 * 24 * 365.25);
            expect(calculate("   -10000     years  ")).toEqual(-10000 * 1000 * 60 * 60 * 24 * 365.25);
            expect(calculate({years: 1})).toEqual(1000 * 60 * 60 * 24 * 365.25);
        });
    });

    describe("syntax check", () => {
        test("should handle capital letters", () => {
            expect(calculate("10 Seconds")).toEqual(10 * 1000);
            expect(calculate("10 mS")).toEqual(10);
            expect(calculate("10 sEcOnDs")).toEqual(10 * 1000);
        });

        test("should handle simple decimal points", () => {
            expect(calculate("10.5s")).toEqual(10.5 * 1000);
            expect(calculate("0.5s")).toEqual(0.5 * 1000);
            expect(calculate("-0.5s")).toEqual(-0.5 * 1000);
        });

        test("should handle dot decimal points", () => {
            expect(calculate(".5s")).toEqual(0.5 * 1000);
            expect(calculate("-.5s")).toEqual(-0.5 * 1000);
            expect(calculate("-.01m")).toEqual(-0.01 * 1000 * 60);
        });

        test("should handle space before operators", () => {
            expect(calculate("- 5s")).toEqual(-5 * 1000);
            expect(calculate("3s + 5s")).toEqual((3 + 5) * 1000);
            expect(calculate("3s - 5s")).toEqual((3 - 5) * 1000);
        });
    });

    describe("check scales", () => {
        test("should have correct conversion scales", () => {
            expect(calculate("1s")).toEqual(calculate("1000"));
            expect(calculate("1s")).toEqual(calculate("1000ms"));
            expect(calculate("1m")).toEqual(calculate("60s"));
            expect(calculate("1h")).toEqual(calculate("60m"));
            expect(calculate("1d")).toEqual(calculate("24h"));
            expect(calculate("1w")).toEqual(calculate("7d"));
            expect(calculate("1ms")).toEqual(calculate("1000μs"));
            expect(calculate("1μs")).toEqual(calculate("1000ns"));
        });
    });

    describe("complex parse", () => {
        test("should handle multiple units", () => {
            expect(calculate("10 mins 10 sec")).toEqual(10 * 60 * 1000 + 10 * 1000);
            expect(calculate("1h3m2s")).toEqual(1 * 60 * 60 * 1000 + 3 * 60 * 1000 + 2 * 1000);
            expect(calculate("5 hours 3 minutes")).toEqual(5 * 60 * 60 * 1000 + 3 * 60 * 1000);
            expect(
                calculate({
                    hours: 5,
                    minutes: 3,
                }),
            ).toEqual(5 * 60 * 60 * 1000 + 3 * 60 * 1000);
        });

        test("should handle same unit multiple times", () => {
            expect(calculate("10 mins 10 sec 10 mins")).toEqual(10 * 60 * 1000 + 10 * 1000 + 10 * 60 * 1000);
            expect(calculate("10 mins 10 minutes")).toEqual(10 * 60 * 1000 + 10 * 60 * 1000);
            expect(calculate("10m10min10mins10minute10minutes")).toEqual(
                10 * 60 * 1000 + 10 * 60 * 1000 + 10 * 60 * 1000 + 10 * 60 * 1000 + 10 * 60 * 1000,
            );
        });

        test("should handle random words", () => {
            expect(calculate("foo")).toEqual(0);
            expect(calculate("hello world")).toEqual(0);
            expect(calculate("10 mins 1000")).toEqual(10 * 60 * 1000);
            expect(calculate("200 dogs")).toEqual(0);
        });

        test("should handle math like inputs", () => {
            expect(calculate("2 mins - 60 secs - 60000 ms")).toEqual(0);
        });
    });

    describe("unit conversion", () => {
        test("should handle unit conversion for numbers", () => {
            expect(calculate(1000, "ms")).toEqual(1000);
            expect(calculate(1000, "s")).toEqual(1);
            expect(calculate(1000 * 60, "m")).toEqual(1);
            expect(calculate(1000 * 60, "h")).toEqual(1 / 60);
            expect(calculate(1000 * 60 * 60, "h")).toEqual(1);
        });

        test("should handle unit conversion for string", () => {
            expect(calculate("1sec", "ms")).toEqual(1000);
            expect(calculate("1sec", "s")).toEqual(1);
            expect(calculate("1min", "s")).toEqual(60);
            expect(calculate("1h", "m")).toEqual(60);
            expect(calculate("1d", "h")).toEqual(24);
            expect(calculate("1h", "d")).toEqual(1 / 24);
        });

        test("should throw on invalid unit", () => {
            expect(() => {
                calculate("1sec", "dogs" as TimeUnit);
            }).toThrow(Error);
        });
    });

    describe("delay", () => {
        test("should return a void promise", async () => {
            const value = delay(1);
            expect(value).toBeInstanceOf(Promise);
            await expect(value).resolves.toBeUndefined();
        });

        test("should delay", () => {
            let value = 0;
            delay({milliseconds: 50}).then(() => {
                value = 1;
                expect(value).toEqual(1);
            });
            expect(value).toEqual(0);
        });

        test("should delay with value", async () => {
            await expect(delay(0, {value: 0})).resolves.toEqual(0);
            await expect(delay(0, {value: null})).resolves.toEqual(null);
            await expect(delay(0, {value: undefined})).resolves.toEqual(undefined);
            await expect(delay(0, {value: 123})).resolves.toEqual(123);
            const objValue = new Date();
            await expect(delay(0, {value: objValue})).resolves.toEqual(objValue);
        });

        test("should reject", async () => {
            await expect(delay(0, {reject: true, value: null})).rejects.toBe(null);
            await expect(delay(0, {reject: true, value: "error"})).rejects.toBe("error");
            await expect(delay(0, {reject: true, value: new Error("test reject")})).rejects.toThrow(Error);
        });
    });
});
