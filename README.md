# delta-time

[![npm](https://img.shields.io/npm/v/delta-time.svg?logo=npm&style=flat-square)](https://www.npmjs.com/package/delta-time) [![Travis (.org)](https://img.shields.io/travis/repraze-org/delta-time.svg?logo=travis&style=flat-square)](https://travis-ci.org/repraze-org/delta-time) [![Codecov](https://img.shields.io/codecov/c/github/repraze-org/delta-time.svg?logo=codecov&style=flat-square)](https://codecov.io/gh/repraze-org/delta-time) [![GitHub](https://img.shields.io/github/license/repraze-org/delta-time.svg?logo=github&style=flat-square)](https://github.com/repraze-org/delta-time) [![npm](https://img.shields.io/npm/dm/delta-time.svg?logo=npm&style=flat-square)](https://www.npmjs.com/package/delta-time)

A simple module to compute intervals

-   Simple function to parse user friendly intervals
-   Clear-up your code from messy time computations
-   Plug it into your utility to ease the interface

## Installation

    npm install delta-time

## Usage

```javascript
const dt = require("delta-time");

dt("2 days"); // 172800000
dt("1d"); // 86400000
dt("1 micro"); // 0.001
dt("1h1m1s"); // 3661000
```

### Perfect for timeouts

```javascript
setTimeout(function() {
    console.log("foo");
}, dt("500ms"));

setTimeout(function() {
    console.log("bar");
}, dt("5 secs"));

setTimeout(function() {
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

### function(time, [unit])

-   Takes a number or a string describing a time interval
-   A combination of units can be given
-   Returns the value of the interval in ms
-   If a unit is provided, it will be used instead of ms

## Language

-   nanosecond : ns, nano(s), nanosecond(s)
-   microsecond : μs, micro(s), microsecond(s)
-   millisecond : ms, milli(s), millisecond(s)
-   second : s, sec(s), second(s)
-   minute : m, min(s), minute(s)
-   hour : h, hr(s), hour(s)
-   day : d, day(s)
-   week : w, wk(s), week(s)
-   month : mo(s), month(s)
-   year : y, yr(s), year(s)
