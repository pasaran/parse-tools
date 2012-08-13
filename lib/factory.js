var pt = require('./parse-tools.js');

require('./common.js');

//  ---------------------------------------------------------------------------------------------------------------  //
//  pt.Factory
//  ---------------------------------------------------------------------------------------------------------------  //

pt.Factory = function(base, asts) {
    this.asts = asts;
    this.ctors = {
        '': base
    };
};

//  ---------------------------------------------------------------------------------------------------------------  //

pt.Factory.prototype.make = function(id, where, params) {
    var ctor = this.get(id);
    var ast = new ctor();

    //  Хранилища для "свойств" и "флагов".
    //  Первое -- это то, что создает парсер и что потом доступно в шаблонах кодогенерации.
    //  Второе -- разные дополнительные вычисляемые свойства, которые используются в предикатах кодогенератора.
    ast.p = {};
    ast.f = {};

    //  Точка во входном потоке, соответствующая этому AST.
    ast.where = where;

    //  Вызываем "конструктор". Настоящие конструктор пустой для упрощения наследования.
    ast._init(params);

    return ast;
};

pt.Factory.prototype.get = function(id) {
    var ctor = this.ctors[id];

    if (!ctor) {
        ctor = function() {};

        var proto = this.asts[id] || {};
        var options = proto.options = proto.options || {};

        var base = this.get(options.base || '');

        var mixin = [];
        if (options.mixin) {
            options.mixin = pt.common.makeArray(options.mixin);
            var that = this;
            mixin = options.mixin.map(function(id) {
                return that.asts[id] || {};
            });
        }
        mixin.push(proto);

        pt.common.inherit(ctor, base, mixin);

        ctor.prototype.id = id;
        ctor.prototype.factory = this;

        this.ctors[id] = ctor;
    }

    return ctor;
};

//  ---------------------------------------------------------------------------------------------------------------  //

