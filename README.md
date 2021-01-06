# delta-time

[![npm](https://img.shields.io/npm/v/delta-time.svg?logo=npm&style=flat-square)](https://www.npmjs.com/package/delta-time)
[![GitHub Workflow CI Status](https://img.shields.io/github/workflow/status/repraze-org/delta-time/CI?logo=github&style=flat-square)](https://github.com/repraze-org/delta-time/actions?query=workflow%3ACI)
[![Codecov](https://img.shields.io/codecov/c/github/repraze-org/delta-time.svg?logo=codecov&style=flat-square)](https://codecov.io/gh/repraze-org/delta-time)
[![GitHub](https://img.shields.io/github/license/repraze-org/delta-time.svg?logo=github&style=flat-square)](https://github.com/repraze-org/delta-time)
[![npm](https://img.shields.io/npm/dm/delta-time.svg?logo=npm&style=flat-square)](https://www.npmjs.com/package/delta-time)

A simple module to compute intervals

-   Simple function to parse user friendly intervals
-   Clear-up your code from messy time computations
-   Comes with a utility to delay a promise
-   Dependency free and typed

## Installation

    npm install delta-time

## Usage

```javascript
import {calculate as dt, delay} from "delta-time";

// human friendly string conversion
dt("2 days"); // 172800000
dt("1d"); // 86400000
dt("1 micro"); // 0.001
dt("1h1m1s", "sec"); // 3661

// typed objects
dt({hours: 1, minutes: 30}); // 5400000

// pass-through ms numbers
dt(123); // 123
dt(456, "sec"); // 0.456

// delay utility
await delay("1min"); // block and resolve to undefined
const out = await delay({seconds: 1}, {value: "⏲️ timey wimey"}); // block and resolve to value
await delay({seconds: 30}, {reject: true, value: new Error("💣 timed error")}); // block and throw value
```

### Perfect for timeouts and intervals

```javascript
setTimeout(function () {
    console.log("foo");
}, dt("500ms"));

setTimeout(function () {
    console.log("bar");
}, dt("5 secs"));

setTimeout(function () {
    console.log("baz");
}, dt("1h30m5s"));
```

### Allows complex specifications

```javascript
dt("- 1 day"); // -86400000
dt("2 hours - 30 seconds"); // 7170000
```

### Not just for milliseconds

```javascript
dt("1000 ms", "s"); // 1
dt("2 week", "days"); // 14
dt("300 Years, 5 Months and 2 Hours", "days"); // 109727.28333333334
```

## API

### calculate(time: TimeValue, unit?: TimeUnit): number

-   Takes a number, a string or an object describing a time interval
    -   A combination of units can be given
    -   For better typing, prefer the object
-   Returns the value of the interval in the specified unit (default is milliseconds)

### delay<T = undefined>(time: TimeValue, config?: DelayConfig<T>): Promise<T | undefined>

-   Takes a number, a string or an object describing a time interval to block
-   Takes an optional configuration object with:
    -   An optional `value` T field to resolve or error to reject
    -   An optional `reject` boolean field, set it to true to reject (default is false)
-   Returns a Promise that resolves or rejects the optional value given after the time given

## Language

| Unit        | Duration                | String units                 | Object key   |
| ----------- | ----------------------- | ---------------------------- | ------------ |
| nanosecond  | 10<sup>−9</sup> seconds | ns, nano(s), nanosecond(s)   | nanoseconds  |
| microsecond | 10<sup>−6</sup> seconds | μs, micro(s), microsecond(s) | microseconds |
| millisecond | 0.001 seconds           | ms, milli(s), millisecond(s) | milliseconds |
| second      | 1 seconds               | s, sec(s), second(s)         | seconds      |
| minute      | 60 seconds              | m, min(s), minute(s)         | minutes      |
| hour        | 60 minutes              | h, hr(s), hour(s)            | hours        |
| day         | 24 hours                | d, day(s)                    | days         |
| week        | 7 days                  | w, wk(s), week(s)            | weeks        |
| month       | 30.44 days              | mo(s), month(s)              | months       |
| year        | 365.25 days             | y, yr(s), year(s)            | years        |

## Environment import

The package is bundled in cjs and esm for bundlers.

### Bundler

```javascript
import dt from "delta-time";
```

```javascript
import {calculate as dt, delay} from "delta-time";
```

### NodeJs

```javascript
const {calculate: dt, delay} = require("delta-time");
```

### NodeJs (module)

```javascript
import dt from "delta-time";
const {calculate, delay} = dt;
```
