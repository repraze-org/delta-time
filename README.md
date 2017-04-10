# delta-time

[![Build Status](https://travis-ci.org/repraze-org/delta-time.svg?branch=master)](https://travis-ci.org/repraze-org/delta-time)

A simple module to compute intervals

* Simple function to parse user friendly intervals
* Clear-up your code from messy time computations
* Plug it into your utility to ease the interface

## Installation

    npm install delta-time

## Usage

```javascript
var deltaTime = require('delta-time');

// using the utility

setTimeout(function(){
    console.log("foo");
}, deltaTime("500ms"));

setTimeout(function(){
    console.log("bar");
}, deltaTime("5 secs"));

setTimeout(function(){
    console.log("baz");
}, deltaTime("1h30m5s"));
```

## API

### function(time)

* Takes a number or a string describing a time interval
* A combination of units can be given
* Returns the value of the interval in ms

## Language

* millisecond   : ms, milli(s), millisecond(s)
* second        : s, sec(s), second(s)
* minute        : m, min(s), minute(s)
* hour          : h, hr(s), hour(s)
* day           : d, day(s)
* week          : w, wk(s), week(s)
* month         : mo(s), month(s)
* year          : y, yr(s), year(s)
