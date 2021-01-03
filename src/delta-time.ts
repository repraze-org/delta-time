// utilities
function isString(val: any): val is string {
    return typeof val === "string" || val instanceof String;
}

function isNumeric(val: any): val is number {
    return !isNaN(parseFloat(val)) && isFinite(val);
}

function isObject(val: any): val is Record<string, any> {
    return typeof val === "object" && val !== null;
}

// time definition
const NANO_TIME_VALUE = 1e-6;
const NANO_TIME_UNITS = ["ns", "nano", "nanos", "nanosecond", "nanoseconds"] as const;
export type NanoTimeUnit = typeof NANO_TIME_UNITS[number];

const MICRO_TIME_VALUE = 1e-3;
const MICRO_TIME_UNITS = ["μs", "micro", "micros", "microsecond", "microseconds"] as const;
export type MicroTimeUnit = typeof MICRO_TIME_UNITS[number];

const MILLI_TIME_VALUE = 1;
const MILLI_TIME_UNITS = ["ms", "milli", "millis", "millisecond", "milliseconds"] as const;
export type MilliTimeUnit = typeof MILLI_TIME_UNITS[number];

const SECOND_TIME_VALUE = 1000;
const SECOND_TIME_UNITS = ["s", "sec", "secs", "second", "seconds"] as const;
export type SecondTimeUnit = typeof SECOND_TIME_UNITS[number];

const MINUTE_TIME_VALUE = SECOND_TIME_VALUE * 60;
const MINUTE_TIME_UNITS = ["m", "min", "mins", "minute", "minutes"] as const;
export type MinuteTimeUnit = typeof MINUTE_TIME_UNITS[number];

const HOUR_TIME_VALUE = MINUTE_TIME_VALUE * 60;
const HOUR_TIME_UNITS = ["h", "hr", "hrs", "hour", "hours"] as const;
export type HourTimeUnit = typeof HOUR_TIME_UNITS[number];

const DAY_TIME_VALUE = HOUR_TIME_VALUE * 24;
const DAY_TIME_UNITS = ["d", "day", "days"] as const;
export type DayTimeUnit = typeof DAY_TIME_UNITS[number];

const WEEK_TIME_VALUE = DAY_TIME_VALUE * 7;
const WEEK_TIME_UNITS = ["w", "wk", "wks", "week", "weeks"] as const;
export type WeekTimeUnit = typeof WEEK_TIME_UNITS[number];

const MONTH_TIME_VALUE = DAY_TIME_VALUE * 30.44;
const MONTH_TIME_UNITS = ["mo", "mos", "month", "months"] as const;
export type MonthTimeUnit = typeof MONTH_TIME_UNITS[number];

const YEAR_TIME_VALUE = DAY_TIME_VALUE * 365.25;
const YEAR_TIME_UNITS = ["y", "yr", "yrs", "year", "years"] as const;
export type YearTimeUnit = typeof YEAR_TIME_UNITS[number];

const TIME_UNITS: {units: readonly string[]; value: number}[] = [
    {units: NANO_TIME_UNITS, value: NANO_TIME_VALUE},
    {units: MICRO_TIME_UNITS, value: MICRO_TIME_VALUE},
    {units: MILLI_TIME_UNITS, value: MILLI_TIME_VALUE},
    {units: SECOND_TIME_UNITS, value: SECOND_TIME_VALUE},
    {units: MINUTE_TIME_UNITS, value: MINUTE_TIME_VALUE},
    {units: HOUR_TIME_UNITS, value: HOUR_TIME_VALUE},
    {units: DAY_TIME_UNITS, value: DAY_TIME_VALUE},
    {units: WEEK_TIME_UNITS, value: WEEK_TIME_VALUE},
    {units: MONTH_TIME_UNITS, value: MONTH_TIME_VALUE},
    {units: YEAR_TIME_UNITS, value: YEAR_TIME_VALUE},
];
const TIME_UNIT_MAP = TIME_UNITS.reduce<{[unit: string]: number}>((out, define) => {
    define.units.forEach((unit) => {
        out[unit] = define.value;
    });
    return out;
}, {});

// types
export type TimeUnit =
    | NanoTimeUnit
    | MicroTimeUnit
    | MilliTimeUnit
    | SecondTimeUnit
    | MinuteTimeUnit
    | HourTimeUnit
    | DayTimeUnit
    | WeekTimeUnit
    | MonthTimeUnit
    | YearTimeUnit;

// time interface for object had a subset of the units for clean declarations
export interface timeObject {
    nanoseconds?: number;
    microseconds?: number;
    milliseconds?: number;
    seconds?: number;
    minutes?: number;
    hours?: number;
    days?: number;
    weeks?: number;
    months?: number;
    years?: number;
}

type timeValue = string | number | timeObject;

// calc method

const MATCH_REGEXP = /(-?\s*(\.\d+|\d+(\.\d*)?))\s*[a-zμ]+/g;
const SPLIT_REGEXP = /(-?[^a-zμ\s]+)([^\s]+)/;
const STRIP_REGEXP = /\s+/g;

export function calc(time: timeValue, unit?: TimeUnit): number {
    // find what return unit to use
    let divider: number | undefined = 1;
    if (unit != undefined) {
        divider = isString(unit) ? TIME_UNIT_MAP[unit.toLowerCase()] : undefined;
        if (!divider) {
            throw new Error("Unit given as a second parameter is invalid");
        }
    }

    // handle time types
    if (isNumeric(time)) {
        return +time / divider;
    }

    if (isObject(time)) {
        let value = 0;
        for (const [unit, amount] of Object.entries(time)) {
            const multiplier = TIME_UNIT_MAP[unit];
            if (multiplier !== undefined) {
                value += amount * multiplier;
            }
        }
        return value;
    }

    if (isString(time)) {
        const list = time.toLowerCase().match(MATCH_REGEXP);
        if (list) {
            return (
                list.reduce<number>((value, element) => {
                    const components = element.replace(STRIP_REGEXP, "").match(SPLIT_REGEXP);

                    if (components && components[1] !== undefined && components[2] !== undefined) {
                        const amount = parseFloat(components[1]);
                        const unit = components[2].toLowerCase();
                        const multiplier = TIME_UNIT_MAP[unit];
                        if (multiplier !== undefined) {
                            return value + amount * multiplier;
                        }
                    }
                    // skip
                    return value;
                }, 0) / divider
            );
        }
    }

    // if all else fails, return 0
    return 0;
}

// delay utility

export async function delay(time: timeValue): Promise<void> {
    return new Promise<void>((res, rej) => {
        setTimeout(() => {
            res();
        }, calc(time));
    });
}
