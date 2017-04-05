var second  = 1000,
    minute  = second * 60
    hour    = minute * 60,
    day     = hour * 24,
    week    = day * 7,
    month   = day * 30.44,
    year    = day * 365;

var units = [
    {match : /ms|millis?|milliseconds?/, val : 1},
    {match : /s|secs?|seconds?/, val : second},
    {match : /m|mins?|minutes?/, val : minute},
    {match : /h|hrs?|hours?/, val : hour},
    {match : /d|days?/, val : day},
    {match : /w|wks?|weeks?/, val : week},
    {match : /mos?|months?/, val : month},
    {match : /y|yrs?|years?/, val : year},
];

var dt = function(dt){
    if(!(typeof dt === 'string' || dt instanceof String)){
        if(!isNaN(dt)){
            return dt;
        }
        return undefined;
    }

    var getMultipliyer = function(unit){
        var u = units.find(function(u){
            return unit.match(u.match);
        });
        if(u){
            return u.val;
        }
        return 0
    }

    return dt.match(/\-?\d+\s*[a-z]+/g).map(function(s){
        return s.replace(/\s/g, '');
    }).reduce(function(acc, val){
        var infos = val.split(/(-?\d+)/);
        var amount = parseInt(infos[1], 10);
        var unit = infos[2].toLowerCase();

        var multipliyer = getMultipliyer(unit);

        return acc + amount * multipliyer;
    }, 0);
};
