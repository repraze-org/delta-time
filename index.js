'use strict';

var nanosecond  = 1e-6,
    microsecond = 1e-3,
    second      = 1000,
    minute      = second * 60,
    hour        = minute * 60,
    day         = hour * 24,
    week        = day * 7,
    month       = day * 30.44,
    year        = day * 365.25;

var units = (function(){
    return [
        {match : ['ms','milli','millis','millisecond','milliseconds'],  val : 1},
        {match : ['s','sec','secs','second','seconds'],                 val : second},
        {match : ['m','min','mins','minute','minutes'],                 val : minute},
        {match : ['h','hr','hrs','hour','hours'],                       val : hour},
        {match : ['d','day','days'],                                    val : day},
        {match : ['w','wk','wks','week','weeks'],                       val : week},
        {match : ['mo','mos','month','months'],                         val : month},
        {match : ['y','yr','yrs','year','years'],                       val : year},
        {match : ['μs','micro','micros','microsecond','microseconds'],  val : microsecond},
        {match : ['ns','nano','nanos','nanosecond','nanoseconds'],      val : nanosecond}
    ].reduce(function(units, u){
        u.match.forEach(function(name){
            units[name] = u.val;
        });
        return units;
    }, {});
}());

var match   = /(\-?\s*(\.\d+|\d+(\.\d*)?))\s*[a-zμ]+/g;
var split   = /(-?[^a-zμ\s]+)([^\s]+)/;
var strip   = /\s+/g;

var isString = function(s){
    return typeof s === 'string' || s instanceof String;
}

module.exports = function(dt, unit){
    var divider = 1;
    if(unit != undefined){
        divider = isString(unit) ? units[unit.toLowerCase()] : null;
        if(!divider){
            throw new Error("Unit given as a second parameter is invalid");
        }
    }

    if(!isNaN(+dt)){
        return (+dt) / divider;
    }

    if(!isString(dt)){
        return 0;
    }

    var list = dt.toLowerCase().match(match);
    if(list){
        return list.reduce(function(acc, val){
            var infos = val.replace(strip, '').match(split);
            var amount = parseFloat(infos[1], 10);
            var unit = infos[2].toLowerCase();

            var multipliyer = units[unit] || 0;

            return acc + amount * multipliyer;
        }, 0) / divider;
    }

    return 0;
}
