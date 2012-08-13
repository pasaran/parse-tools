var pt = require('./parse-tools.js');

//  ---------------------------------------------------------------------------------------------------------------  //
//  pt.common
//  ---------------------------------------------------------------------------------------------------------------  //

pt.common = {};

//  ---------------------------------------------------------------------------------------------------------------  //

pt.common.inherit = function(class_, base, mixins) {
    var F = function() {};
    F.prototype = base.prototype;
    var proto = class_.prototype = new F();

    if (mixins) {
        for (var i = 0, l = mixins.length; i < l; i++) {
            pt.common.extend( proto, mixins[i] );
        }
    }

    proto.super_ = base.prototype;
    proto.constructor = class_;
};

//  ---------------------------------------------------------------------------------------------------------------  //

pt.common.extend = function(dest, src) {
    for (var key in src) {
        dest[key] = src[key];
    }
};

//  ---------------------------------------------------------------------------------------------------------------  //

pt.common.makeArray = function(o) {
    return (o instanceof Array) ? o : [ o ];
};

//  ---------------------------------------------------------------------------------------------------------------  //

//  FIXME: Использовать эти две функции из runtime.
pt.common.quoteText = function(s) {
    if (s == null) { return ''; }
    s = s.toString(s);
    s = s.replace(/&(?![A-Za-z#]\w+;)/g, '&amp;');
    s = s.replace(/</g, '&lt;');
    s = s.replace(/>/g, '&gt;');
    return s;
};

pt.common.quoteAttr = function(s) {
    if (s == null) { return ''; }
    s = s.toString(s);
    s = s.replace(/&(?![A-Za-z#]\w+;)/g, '&amp;');
    s = s.replace(/</g, '&lt;');
    s = s.replace(/>/g, '&gt;');
    s = s.replace(/"/g, '&quot;');
    return s;
};

//  FIXME: Использовать JSON.stringify().
pt.common.quote = function(s) {
    s = s.replace("'", "\\'");
    return "'" + s + "'";
};

//  ---------------------------------------------------------------------------------------------------------------  //

pt.common.nop = function() {};

pt.common.true = function() { return true; };
pt.common.false = function() { return false; };

//  ---------------------------------------------------------------------------------------------------------------  //

