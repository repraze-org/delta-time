const nanosecond = 1e-6;
const microsecond = 1e-3;
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const month = day * 30.44;
const year = day * 365.25;

const units = (function(){
    return [
        {match: ["ms", "milli", "millis", "millisecond", "milliseconds"], val: 1},
        {match: ["s", "sec", "secs", "second", "seconds"], val: second},
        {match: ["m", "min", "mins", "minute", "minutes"], val: minute},
        {match: ["h", "hr", "hrs", "hour", "hours"], val: hour},
        {match: ["d", "day", "days"], val: day},
        {match: ["w", "wk", "wks", "week", "weeks"], val: week},
        {match: ["mo", "mos", "month", "months"], val: month},
        {match: ["y", "yr", "yrs", "year", "years"], val: year},
        {match: ["μs", "micro", "micros", "microsecond", "microseconds"], val: microsecond},
        {match: ["ns", "nano", "nanos", "nanosecond", "nanoseconds"], val: nanosecond}
    ].reduce(function(units, u){
        u.match.forEach(function(name){
            units[name] = u.val;
        });
        return units;
    }, {});
})();

const match = /(-?\s*(\.\d+|\d+(\.\d*)?))\s*[a-zμ]+/g;
const split = /(-?[^a-zμ\s]+)([^\s]+)/;
const strip = /\s+/g;

const isString = function(s){
    return typeof s === "string" || s instanceof String;
};

module.exports = function(dt, unit){
    let divider = 1;
    if(unit != undefined){
        divider = isString(unit) ? units[unit.toLowerCase()] : null;
        if(!divider){
            throw new Error("Unit given as a second parameter is invalid");
        }
    }

    if(!isNaN(+dt)){
        return +dt / divider;
    }

    if(!isString(dt)){
        return 0;
    }

    const list = dt.toLowerCase().match(match);
    if(list){
        return (
            list.reduce(function(acc, val){
                const infos = val.replace(strip, "").match(split);
                const amount = parseFloat(infos[1], 10);
                const unit = infos[2].toLowerCase();

                const multipliyer = units[unit] || 0;

                return acc + amount * multipliyer;
            }, 0) / divider
        );
    }

    return 0;
};
