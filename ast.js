//  ---------------------------------------------------------------------------------------------------------------  //
//  AST
//  ---------------------------------------------------------------------------------------------------------------  //

require('./colors.js');

var common = require('./common.js');

//  ---------------------------------------------------------------------------------------------------------------  //

var AST = function() {};

AST.prototype._init = function() {};

//  ---------------------------------------------------------------------------------------------------------------  //

//  FIXME: А это зачем?
AST.prototype.options = {};

//  ---------------------------------------------------------------------------------------------------------------  //

AST.prototype.error = function(s) {
    var pos = this.where;
    throw new Error( 'ERROR: ' + s + '\n' + pos.input.where(pos) );
};

//  ---------------------------------------------------------------------------------------------------------------  //

//  FIXME: Этот базовый метод в таком виде не используется вообще.
//  Он полностью перекрыт в yate/lib/ast.js.
/*
AST.prototype.make = function(id, params) {
    return this.factory.make(id, this.where, params);
};
*/

//  ---------------------------------------------------------------------------------------------------------------  //

AST.prototype.children = function() {
    var children = [];

    var props = this.p;
    for (var key in props) {
        var child = props[key];
        if (child !== undefined) {
            children.push(child);
        }
    }

    return children;
};

AST.prototype.applyChildren = function(callback, params) {
    var children = this.children();
    for (var i = 0, l = children.length; i < l; i++) {
        var child = children[i];
        if (child instanceof AST) {
            callback(child, params);
        }
    }
};

AST.prototype.walkAfter = function(callback, params, pKey, pObject) {
    var props = this.p;
    for (var key in props) {
        var child = props[key];
        //  FIXME: Нельзя ли заменить это на typeof?
        if (child instanceof AST) {
            child.walkAfter(callback, params, key, props);
        }
    }

    callback(this, params, pKey, pObject);
};

AST.prototype.walkBefore = function(callback, params, pKey, pObject) {
    callback(this, params, pKey, pObject);

    var props = this.p;
    for (var key in props) {
        var child = props[key];
        //  FIXME: Нельзя ли заменить это на typeof?
        if (child instanceof AST) {
            child.walkBefore(callback, params, key, props);
        }
    }
};

//  ---------------------------------------------------------------------------------------------------------------  //

AST.prototype.setParents = function(parent) {
    this.parent = parent;
    var that = this;
    this.applyChildren(function(ast, parent) {
        ast.setParents(that);
    });
};

AST.prototype.is = function(type) {
    //  FIXME: Где это вообще применяется?
    if (type instanceof Array) {
        for (var i = 0, l = type.length; i < l; i++) {
            if (this instanceof this.factory.get( type[i]) ) {
                return true;
            }
        }
    } else {
        return this instanceof this.factory.get(type);
    }
};

//  ---------------------------------------------------------------------------------------------------------------  //

AST.prototype.toString = function() {
    var r = [];
    var props = this.p;
    for (var key in props) {
        var child = props[key];
        if (child !== undefined) {
            if (child instanceof AST) {
                var s = child.toString();
                if (s) {
                    r.push( key.blue.bold + ': ' + s);
                }
            } else {
                r.push( key.blue.bold + ': ' + JSON.stringify(child) );
            }
        }
    }
    if (r.length) {
        var s = this.id.bold + '( ' + this.type().lime;
        if (this.AsType) {
            s += ' -> '.lime + this.AsType.lime;
        }
        s += ' )\n' + r.join('\n').replace(/^/gm, '    ');
        return s;
    }
    return '';
};

//  ---------------------------------------------------------------------------------------------------------------  //

module.exports = AST;

//  ---------------------------------------------------------------------------------------------------------------  //

