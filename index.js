'use strict';

var second  = 1000,
    minute  = second * 60,
    hour    = minute * 60,
    day     = hour * 24,
    week    = day * 7,
    month   = day * 30.44,
    year    = day * 365.25;

var units = [
    {match : ['ms','milli','millis','millisecond','milliseconds'],  val : 1},
    {match : ['s','sec','secs','second','seconds'],                 val : second},
    {match : ['m','min','mins','minute','minutes'],                 val : minute},
    {match : ['h','hr','hrs','hour','hours'],                       val : hour},
    {match : ['d','day','days'],                                    val : day},
    {match : ['w','wk','wks','week','weeks'],                       val : week},
    {match : ['mo','mos','month','months'],                         val : month},
    {match : ['y','yr','yrs','year','years'],                       val : year},
];

var getMultipliyer = function(unit){
    var u = units.find(function(u){
        return u.match.indexOf(unit) >= 0;
    });
    if(u){
        return u.val;
    }
    return 0
};

var match   = /(\-?\s*(\.\d+|\d+(\.\d*)?))\s*[a-z]+/g;
var split   = /(-?[^a-z\s]+)([^\s]+)/;
var strip   = /\s+/g;

module.exports = function(dt){
    if(!isNaN(+dt)){
        return +dt;
    }

    if(!(typeof dt === 'string' || dt instanceof String)){
        return 0;
    }

    return dt.match(match).reduce(function(acc, val){
        var infos = val.replace(strip, '').match(split);
        var amount = parseFloat(infos[1], 10);
        var unit = infos[2].toLowerCase();

        var multipliyer = getMultipliyer(unit);

        return acc + amount * multipliyer;
    }, 0);
}
